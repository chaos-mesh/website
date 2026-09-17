---
title: Simulate Linux Kernel Faults
---

This document describes how to use KernelChaos to simulate Linux kernel faults. This feature injects I/O-based or memory-based faults into the specified kernel paths using [BPF](https://lore.kernel.org/lkml/20171213180356.hsuhzoa7s4ngro2r@destiny/T/).

Although you can set the injection target of KernelChaos to one or several Pods, the performance of other Pods on the host will be affected, because all Pods share the same kernel.

:::warning

The simulation of Linux kernel faults is disabled by default. Do not use this feature in a production environment.

:::

## Prerequisites

- Linux kernel version >= 4.18.
- The Linux kernel configuration [CONFIG_BPF_KPROBE_OVERRIDE](https://cateee.net/lkddb/web-lkddb/BPF_KPROBE_OVERRIDE.html) is enabled.
- The `bpfki.create` configuration value in [values.yaml](https://github.com/chaos-mesh/chaos-mesh/blob/master/helm/chaos-mesh/values.yaml) is `true`.

## Configuration file

A simple KernelChaos configuration file is as follows:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: KernelChaos
metadata:
  name: kernel-chaos-example
  namespace: chaos-mesh
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

For more configuration examples, refer to [examples](https://github.com/chaos-mesh/chaos-mesh/tree/master/examples). You can modify these configuration examples as needed.

Configuration description:

- **mode** specifies how the experiment runs. The options are as follows:

  - `one`: randomly selects an eligible Pod.
  - `all`: selects all eligible Pods.
  - `fixed`: selects a specified number of eligible Pods.
  - `fixed-percent`: selects a specified percentage of eligible Pods.
  - `random-max-percent`: selects the maximum percentage of eligible Pods.

- **selector** specifies the target Pod for fault injection.
- **FailedkernRequest** specifies the fault mode (such as kmallo and bio). It also specifies a specific call chain path and the optional filtering conditions. The configuration items are as follows:

  - **Failtype** specifies the fault type. The value options are as follows:

    - '0': injects the slab allocation error should_failslab.
    - '1': injects the memory page allocation error should_fail_alloc_page.
    - '2': injects the bio error should_fail_bio.

    For more information on these three fault types, refer to [fault-injection](https://www.kernel.org/doc/html/latest/fault-injection/fault-injection.html) and [inject_example](http://github.com/iovisor/bcc/blob/master/tools/inject_example.txt).

  - **Callchain** specifies a specific call chain. For example:

    ```c
    ext4_mount
    -> mount_subtree
    -> ...
        -> should_failslab
    ```

    You can also use the function parameters as filtering rules to inject more fine-grained faults. Refer to [call chain and predicate examples](https://github.com/chaos-mesh/bpfki/tree/develop/examples) for more information. If no call chain is specified, keep the `callchain` field empty, indicating that faults will be injected to any path on which slab alloc is called (for example, kmallo).

    The call chain type is a frame array, consisting of the following three parts:

    - **funcname**, which can be found from the kernel source code or from `/proc/kallsyms`, such as `ext4_mount`.
    - **parameters**, which is used for filtering. If you want to inject a slab error on the `d_alloc_parallel(struct dentry *parent, const struct qstr *name)` with a special name `bananas` path, you need to set the `parameters` to `struct dentry *parent, const struct qstr *name`. Otherwise, omit this configuration.
    - **predicate**, which is used to access the parameters of the frame array. Taking **parameters** as an example, you can set it to `STRNCMP(name->name, "bananas", 8)` to control the path of fault injection, or you can leave it empty for all call paths that execute `d_allo_parallel` receive the slab fault injection.

  - **headers** specifies the kernel header file you need. For example, "linux/mmzone.h" and "linux/blkdev.h".
  - **probability** specifies the probability of faults. If you want the probability of 1%, set to '1'.
  - **times** specifies the maximum number of times a fault is triggered.

## Create an experiment using kubectl

Use `kubectl` to create an experiment:

```bash
kubectl apply -f KernelChaos
```

The KernelChaos feature is similar to [inject.py](https://github.com/iovisor/bcc/blob/master/tools/inject.py). For more information, refer to [input_example.txt](https://github.com/iovisor/bcc/blob/master/tools/inject_example.txt).

A simple example is as follows:

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

During the fault injection, the output is as follows:

```
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

## Usage restriction

You can use container_id to limit the scope of the fault injection, but some paths trigger system-level behaviors. For example:

When `failtype` is `1`, it means that the physical page allocation fails. If this event is frequently triggered within a short period of time (for example, `while (1) {memset(malloc(1M), '1', 1M)}`), the oom-killer system call is triggered to recycle memory.
