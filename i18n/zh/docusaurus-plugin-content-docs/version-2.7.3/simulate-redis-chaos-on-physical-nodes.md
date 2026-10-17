---
title: 模拟 Redis 故障
---

本文主要介绍如何使用 Chaosd 模拟 Redis 故障。该功能使用 `go-redis` 包中的 Golang 接口以及 `redis-server` 命令行工具。你可以通过命令行模式或服务模式创建实验。

在创建 Redis 故障实验前，可运行以下命令行查看 Chaosd 支持的 Redis 故障类型：

```bash
chaosd attack redis -h
```

输出结果如下所示：

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

目前 Chaosd 支持模拟缓存过期、缓存穿透、缓存限制、重启 Sentinel 以及停止 Sentinel 场景。

要使用服务模式创建实验，你需要以服务模式运行 Chaosd，然后向 Chaosd 服务的路径 `/api/attack/redis` 发送 `POST` HTTP 请求：

```bash
chaosd server --port 31767
```

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{fault-configuration}'
```

在上述命令中，你需要按照故障类型在 `fault-configuration` 中进行配置。有关对应的配置参数和示例，请参考下文中各个类型故障的相关参数说明。

:::note

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 `/api/attack/{uid}` 发送 `DELETE` HTTP 请求。

:::

## 模拟缓存过期

该命令的含义与 Redis 中的 EXPIRE 相同。更多详情请参考 [Redis 官方文档](https://redis.io/commands/expire/)。

:::note

目前 Chaosd 不支持恢复已经执行了 `cache-expiration` 的键，因此如果你想要恢复它们，请提前备份。

:::

### 模拟缓存过期相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "expiration" |
| `addr` | a | addr | 注入故障的 Redis 服务器的地址和端口，例如 `127.0.0.1:6379` | string 类型 | 默认值为 `""` |
| `expiration` | None | expiration | 指定的键将在 `expiration` 到达后过期 | string 类型 | 默认值为 `"0"`。请确保字符串符合 `time.Duration` 支持的格式 |
| `key` | k | key | 即将过期的键 | string 类型 | 默认值为 `""`，表示对所有键设置过期时间 |
| `option` | None | option | `expiration` 的附加选项。**只有 7.0.0 之后的 Redis 版本支持该标志** | string 类型 | 默认值为 `""`。仅支持 NX、XX、GT 和 LT |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |

### 使用命令行模式模拟缓存过期场景

运行以下命令可查看模拟缓存过期场景支持的配置：

```bash
chaosd attack redis cache-expiration -h
```

输出如下所示：

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

示例如下：

```bash
chaosd attack redis cache-expiration -a 127.0.0.1:6379 --option GT --expiration 1m
```

### 使用服务模式模拟缓存过期场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"expiration", "expiration":"1m","addr":"127.0.0.1:6379"}'
```

## 模拟缓存限制

### 模拟缓存限制相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "cacheLimit" |
| `addr` | a | addr | 注入故障的 Redis 服务器的地址和端口，例如 `127.0.0.1:6379` | string 类型 | 默认值为 `""` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `percent` | None | percent | 将 `maxmemory` 指定为原值的百分比 | string 类型 | 默认值为 `""` |
| `size` | s | cacheSize | 指定 `maxmemory` 的大小 | string 类型 | 默认值为 `0`，表示内存大小不受限制 |

### 使用命令行模式模拟缓存限制场景

运行以下命令可查看模拟缓存限制场景支持的配置：

```bash
chaosd attack redis cache-limit -h
```

输出如下所示：

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

示例如下：

```bash
chaosd attack redis cache-limit -a 127.0.0.1:6379 -s 256M
```

### 使用服务模式模拟缓存限制场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"cacheLimit", "addr":"127.0.0.1:6379", "percent":"50%"}'
```

## 模拟缓存穿透

该命令会使用 Redis Pipeline 尽快向 Redis 服务器发送指定数量的 `GET` 请求。由于被请求的键在 Redis 服务器上不存在，这些请求会导致缓存穿透现象。

### 模拟缓存穿透相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "penetration" |
| `addr` | a | addr | 注入故障的 Redis 服务器的地址和端口，例如 `127.0.0.1:6379` | string 类型 | 默认值为 `""` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `request-num` | None | requestNum | 指定向 Redis 服务器发送的请求数量 | int 类型 | 默认值为 `0` |

### 使用命令行模式模拟缓存穿透场景

运行以下命令可查看模拟缓存穿透场景支持的配置：

```bash
chaosd attack redis cache-penetration -h
```

输出如下所示：

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

示例如下：

```bash
chaosd attack redis cache-penetration -a 127.0.0.1:6379 --request-num 100000
```

### 使用服务模式模拟缓存穿透场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"penetration", "addr":"127.0.0.1:6379", "requestNum":10000}'
```

## 模拟重启 Sentinel

### 模拟重启 Sentinel 相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "restart" |
| `addr` | a | addr | 注入故障的 Sentinel 的地址和端口，例如 `127.0.0.1:26379` | string 类型 | 默认值为 `""` |
| `conf` | c | conf | 指定 Sentinel 配置文件的路径，该文件用于恢复 Sentinel | string 类型 | 默认值为 `""` |
| `flush-config` | None | flushConfig | 强制 Sentinel 将配置重写到磁盘，包括当前 Sentinel 状态 | bool 类型 | 默认值为 `true` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `redis-path` | None | redisPath | 指定 `redis-server` 命令行工具的路径 | string 类型 | 默认值为 `""` |

### 使用命令行模式模拟重启 Sentinel 场景

运行以下命令可查看模拟重启 Sentinel 场景支持的配置：

```bash
chaosd attack redis sentinel-restart -h
```

输出如下所示：

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

示例如下：

```bash
chaosd attack redis sentinel-restart -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### 使用服务模式模拟重启 Sentinel 场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"restart", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```

## 模拟停止 Sentinel

### 模拟停止 Sentinel 相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "stop" |
| `addr` | a | addr | 注入故障的 Sentinel 的地址和端口，例如 `127.0.0.1:26379` | string 类型 | 默认值为 `""` |
| `conf` | c | conf | 指定 Sentinel 配置文件的路径，该文件用于恢复 Sentinel | string 类型 | 默认值为 `""` |
| `flush-config` | None | flushConfig | 强制 Sentinel 将配置重写到磁盘，包括当前 Sentinel 状态 | bool 类型 | 默认值为 `true` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `redis-path` | None | redisPath | 指定 `redis-server` 命令行工具的路径 | string 类型 | 默认值为 `""` |

### 使用命令行模式模拟停止 Sentinel 场景

运行以下命令可查看模拟停止 Sentinel 场景支持的配置：

```bash
chaosd attack redis sentinel-stop -h
```

输出如下所示：

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

示例如下：

```bash
chaosd attack redis sentinel-stop -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### 使用服务模式模拟停止 Sentinel 场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"stop", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```
