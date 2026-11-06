---
title: 模拟 Kafka 故障
---

通过 Chaos Mesh 的 PhysicalMachineChaos 对 Kafka 注入故障。Chaosd 部署和目标机器配置请参考[模拟物理机故障](simulate-physical-machine-chaos.md)。

## 前置条件

Kafka 故障要求使用 Chaosd v1.6.0 或更高版本。

从 Chaos Mesh 2.8.8 开始，

## 配置

所有 Kafka 行为都支持 `authMechanism`。`kafka-fill` 还支持 `configFile`，`kafka-io` 还支持 `host`、`port`、`username` 和 `password`。

所有 Kafka 行为都需要设置 `topic`、`host` 和非零的 `port`，以连接目标 Kafka broker。如果 broker 需要认证，设置 `username`、`password` 和 `authMechanism`。支持的认证机制为 `sasl/plain`、`sasl/scram-sha-256` 和 `sasl/scram-sha-512`。设置 `username` 时必须同时设置 `authMechanism`。

| 行为 | 其他必需配置 |
| :-- | :-- |
| `kafka-fill` | 非零的 `messageSize`，单位为字节，非零的 `maxBytes`、`reloadCommand`，以及 Chaosd 所在机器上已存在的 broker 配置文件 `configFile`。 |
| `kafka-flood` | 非零的 `messageSize`，单位为字节，以及非零的 `threads`。 |
| `kafka-io` | Chaosd 所在机器上已存在的 broker 配置文件 `configFile`，且 `nonReadable` 和 `nonWritable` 中至少有一个为 `true`。 |

## 示例

以下实验移除目标 topic 的分区目录和日志文件的写权限。请将 PhysicalMachine 名称、broker 连接信息和配置文件路径替换为实际值。

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
