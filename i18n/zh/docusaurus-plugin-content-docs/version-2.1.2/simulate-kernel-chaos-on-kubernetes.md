---
title: 模拟 Linux 内核故障
---

本文介绍如何使用 KernelChaos 模拟 Linux 内核故障。该功能通过使用 [BPF](https://lore.kernel.org/lkml/20171213180356.hsuhzoa7s4ngro2r@destiny/T/) 在指定内核路径上注入基于 I/O 或内存的故障。

尽管 KernelChaos 的注入对象可以设置成一个或几个 Pod，但所属主机的其他 Pod 的性能也会受到一些影响，因为所有的 Pod 共享同一个内核。

::: warning 警告

模拟 Linux 内核故障的功能默认关闭，请不要用于生产环境。

:::

## 准备条件

- Linux 内核: 版本 >= 4.18
- 已启动 Linux 内核配置项 [CONFIG_BPF_KPROBE_OVERRIDE](https://cateee.net/lkddb/web-lkddb/BPF_KPROBE_OVERRIDE.html)
- 已设置 [values.yaml](https://github.com/chaos-mesh/chaos-mesh/blob/master/helm/chaos-mesh/values.yaml) 中 `bpfki.create` 配置项的值为 `true`

## 配置文件

下面是一个简单的 KernelChaos 配置文件：

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: KernelChaos
metadata:
  name: kernel-chaos-example
  namespace: chaos-testing
spec:
  mode: one
  selector:
    namespaces:
      - chaos-mount
  failKernRequest:
    callchain:
      - funcname: '__x64_sys_mount'
    failtype: 0
```

更多的配置示例，请参考 [examples](https://github.com/chaos-mesh/chaos-mesh/tree/master/examples)。你可按需修改这些配置示例。

配置说明：

- **mode** 指定实验的运行方式，可选择的方式包括：

  - `one`：表示随机选出一个符合条件的 Pod
  - `all`：表示选出所有符合条件的 Pod
  - `fixed`：表示选出指定数量且符合条件的 Pod
  - `fixed-percent`：表示选出符合条件的 Pod 中指定百分比的 Pod
  - `random-max-percent`：表示选出占符合条件的 Pod 中不超过指定百分比的 Pod

- **selector** 指定需要注入故障的目标 Pods。
- **failedkernRequest** 指定故障模式 (kmalloc, bio 等)，可以指定一个具体的调用链路径和可选的过滤条件。配置项包括：

  - **failtype** 指定故障类型，可设置的值包括：

    - '0'：表明注入 slab 分配错误 should_failslab。
    - '1'：表明注入 内存页分配错误 should_fail_alloc_page。
    - '2'：表明注入 bio 错误 should_fail_bio。

    对于这三种故障的更多信息，请参考 [fault-injection](https://www.kernel.org/doc/html/latest/fault-injection/fault-injection.html) 和 [inject_example](http://github.com/iovisor/bcc/blob/master/tools/inject_example.txt)。

  - **callchain** 指定一个具体的调用链，例如：

    ```c
    ext4_mount
    -> mount_subtree
    -> ...
        -> should_failslab
    ```

    也可以使用函数参数作为过滤条件，进一步细粒度的故障注入。请参考 [call chain and predicate examples](https://github.com/chaos-mesh/bpfki/tree/develop/examples) 来获得更多信息。如果没有指定调用链，请保持 `callchain` 为空，表明它将在任意调用 slab alloc 的路径（比如 kmalloc）上注入故障。

    调用链的类型是 frame 数组，由以下三个部分组成：

    - **funcname**：可以从内核源码或 `/proc/kallsyms` 中找到 `funcname`，比如 `ext4_mount`。
    - **parameters**：用于过滤。如果你想在 `d_alloc_parallel(struct dentry *parent, const struct qstr *name)`（其中 `name` 为 `bananas`）路径上注入 slab 错误，你需要将 parameters 设置为 `struct dentry *parent, const struct qstr *name` 否则省略此配置。
    - **predicate**：用于访问 frame 数组的参数，以 **parameters** 为例，你可以把它设置为 `STRNCMP(name->name, "bananas", 8)` 来控制故障注入路径，也可以不设置，使得所有执行 `d_alloc_parallel` 的调用路径都注入 slab 故障。

  - **headers** 指定你需要的内核头文件，比如："linux/mmzone.h"，"linux/blkdev.h" 等。
  - **probability** 指定故障发生概率，如果你想要 1% 的概率，请将其设置为 '1'.
  - **times** 指定触发故障的最大次数。

## 使用 kubectl 创建实验

使用 kubectl 创建实验，命令如下：

```bash
kubectl apply -f KernelChaos
```

KernelChaos 功能和 [inject.py](https://github.com/iovisor/bcc/blob/master/tools/inject.py) 类似，你可以阅读 [inject_example.txt](https://github.com/iovisor/bcc/blob/master/tools/inject_example.txt) 来获得更多的信息。

下面是一个简单的例子：

```c
#include <sys/mount.h>
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>

int main(void) {
  int ret;
  while (1) {
    ret = mount("/dev/sdc", "/mnt", "ext4",
          MS_MGC_VAL | MS_RDONLY | MS_NOSUID, "");
    if (ret < 0)
      fprintf(stderr, "%s\n", strerror(errno));
    sleep(1);
    ret = umount("/mnt");
    if (ret < 0)
      fprintf(stderr, "%s\n", strerror(errno));
  }
}
```

在故障注入期间，输出如下：

```console
> Cannot allocate memory
> Invalid argument
> Cannot allocate memory
> Invalid argument
> Cannot allocate memory
> Invalid argument
> Cannot allocate memory
> Invalid argument
> Cannot allocate memory
> Invalid argument
```

## 使用限制

通过 container_id 可以限制故障注入范围，但有些路径会触发系统级别的行为。比如：

当 `failtype` 为 `1` 时，它意味着物理页面分配失败。如果这个事件在很短的时间内频繁触发（例如，`while (1) {memset(malloc(1M), '1', 1M)}`），会触发系统调用 oom-killer 来回收内存。
