---
title: 模拟网络故障
---

本文档介绍如何在 Chaos Mesh 中利用 NetworkChaos 模拟网络故障。

## NetworkChaos 介绍

NetworkChaos 用于模拟集群中网络故障的场景，目前支持以下几种类型：

1. **Partition**：网络断开、分区。
2. **Net Emulation**：用于模拟网络状态不良的情况，比如高延迟、高丢包率、包乱序等情况。
3. **Bandwidth**：用于限制节点之间通信的带宽。

## 注意事项

1. 请在进行网络注入的过程中保证 Controller Manager 与 Chaos Daemon 之间的连接通畅，否则将无法恢复。
2. 如果使用 Net Emulation 功能，请确保 Linux 内核拥有 NET_SCH_NETEM 模块。对于 CentOS 可以通过 kernel-modules-extra 包安装，大部分其他发行版已默认安装相应模块。

## 使用 Dashboard 方式创建实验

1. 单击实验页面中的**新的实验**按钮创建实验：

   ![创建实验](./img/create-new-exp.png)

2. 在“选择目标”处选择 “网络攻击”，然后选择具体行为，例如 `LOSS`，最后填写具体配置：

   ![NetworkChaos 实验](./img/networkchaos-exp.png)

   具体配置的填写方式，参考[字段说明](#字段说明)。

3. 填写实验信息，指定实验范围以及实验计划运行时间：

   ![实验信息](./img/exp-info.png)

4. 提交实验。

## 使用 YAML 方式创建实验

### Net Emulation 示例

1. 将实验配置写入到文件中 `network-delay.yaml`，内容示例如下：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: NetworkChaos
   metadata:
     name: delay
   spec:
     action: delay
     mode: one
     selector:
       namespaces:
         - default
       labelSelectors:
         'app': 'web-show'
     delay:
       latency: '10ms'
       correlation: '100'
       jitter: '0ms'
   ```

   该配置将令选中 Pod 内的网络连接产生 10 毫秒的延迟。除了注入延迟以外，Chaos Mesh 还支持注入丢包、乱序等功能，详见[字段说明](#字段说明)

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f ./network-delay.yaml
   ```

### Partition 示例

1. 将实验配置写入到文件中 `network-partition.yaml`，内容示例如下：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: NetworkChaos
   metadata:
     name: partition
   spec:
     action: partition
     mode: all
     selector:
       namespaces:
         - default
       labelSelectors:
         'app': 'app1'
     direction: to
     target:
       mode: all
       selector:
         namespaces:
           - default
         labelSelectors:
           'app': 'app2'
   ```

   该配置将阻止从 `app1` 向 `app2` 建立的连接。`direction` 字段的值可以选择 `to`，`from` 及 `both`，详见[字段说明](#字段说明)。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f ./network-partition.yaml
   ```

### Bandwidth 示例

1. 将实验配置写入到文件中 `network-bandwidth.yaml`，内容示例如下：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: NetworkChaos
   metadata:
     name: bandwidth
   spec:
     action: bandwidth
     mode: all
     selector:
       namespaces:
         - default
       labelSelectors:
         'app': 'app1'
     bandwidth:
       rate: '1mbps'
       limit: 20971520
       buffer: 10000
   ```

   该配置将限制 `app1` 的带宽为 1 mbps。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f ./network-bandwidth.yaml
   ```

### 字段说明

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| action | string | 表示具体的故障类型。netem，delay，loss，duplicate，corrupt 对应 net emulation 类型；partition 表示网络分区；bandwidth 表示限制带宽 | 无 | 是 | partition |
| target | Selector | 与 direction 组合使用，使得 Chaos 只对部分包生效 | 无 | 否 |  |
| direction | enum | 值为 `from`，`to` 或 `both`。用于指定选出“来自 target 的包”，“发往 target 的包”，或者“全部选中” | to | 否 | both |
| mode | string | 指定实验的运行方式，可选择的方式包括：`one`（表示随机选出一个符合条件的 Pod）、`all`（表示选出所有符合条件的 Pod）、`fixed`（表示选出指定数量且符合条件的 Pod）、`fixed-percent`（表示选出占符合条件的 Pod 中指定百分比的 Pod）、`random-max-percent`（表示选出占符合条件的 Pod 中不超过指定百分比的 Pod） | 无 | 是 | `one` |
| value | string | 取决与 `mode` 的配置，为 `mode` 提供对应的参数。例如，当你将 `mode` 配置为 `fixed-percent` 时，`value` 用于指定 Pod 的百分比 | 无 | 否 | 1 |
| selector | struct | 指定注入故障的目标 Pod，详情请参考[定义实验范围](./define-chaos-experiment-scope.md) | 无 | 是 |  |
| externalTargets | []string | 表示 Kubernetes 之外的网络目标, 可以是 IPv4 地址或者域名。只能与 `direction: to` 一起工作。 | 无 | 否 | 1.1.1.1, google.com |
| device | string | 指定影响的网络设备 | 无 | 否 | "eth0" |

## 不同 `action` 的配置项

### Net Emulation

| 参数      | 类型                    | 说明                     | 是否必填 |
| --------- | ----------------------- | ------------------------ | -------- |
| delay     | [Delay](#delay)         | 描述网络的延迟状态       | 否       |
| loss      | [Loss](#loss)           | 描述网络的丢包状态       | 否       |
| duplicate | [Duplicate](#duplicate) | 描述网络重复包的状态     | 否       |
| corrupt   | [Corrupt](#corrupt)     | 描述网络包出现错误的状态 | 否       |

### Delay

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| latency | string | 表示延迟的时间长度 | 0 | 否 | 2ms |
| correlation | string | 表示延迟时间的时间长度与前一次延迟时长的相关性。取值范围：[0, 100] | 0 | 否 | 50 |
| jitter | string | 表示延迟时间的变化范围 | 0 | 否 | 1ms |
| reorder | Reorder(#Reorder) | 表示网络包乱序的状态 |  | 否 |  |

`correlation` 的计算模型如下：

1. 首先生成一个分布与上一个值有关的随机数：

   ```c
   rnd = value * (1-corr) + last_rnd * corr
   ```

   其中 `rnd` 为这一随机数。`corr` 为填写的 `correlation`。

2. 使用这一随机数决定当前包的延迟：

   ```c
   ((rnd % (2 * sigma)) + mu) - sigma
   ```

   其中 `sigma` 为 `jitter`，`mu` 为 `latency`。

### Reorder

| 参数        | 类型   | 说明                                                       | 默认值 | 是否必填 | 示例 |
| ----------- | ------ | ---------------------------------------------------------- | ------ | -------- | ---- |
| reorder     | string | 表示发生重新排序的概率。取值范围：[0, 100]                 | 0      | 否       | 50   |
| correlation | string | 表示发生重新排序的概率与前一次的相关性。取值范围：[0, 100] | 0      | 否       | 50   |
| gap         | int    | 表示乱序将包推后的距离                                     | 0      | 否       | 5    |

### Loss

| 参数        | 类型   | 说明                                                           | 默认值 | 是否必填 | 示例 |
| ----------- | ------ | -------------------------------------------------------------- | ------ | -------- | ---- |
| loss        | string | 表示丢包发生的概率。取值范围：[0, 100]                         | 0      | 否       | 50   |
| correlation | string | 表示丢包发生的概率与前一次是否发生的相关性。取值范围：[0, 100] | 0      | 否       | 50   |

### Duplicate

| 参数        | 类型   | 说明                                                             | 默认值 | 是否必填 | 示例 |
| ----------- | ------ | ---------------------------------------------------------------- | ------ | -------- | ---- |
| duplicate   | string | 表示包重复发生的概率。取值范围：[0, 100]                         | 0      | 否       | 50   |
| correlation | string | 表示包重复发生的概率与前一次是否发生的相关性。取值范围：[0, 100] | 0      | 否       | 50   |

### Corrupt

| 参数        | 类型   | 说明                                                             | 默认值 | 是否必填 | 示例 |
| ----------- | ------ | ---------------------------------------------------------------- | ------ | -------- | ---- |
| corrupt     | string | 表示包错误发生的概率。取值范围：[0, 100]                         | 0      | 否       | 50   |
| correlation | string | 表示包错误发生的概率与前一次是否发生的相关性。取值范围：[0, 100] | 0      | 否       | 50   |

对于 `reorder`，`loss`，`duplicate`，`corrupt` 这些偶发事件，`correlation` 则更为复杂。具体模型描述参考 [NetemCLG](http://web.archive.org/web/20200120162102/http://netgroup.uniroma2.it/twiki/bin/view.cgi/Main/NetemCLG) 。

### Bandwidth

| 参数     | 类型   | 说明                     | 默认值 | 是否必填 | 示例  |
| -------- | ------ | ------------------------ | ------ | -------- | ----- |
| rate     | string | 表示带宽限制的速率       |        | 是       | 1mbps |
| limit    | uint32 | 表示在队列中等待的字节数 |        | 是       | 1     |
| buffer   | uint32 | 能够瞬间发送的最大字节数 |        | 是       | 1     |
| peakrate | uint64 | `bucket` 的最大消耗率    |        | 否       | 1     |
| minburst | uint32 | `peakrate bucket` 的大小 |        | 否       | 1     |

其中 `peakrate` 和 `minburst` 通常情况下不需要设置。如果需要进一步了解这些字段的含义，可以参考 [tc-tbf 文档](https://man7.org/linux/man-pages/man8/tc-tbf.8.html).`limit` 建议至少设置为 `2 * rate * latency`，其中 `latency` 为发送者到目标的延迟，可以通过 `ping` 命令估算。过小的 limit 会造成高丢包率，从而影响 TCP 连接的吞吐。
