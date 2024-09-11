---
title: 使用 Chaos Mesh 创建物理机故障
---

本文档介绍如何在 Chaos Mesh 中创建 PhysicalMachineChaos 混沌实验，以模拟物理机或虚拟机中的网络、磁盘、压力、JVM、时间等故障。

## PhysicalMachineChaos 介绍

PhysicalMachineChaos 用于在物理机或虚拟机中模拟网络、磁盘、压力、JVM、时间等故障。在使用 Chaos Mesh 的 PhysicalMachineChaos 功能之前，你需要在物理机或虚拟机上部署 Chaosd。Chaos Mesh 与 Chaosd 的版本对应关系如下：

| Chaos Mesh 版本 | Chaosd 版本 |
| :-------------- | :---------- |
| v2.1.x          | v1.1.x      |
| v2.2.x          | v1.2.x      |

## 运行 Chaosd Server

在使用 Chaos Mesh 创建 PhysicalMachineChaos 混沌实验前，你需要在待注入故障的所有物理机或虚拟机中部署服务模式的 Chaosd。部署 Chaosd 后运行 Chaosd Server 的方式如下：

1. 部署 Chaosd 后，生成 TLS 证书，并创建 `PhysicalMachine`：

   - 有关部署的具体方法，请参考 [Chaosd 的下载和部署](chaosd-overview.md#下载和部署)。
   - 完成部署后，在运行 Chaosd Server **前**，需要先生成 TLS 证书，并在 Kubernetes 集群内创建 `PhysicalMachine`。有关 TLS 证书的生成方式，请参考 [Chaosctl 为 Chaosd 生成证书](chaosctl-tool.md#为-chaosd-生成-tls-证书)。

2. 运行 Chaosd：

   - 使用 Chaosctl 生成了 TSL 证书文件后，可以运行以下命令，启动服务模式的 Chaosd：

     ```bash
     chaosd server --https-port 31768 --CA=/etc/chaosd/pki/ca.crt --cert=/etc/chaosd/pki/chaosd.crt --key=/etc/chaosd/pki/chaosd.key
     ```

     :::note 注意

     使用 Chaosctl 生成的 TLS 证书文件的保存路径为 Chaosctl 的默认输出路径。如果在生成证书时手动指定了其他路径，请手动将命令中的路径替换为对应的文件路径。

     :::

   - 如果没有通过 Chaosctl 配置 TLS 证书，可以运行以下命令，启动服务模式的 Chaosd。但考虑到集群的安全性，**不推荐**使用这个方式：

     ```bash
     chaosd server --port 31767
     ```

## 使用 Dashboard 方式创建实验

1. 打开 Chaos Dashboard 面板，单击实验页面中的**新的实验**按钮创建实验：

   ![创建实验](./img/create-new-exp.png)

2. 在**实验类型**处选择**物理**，然后选择具体实验类型，例如**网络攻击**。然后选择具体的行为，最后再填写相应的配置：

   ![PhysicalMachineChaos 实验](./img/physicalmachinechaos-exp.png)

3. 填写实验信息，指定实验范围以及实验计划运行时间：

   ![实验信息](./img/physicalmachinechaos-exp-info.png)

4. 提交实验。

## 使用 YAML 方式创建实验

1. 将实验配置写入到文件 `physicalmachine.yaml` 中，写入内容的示例如下：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: PhysicalMachineChaos
   metadata:
     name: physical-network-delay
     namespace: chaos-mesh
   spec:
     action: network-delay
     mode: one
     selector:
       namespaces:
         - default
       labelSelectors:
         'arch': 'amd64'
     network-delay:
       device: ens33
       ip-address: 140.82.112.3
       latency: 1000ms
     duration: '10m'
   ```

   该实验配置向指定物理机或虚拟机中的 Chaosd 服务发送 HTTP 请求，触发网络延迟实验。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f physicalmachine.yaml
   ```

### 配置说明

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | string | 定义物理机故障的行为，可选值为 `stress-cpu`, `stress-mem`, `disk-read-payload`, `disk-write-payload`, `disk-fill`, `network-corrupt`, `network-duplicate`, `network-loss`, `network-delay`, `network-partition`, `network-dns`, `process`, `jvm-exception`, `jvm-gc`, `jvm-latency`, `jvm-return`, `jvm-stress`, `jvm-rule-data`, `clock` | 无 | 是 | `stress-cpu` |
| `address` | string 数组 | 选择注入故障的 Chaosd 服务地址，`address` 与 `selector` 两者只能选择其中一项 | [] | 是 | ["192.168.0.10:31767"] |
| `selector` | struct | 指定注入故障的目标 PhysicalMachine，详情请参考[定义实验范围](define-chaos-experiment-scope.md)，`address` 与 `selector` 两者只能选择其中一项 | 无 | 否 |  |
| `mode` | string | 指定实验的运行方式，可选择的方式包括：`one`（表示随机选出一个符合条件的 PhysicalMachine）、`all`（表示选出所有符合条件的 PhysicalMachine）、`fixed`（表示选出指定数量且符合条件的 PhysicalMachine）、`fixed-percent`（表示选出占符合条件的 PhysicalMachine 中指定百分比的 PhysicalMachine）、`random-max-percent`（表示选出占符合条件的 PhysicalMachine 中不超过指定百分比的 PhysicalMachine） | 无 | 是 | `one` |
| `value` | string | 取决与 `mode` 的配置，为 `mode` 提供对应的参数。例如，当你将 `mode` 配置为 `fixed-percent` 时，`value` 用于指定 PhysicalMachine 的百分比 | 无 | 否 | `1` |
| `duration` | string | 指定实验的持续时间 | 无 | 是 | `30s` |

每种故障行为都有特定的配置。以下部分介绍各种故障类型以及对应的配置方法。

#### CPU 压力

模拟 CPU 压力场景，将 action 设置为 "stress-cpu"，对应的配置可参考[模拟 CPU 压力相关参数说明](simulate-heavy-stress-in-physical-nodes.md#模拟-CPU-压力相关参数说明)。

#### 内存压力

模拟内存压力场景，将 action 设置为 "stress-mem"，对应的配置可参考[模拟内存压力相关参数说明](simulate-heavy-stress-in-physical-nodes.md#模拟内存压力相关参数说明)。

#### 磁盘读负载

模拟磁盘读负载，将 action 设置为 "disk-read-payload"，对应的配置可参考[模拟磁盘读负载相关参数说明](simulate-disk-pressure-in-physical-nodes.md#模拟磁盘读负载相关参数说明)。

#### 磁盘写负载

模拟磁盘读负载，将 action 设置为 "disk-write-payload"，对应的配置可参考[模拟磁盘写负载相关参数说明](simulate-disk-pressure-in-physical-nodes.md#模拟磁盘写负载相关参数说明)。

#### 磁盘填充

模拟磁盘填充，将 action 设置为 "disk-fill"，对应的配置可参考[模拟磁盘填充相关参数说明](simulate-disk-pressure-in-physical-nodes.md#模拟磁盘填充相关参数说明)。

#### 网络包错误

模拟网络包错误，将 action 设置为 "network-corrupt"，对应的配置可参考[网络包错误相关参数说明](simulate-network-chaos-in-physical-nodes.md#网络包错误相关参数说明)。

#### 网络包延迟

模拟网络包延迟，将 action 设置为 "network-delay"，对应的配置可参考[网络包延迟相关参数说明](simulate-network-chaos-in-physical-nodes.md#网络包延迟相关参数说明)。

#### 网络包重复

模拟网络包重复，将 action 设置为 "network-duplicate"，对应的配置可参考[网络包重复相关参数说明](simulate-network-chaos-in-physical-nodes.md#网络包重复相关参数说明)。

#### 网络包丢失

模拟网络包丢失，将 action 设置为 "network-loss"，对应的配置可参考[网络包丢失相关参数说明](simulate-network-chaos-in-physical-nodes.md#网络包丢失相关参数说明)。

#### 网络分区

模拟网络分区，将 action 设置为 "network-partition"，对应的配置可参考[网络分区相关参数说明](simulate-network-chaos-in-physical-nodes.md#网络分区相关参数说明)。

#### DNS 故障

模拟 DNS 故障， 将 action 设置为 "network-dns"，对应的配置可参考 [DNS 故障相关参数说明](simulate-network-chaos-in-physical-nodes.md#DNS-故障相关参数说明)。

#### 进程故障

模拟进程故障，将 action 设置为 "process"，对应的配置可参考[进程故障相关参数说明](simulate-process-chaos-in-physical-nodes.md#进程故障相关参数说明)。

#### JVM 应用抛出自定义异常

模拟 JVM 应用抛出自定义异常，将 action 设置为 "jvm-exception"，对应的配置可参考[抛出自定义异常相关参数说明](simulate-jvm-application-chaos-in-physical-nodes.md#抛出自定义异常相关参数说明)。

#### JVM 应用增加方法延迟

模拟 JVM 应用增加方法延迟，将 action 设置为 "jvm-latency"，对应的配置可参考[增加方法延迟相关参数说明](simulate-jvm-application-chaos-in-physical-nodes.md#增加方法延迟相关参数说明)。

#### JVM 应用修改方法返回值

模拟 JVM 应用修改方法返回值，将 action 设置为 "jvm-return"，对应的配置可参考[修改方法返回值相关参数说明](simulate-jvm-application-chaos-in-physical-nodes.md#修改方法返回值相关参数说明)。

#### JVM 应用触发垃圾回收

模拟 JVM 应用触发垃圾回收，将 action 设置为 "jvm-gc"，对应的配置可参考[触发垃圾回收相关参数说明](simulate-jvm-application-chaos-in-physical-nodes.md#触发垃圾回收相关参数说明)。

#### JVM 应用使用 Byteman 配置文件触发故障

JVM 应用使用 Byteman 配置触发故障，将 action 设置为 "jvm-rule-data"，对应的配置可参考[设置 Byteman 配置触发故障相关参数说明](simulate-jvm-application-chaos-in-physical-nodes.md#设置-Byteman-配置触发故障相关参数说明)。

#### 时间偏移

模拟时间偏移故障，将 action 设置为 "clock"，对应的配置可参考[模拟时间故障相关参数说明](simulate-time-chaos-on-physical-nodes.md#模拟时间故障相关参数说明)。
