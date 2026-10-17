---
title: 模拟块设备故障
---

## BlockChaos 简介

Chaos Mesh 提供了 BlockChaos 实验类型。你可以使用该实验类型来模拟块设备的延迟场景。本文档介绍如何安装 BlockChaos 实验所需的依赖，以及如何创建 BlockChaos 实验。

:::note

BlockChaos 目前仍处于早期阶段，其安装和配置体验会持续改进。如果你发现任何问题，请在 [chaos-mesh/chaos-mesh](https://github.com/chaos-mesh/chaos-mesh) 中提交 issue 进行反馈。

:::

:::note

BlockChaos 的 `delay` 操作会影响所有使用该块设备的进程，而不仅仅是目标容器。

:::

## 安装内核模块

BlockChaos 的 `delay` 操作依赖 [chaos-driver](https://github.com/chaos-mesh/chaos-driver) 内核模块。该故障只能注入到已安装此模块的机器上。目前，你需要手动编译并安装该模块。

1. 使用以下命令下载该模块的源代码：

   ```bash
   curl -fsSL -o chaos-driver-v0.2.1.tar.gz https://github.com/chaos-mesh/chaos-driver/archive/refs/tags/v0.2.1.tar.gz
   ```

2. 解压 `chaos-driver-v0.2.1.tar.gz` 文件：

   ```bash
   tar xvf chaos-driver-v0.2.1.tar.gz
   ```

3. 准备当前内核的头文件。如果你使用 CentOS/Fedora，可以使用 `yum` 安装内核头文件：

   ```bash
   yum install kernel-devel-$(uname -r)
   ```

   如果你使用 Ubuntu/Debian，可以使用 `apt` 安装内核头文件：

   ```bash
   apt install linux-headers-$(uname -r)
   ```

4. 编译模块：

   ```bash
   cd chaos-driver-v0.2.1
   make driver/chaos_driver.ko
   ```

5. 安装内核模块：

   ```bash
   insmod ./driver/chaos_driver.ko
   ```

`chaos_driver` 模块在每次重启后都需要重新安装。要让模块自动加载，可以将模块复制到 `/lib/modules/$(uname -r)/kernel/drivers` 的子目录中，运行 `depmod -a`，然后将 `chaos_driver` 添加到 `/etc/modules` 中。

如果你升级了内核，则需要重新编译该模块。

:::note

建议使用 DKMS 或 akmod 来自动编译或加载内核模块。如果你想帮助我们改进安装体验，欢迎创建 DKMS 或 akmod 包并提交到各个发行版的仓库中。

:::

## 使用 YAML 文件创建实验

1. 将实验配置写入 YAML 配置文件。以下以 `block-latency.yaml` 文件为例。

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: BlockChaos
   metadata:
     name: hostpath-example-delay
   spec:
     selector:
       labelSelectors:
         app: hostpath-example
     mode: all
     volumeName: hostpath-example
     action: delay
     delay:
       latency: 1s
   ```

   :::note

   目前仅支持 hostPath 或本地卷（local volume）。

   :::

2. 使用 `kubectl` 创建实验：

   ```bash
   kubectl apply -f block-latency.yaml
   ```

实验创建后，你可以观察到以下变化：

1. 块设备的 I/O 调度器（elevator）被改为 `ioem` 或 `ioem-mq`。你可以通过 `cat /sys/block/<device>/queue/scheduler` 查看。
2. `ioem` 或 `ioem-mq` 调度器会接收到 I/O 请求，并按指定时间延迟这些请求。

YAML 配置文件中的字段说明如下表所示：

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| `mode` | string | 指定实验的运行方式，可选择的方式包括：`one`（表示随机选出一个符合条件的 Pod）、`all`（表示选出所有符合条件的 Pod）、`fixed`（表示选出指定数量且符合条件的 Pod）、`fixed-percent`（表示选出占符合条件的 Pod 中指定百分比的 Pod）、`random-max-percent`（表示选出占符合条件的 Pod 中不超过指定百分比的 Pod） | 无 | 是 | `one` |
| `value` | string | 取决于 `mode` 的取值，为 `mode` 提供参数。例如，当 `mode` 设置为 `fixed-percent` 时，`value` 指定 Pod 的百分比 | 无 | 否 | `1` |
| `selector` | struct | 指定目标 Pod。详情请参见[定义实验范围](./define-chaos-experiment-scope.md) | 无 | 是 |  |
| `volumeName` | string | 指定要在目标 Pod 中注入故障的卷。该卷在 Pod 的 `.spec.volumes` 中应有对应的条目 | 无 | 是 | `hostpath-example` |
| `action` | string | 指定故障类型。目前仅支持 `delay`，用于模拟块设备的延迟 | 无 | 是 | `delay` |
| `delay.latency` | string | 指定块设备的延迟时间 | 无 | 是（当 `action` 为 `delay` 时） | `500ms` |
