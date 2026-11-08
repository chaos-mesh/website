---
title: Simulate Redis Faults
---

This document introduces how to use Chaosd to simulate Redis faults. This feature uses Golang interfaces in the `go-redis` package and the `redis-server` command-line tool. You can create experiments either in command-line mode or service mode.

Before creating an experiment, you can run the following command to see the Redis fault types that are supported by Chaosd:

```bash
chaosd attack redis -h
```

Currently, Chaosd supports simulating cache expiration, cache penetration, cache limit, sentinel restart, and sentinel stop.

To create experiments using the service mode, you need to run Chaosd in the service mode and then send a `POST` HTTP request to the `/api/attack/redis` path of the Chaosd service:

```bash
chaosd server --port 31767
```

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{fault-configuration}'
```

For the `fault-configuration` part in the above command, you need to configure it according to the fault types. For the corresponding parameters and examples, refer to the parameters of each fault type in the following sections.

:::info

When running an experiment, remember to record the UID of the experiment. When you want to end the experiment corresponding to the UID, you need to send a `DELETE` HTTP request to the `/api/attack/{uid}` path of the Chaosd service.

:::

## Simulate cache expiration

### Parameters for simulating cache expiration

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | Action of the experiment. | string | Set to "expiration". |
| `addr` | a | addr | The address and port of Redis server into which faults are injected, for example `127.0.0.1:6379` | string | Default value: `""`. |
| `expiration` | — | expiration | The specified key will be expired after `expiration` arrives | string | Default value: `"0"`. Make sure that the string is in the format supported by `time.Duration`. |
| `key` | k | key | The key to be expired | string | Default value: `""`, which means the expiration is set for all keys. |
| `option` | — | option | Additional options for `expiration`. **Only versions of Redis after 7.0.0 support this flag** | string | Default value: `""`. Only NX, XX, GT, and LT are supported. |
| `password` | p | password | The password to log in to the server | string | Default value: `""`. |

### Simulate cache expiration using the command-line mode

The meaning of this command is the same as EXPIRE in Redis. For more details, refer to the [Redis official documentation](https://redis.io/commands/expire/).

:::info

Currently, Chaosd does not support recovering keys that have executed `cache-expiration`, so please back them up in advance if you want to recover them.

:::

```bash
chaosd attack redis cache-expiration -h
```

```bash
chaosd attack redis cache-expiration -a 127.0.0.1:6379 --option GT --expiration 1m
```

### Simulate cache expiration using the service mode

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"expiration", "expiration":"1m","addr":"127.0.0.1:6379"}'
```

## Simulate cache limit

### Parameters for simulating cache limit

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | Action of the experiment. | string | Set to "cacheLimit". |
| `addr` | a | addr | The address and port of Redis server into which faults are injected, such as `127.0.0.1:6379` | string | Default value: `""`. |
| `password` | p | password | The password to log in to the server | string | Default value: `""`. |
| `percent` | — | percent | Specifies `maxmemory` as a percentage of the original value | string | Default value: `""`. |
| `size` | s | cacheSize | Specifies the size of `maxmemory` | string | Default `0`, which means no limitation of memory. |

### Simulate cache limit using the command-line mode

```bash
chaosd attack redis cache-limit -h
```

```bash
chaosd attack redis cache-limit -a 127.0.0.1:6379 -s 256M
```

