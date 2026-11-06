---
title: Simulate Kafka Faults
---

This guide describes how to inject Kafka faults on physical machines with PhysicalMachineChaos in Chaos Mesh.

## Requirements

The Kafka fault configurations in this guide require Chaos Mesh 2.8.8 or later, with Chaosd v1.6.0 or later running on the target machines. For deployment instructions and target machine configuration, see [Simulate faults on physical machines](simulate-physical-machine-chaos.md).

## Configuration

Set `spec.action` to `kafka-fill`, `kafka-flood`, or `kafka-io`, and place the fault parameters in the matching configuration block. For example, parameters for `kafka-io` belong in `spec.kafka-io`.

All three actions require the Kafka broker's `host` and `port`, and the target `topic`. The `port` must be greater than `0`. If the broker requires authentication, also set `username`, `password`, and `authMechanism`. The supported mechanisms are `sasl/plain`, `sasl/scram-sha-256`, and `sasl/scram-sha-512`. If you set `username`, you must also set `authMechanism`.

Each action also requires the following configuration.

| Action | Additional required configuration |
| :-- | :-- |
| `kafka-fill` | `messageSize` specifies the number of bytes per message and must be greater than `0`. `maxBytes` must also be greater than `0`. Set `reloadCommand` to the command that reloads the Kafka configuration, and `configFile` to an existing broker configuration file on the Chaosd machine. |
| `kafka-flood` | `messageSize` specifies the number of bytes per message and must be greater than `0`. `threads` specifies the number of worker threads and must also be greater than `0`. |
| `kafka-io` | `configFile` must point to an existing broker configuration file on the Chaosd machine. Set at least one of `nonReadable` or `nonWritable` to `true`. |

## Example

The following example uses `kafka-io` to remove write permissions from the target topic's partition directories and log files. Before using it, replace the namespace and PhysicalMachine name under `selector.physicalMachines`, the broker address, credentials, and configuration file path with your values.

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
