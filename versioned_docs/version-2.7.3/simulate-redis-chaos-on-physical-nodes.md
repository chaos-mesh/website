---
title: Simulate Redis Faults
---

This document introduces how to use Chaosd to simulate Redis faults. This feature uses Golang interfaces in the `go-redis` package and the `redis-server` command-line tool. You can create experiments either in command-line mode or service mode.

Before creating an experiment, you can run the following command to see the Redis fault types that are supported by Chaosd:

```bash
chaosd attack redis -h
```

The result is as follows:

```bash
Redis attack related commands

Usage:
  chaosd attack redis [command]

Available Commands:
  cache-expiration  expire keys in Redis
  cache-limit       set maxmemory of Redis
  cache-penetration penetrate cache
  sentinel-restart  restart sentinel
  sentinel-stop     stop sentinel

Flags:
  -h, --help   help for redis

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID

Use "chaosd attack redis [command] --help" for more information about a command.
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

:::note

When running an experiment, remember to record the UID of the experiment. When you want to end the experiment corresponding to the UID, you need to send a `DELETE` HTTP request to the `/api/attack/{uid}` path of the Chaosd service.

:::

## Simulate cache expiration

The meaning of this command is the same as EXPIRE in Redis. For more details, refer to the [Redis official documentation](https://redis.io/commands/expire/).

:::note

Currently, Chaosd does not support recovering keys that have executed `cache-expiration`, so please back them up in advance if you want to recover them.

:::

### Parameters for simulating cache expiration

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | Action of the experiment | string | Set to `"expiration"` |
| `addr` | a | addr | The address and port of Redis server into which faults are injected, for example `127.0.0.1:6379` | string | Default value: `""` |
| `expiration` | None | expiration | The specified key will be expired after `expiration` arrives | string | Default value: `"0"`. Make sure that the string is in the format supported by `time.Duration` |
| `key` | k | key | The key to be expired | string | Default value: `""`, which means the expiration is set for all keys |
| `option` | None | option | Additional options for `expiration`. **Only versions of Redis after 7.0.0 support this flag** | string | Default value: `""`. Only NX, XX, GT, and LT are supported |
| `password` | p | password | The password to log in to the server | string | Default value: `""` |

### Simulate cache expiration using the command-line mode

#### Commands for cache expiration

```bash
chaosd attack redis cache-expiration -h
```

The result is as follows:

```bash
expire keys in Redis

Usage:
  chaosd attack redis cache-expiration [flags]

Flags:
  -a, --addr string         The address of redis server
      --expiration string   The expiration of the key. A expiration string should be able to be converted to a time duration, such as "5s" or "30m" (default "0")
  -h, --help                help for cache-expiration
  -k, --key string          The key to be set a expiration, default expire all keys
      --option string       The additional options of expiration, only NX, XX, GT, LT supported
  -p, --password string     The password of server

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Example for simulating cache expiration

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
| `action` | — | action | Action of the experiment | string | Set to `"cacheLimit"` |
| `addr` | a | addr | The address and port of Redis server into which faults are injected, such as `127.0.0.1:6379` | string | Default value: `""` |
| `password` | p | password | The password to log in to the server | string | Default value: `""` |
| `percent` | None | percent | Specifies `maxmemory` as a percentage of the original value | string | Default value: `""` |
| `size` | s | cacheSize | Specifies the size of `maxmemory` | string | Default `0`, which means no limitation of memory |

### Simulate cache limit using the command-line mode

#### Commands for cache limit

```bash
chaosd attack redis cache-limit -h
```

The result is as follows:

```bash
set maxmemory of Redis

Usage:
  chaosd attack redis cache-limit [flags]

Flags:
  -a, --addr string       The address of redis server
  -h, --help              help for cache-limit
  -p, --password string   The password of server
      --percent string    The percentage of maxmemory
  -s, --size string       The size of cache (default "0")

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Example for simulating cache limit

```bash
chaosd attack redis cache-limit -a 127.0.0.1:6379 -s 256M
```

### Simulate cache limit using the service mode

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"cacheLimit", "addr":"127.0.0.1:6379", "percent":"50%"}'
```

