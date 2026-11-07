---
title: 模拟 Kafka 故障
---

本文介绍如何通过 Chaos Mesh 的 PhysicalMachineChaos，在物理机上对 Kafka 注入故障。

## 前置条件

:::note[版本说明]

使用本文介绍的 Kafka 故障功能，需要部署 Chaos Mesh 2.8.8 或更高版本，并在目标物理机上运行 Chaosd v1.6.0 或更高版本。

:::

部署步骤和目标机器的配置方法请参考[模拟物理机故障](simulate-physical-machine-chaos.md)。

## 配置

将 `spec.action` 设置为 `kafka-fill`、`kafka-flood` 或 `kafka-io`，并将故障参数填写在同名配置块中。例如，`kafka-io` 的参数应填写在 `spec.kafka-io` 中。

三种行为都需要指定 Kafka broker 的 `host` 和 `port`，以及要注入故障的 `topic`。`port` 必须大于 `0`。如果 broker 需要认证，还需同时设置 `username`、`password` 和 `authMechanism`。支持的认证机制为 `sasl/plain`、`sasl/scram-sha-256` 和 `sasl/scram-sha-512`。 设置 `username` 时必须同时设置 `authMechanism`。

除上述连接参数外，各行为还需要以下配置。

| 行为 | 其他必需配置 |
| :-- | :-- |
| `kafka-fill` | `messageSize` 指定每条消息的字节数，且必须大于 `0`。`maxBytes` 也必须大于 `0`。还需指定重新加载 Kafka 配置的 `reloadCommand`，以及 Chaosd 所在机器上已存在的 broker 配置文件 `configFile`。 |
| `kafka-flood` | `messageSize` 指定每条消息的字节数，且必须大于 `0`。`threads` 指定工作线程数，也必须大于 `0`。 |
| `kafka-io` | `configFile` 必须指向 Chaosd 所在机器上已存在的 broker 配置文件。`nonReadable` 和 `nonWritable` 中至少有一个必须为 `true`。 |

## 示例

以下示例通过 `kafka-io` 移除目标 topic 分区目录和日志文件的写权限。使用前，请将 `selector.physicalMachines` 中的命名空间和 PhysicalMachine 名称，以及 broker 地址、认证信息和配置文件路径替换为实际值。

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PhysicalMachineChaos
metadata:
  name: physical-kafka-io
  namespace: chaos-mesh
spec:
  action: kafka-io
  mode: one
  selector:
    physicalMachines:
      default:
        - kafka-host
  kafka-io:
    topic: test-topic
    host: 192.168.0.20
    port: 9092
    username: chaos-user
    password: replace-with-password
    authMechanism: sasl/plain
    configFile: /opt/kafka/config/server.properties
    nonWritable: true
  duration: '30s'
```
