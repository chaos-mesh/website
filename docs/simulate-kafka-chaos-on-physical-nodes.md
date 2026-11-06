---
title: Simulate Kafka Faults
---

Use PhysicalMachineChaos in Chaos Mesh to inject Kafka faults. For Chaosd deployment and target machine configuration, see [Simulate faults on physical machines](simulate-physical-machine-chaos.md).

## Requirements

Kafka faults require Chaosd v1.6.0 or later.

In Chaos Mesh 2.8.8 and later, all Kafka actions accept `authMechanism`. The `kafka-fill` action also accepts `configFile`, and `kafka-io` also accepts `host`, `port`, `username`, and `password`.

## Configuration

For all Kafka actions, set `topic`, `host`, and a nonzero `port` to connect to the target Kafka broker. If the broker requires authentication, set `username`, `password`, and `authMechanism`. Supported mechanisms are `sasl/plain`, `sasl/scram-sha-256`, and `sasl/scram-sha-512`. Set `authMechanism` whenever you set `username`.

| Action | Additional required configuration |
| :-- | :-- |
| `kafka-fill` | A nonzero `messageSize` in bytes, a nonzero `maxBytes`, a `reloadCommand`, and an existing broker `configFile` on the Chaosd machine. |
| `kafka-flood` | A nonzero `messageSize` in bytes and a nonzero `threads`. |
| `kafka-io` | An existing broker `configFile` on the Chaosd machine and at least one of `nonReadable` or `nonWritable` set to `true`. |

## Example

For example, the following experiment removes write permissions from the topic's partition directories and log files. Replace the PhysicalMachine name, broker connection details, and configuration path with your values.

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