## Simulate cache penetration

This command will send the specified number of `GET` requests to the Redis server as quickly as possible using Redis Pipeline. Since the requested keys do not exist on the Redis server, these requests will cause a cache penetration phenomenon.

### Parameters for simulating cache penetration

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | Action of the experiment | string | Set to `"penetration"` |
| `addr` | a | addr | The address and port of Redis server into which faults are injected, such as `127.0.0.1:6379` | string | Default value: `""` |
| `password` | p | password | The password to log in to the server | string | Default value: `""` |
| `request-num` | None | requestNum | Specifies the number of requests to be sent to the Redis server | int | Default value: `0` |

### Simulate cache penetration using the command-line mode

#### Commands for cache penetration

```bash
chaosd attack redis cache-penetration -h
```

The result is as follows:

```bash
penetrate cache

Usage:
  chaosd attack redis cache-penetration [flags]

Flags:
  -a, --addr string       The address of redis server
  -h, --help              help for cache-penetration
  -p, --password string   The password of server
      --request-num int   The number of requests

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Example for simulating cache penetration

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
| `action` | — | action | Action of the experiment | string | Set to `"restart"` |
| `addr` | a | addr | The address and port of Sentinel into which faults are injected, such as `127.0.0.1:26379` | string | Default value: `""` |
| `conf` | c | conf | Specifies the path of Sentinel config file, this file will be used to recover the Sentinel | string | Default value: `""` |
| `flush-config` | None | flushConfig | Forces Sentinel to rewrite its configuration on disk, including the current Sentinel state | bool | Default value: `true` |
| `password` | p | password | The password to log in to the server | string | Default value: `""` |
| `redis-path` | None | redisPath | Specifies the path of `redis-server` command-line tool | string | Default value: `""` |

### Simulate Sentinel restart using the command-line mode

#### Commands for Sentinel restart

```bash
chaosd attack redis sentinel-restart -h
```

The result is as follows:

```bash
restart sentinel

Usage:
  chaosd attack redis sentinel-restart [flags]

Flags:
  -a, --addr string         The address of redis server
  -c, --conf string         The config of Redis server
      --flush-config         Force Sentinel to rewrite its configuration on disk (default true)
  -h, --help                help for sentinel-restart
  -p, --password string     The password of server
      --redis-path string   The path of the redis-server command

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Example for simulating Sentinel restart

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
| `action` | — | action | Action of the experiment | string | Set to `"stop"` |
| `addr` | a | addr | The address and port of Sentinel into which faults are injected, such as `127.0.0.1:26379` | string | Default value: `""` |
| `conf` | c | conf | Specifies the path of Sentinel configuration file, which is used to recover the Sentinel | string | Default value: `""` |
| `flush-config` | None | flushConfig | Forces Sentinel to rewrite its configuration on disk, including the current Sentinel state | bool | Default value: `true` |
| `password` | p | password | The password to log in to the server | string | Default value: `""` |
| `redis-path` | None | redisPath | Specifies the path of `redis-server` command-line tool | string | Default value: `""` |

### Simulate Sentinel stop using the command-line mode

#### Commands for Sentinel stop

```bash
chaosd attack redis sentinel-stop -h
```

The result is as follows:

```bash
stop sentinel

Usage:
  chaosd attack redis sentinel-stop [flags]

Flags:
  -a, --addr string         The address of redis server
  -c, --conf string         The config path of Redis server
      --flush-config        Force Sentinel to rewrite its configuration on disk (default true)
  -h, --help                help for sentinel-stop
  -p, --password string     The password of server
      --redis-path string   The path of the redis-server command

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Example for simulating Sentinel stop

```bash
chaosd attack redis sentinel-stop -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### Simulate Sentinel stop using the service mode

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"stop", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```