### Simulate cache limit using the service mode

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"cacheLimit", "addr":"127.0.0.1:6379", "percent":"50%"}'
```

## Simulate cache penetration

### Parameters for simulating cache penetration

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | Action of the experiment. | string | Set to "penetration". |
| `addr` | a | addr | The address and port of Redis server into which faults are injected, such as `127.0.0.1:6379` | string | Default value: `""`. |
| `password` | p | password | The password to log in to the server | string | Default value: `""`. |
| `request-num` | — | requestNum | Specifies the number of requests to be sent to the Redis server | int | Default value: `0`. |

### Simulate cache penetration using the command-line mode

This command will send the specified number of `GET` requests to the Redis server as quickly as possible using Redis Pipeline. Since the requested keys do not exist on the Redis server, these requests will cause a cache penetration phenomenon.

```bash
chaosd attack redis cache-penetration -h
```

```bash
chaosd attack redis cache-penetration -a 127.0.0.1:6379 --request-num 100000
```

### Simulate cache penetration using the service mode

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"penetration", "addr":"127.0.0.1:6379", "requestNum":10000}'
```

## Simulate Sentinel restart

### Parameters for simulating Sentinel restart

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | Action of the experiment. | string | Set to "restart". |
| `addr` | a | addr | The address and port of Sentinel into which faults are injected, such as `127.0.0.1:26379` | string | Default value: `""`. |
| `conf` | c | conf | Specifies the path of Sentinel config file, this file will be used to recover the Sentinel | string | Default value: `""`. |
| `flush-config` | — | flushConfig | Forces Sentinel to rewrite its configuration on disk, including the current Sentinel state | bool | Default value: `true`. |
| `password` | p | password | The password to log in to the server | string | Default value: `""`. |
| `redis-path` | — | redisPath | Specifies the directory containing the `redis-server` executable, such as `/opt/redis/bin`. When empty, Chaosd uses its process `PATH` to find `redis-server` | string | Default value: `""`. |

### Simulate Sentinel restart using the command-line mode

```bash
chaosd attack redis sentinel-restart -h
```

```bash
chaosd attack redis sentinel-restart -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### Simulate Sentinel restart using the service mode

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"restart", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```

## Simulate Sentinel stop

### Parameters for simulating Sentinel stop

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | Action of the experiment. | string | Set to "stop". |
| `addr` | a | addr | The address and port of Sentinel into which faults are injected, such as `127.0.0.1:26379` | string | Default value: `""`. |
| `conf` | c | conf | Specifies the path of Sentinel configuration file, which is used to recover the Sentinel | string | Default value: `""`. |
| `flush-config` | — | flushConfig | Forces Sentinel to rewrite its configuration on disk, including the current Sentinel state | bool | Default value: `true`. |
| `password` | p | password | The password to log in to the server | string | Default value: `""`. |
| `redis-path` | — | redisPath | Specifies the directory containing the `redis-server` executable, such as `/opt/redis/bin`. When empty, Chaosd uses its process `PATH` to find `redis-server` | string | Default value: `""`. |

### Simulate Sentinel stop using the command-line mode

```bash
chaosd attack redis sentinel-stop -h
```

```bash
chaosd attack redis sentinel-stop -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### Simulate Sentinel stop using the service mode

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"stop", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```

## Create experiments using Chaos Mesh

:::info[Version support]

This section describes configuration for Chaos Mesh 2.8.8 and later.

:::

Before creating an experiment, configure Chaosd and target machines as described in [Simulate faults on physical machines](simulate-physical-machine-chaos.md).

Set `spec.action` to `redis-expiration`, `redis-penetration`, `redis-cacheLimit`, `redis-restart`, or `redis-stop`, and place the fault parameters in the matching configuration block.

For `redis-restart` and `redis-stop`, `redisPath` is a string that specifies the directory containing `redis-server`, such as `/opt/redis/bin`. If the field is omitted or empty, Chaosd finds `redis-server` through its process `PATH`.

:::warning

When upgrading from a version earlier than 2.8.8, follow this order:

1. Before upgrading the CRDs, remove boolean `redisPath` values from existing `PhysicalMachineChaos` resources and from physical machine templates in `Schedule`, `Workflow`, and `WorkflowNode` resources. Remove them from saved manifests too.
2. Upgrade Chaos Mesh and its CRDs to 2.8.8 or later.
3. Set `redisPath` to a directory string if you need a custom Redis installation path.

:::
