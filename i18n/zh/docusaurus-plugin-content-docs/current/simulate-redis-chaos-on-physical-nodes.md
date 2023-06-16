---
title: 模拟 Redis 故障
---

本文主要介绍如何使用 Chaosd 模拟 Redis 故障。该功能通过使用 `go-redis` 包中的 Golang 接口和 `redis-server` 命令行工具模拟 Redis 故障场景，支持通过命令行模式或服务模式创建实验。

## 使用命令行模式创建实验

在创建 Redis 故障实验前，可运行以下命令查看 Chaosd 支持的进程故障类型：

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

目前 Chaosd 支持模拟缓存过期、缓存限流、缓存穿透、哨兵重启和哨兵不可用等故障场景。

### 使用命令行模式模拟缓存过期

该命令与 Redis `EXPIRE` 操作意义一致，详情参考 [Redis 官方文档](https://redis.io/commands/expire/)。

:::note 提示

目前不支持恢复执行了 `cache-expiration` 操作的 key，如需恢复请提前备份。

:::

#### 缓存过期命令

```bash
chaosd attack redis cache-expiration -h
```

输出结果如下所示：

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

#### 模拟缓存过期相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `addr` | `a` | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string 类型，默认为 `""` |
| `expiration` | 无 | 指定的键值对将会在到达 `expiration` 之后过期 | string 类型，请确保输入的字符串为 `time.Duration` 支持的格式，默认为 `0` |
| `key` | `k` | 要设置过期时间的键 | string 类型，默认为 `""`。当该值为默认时，将对所有键设置过期时间 |
| `option` | 无 | 对 `expiration` 的额外操作，用于设置键的过期条件。**只有 Redis 7.0.0 之后的版本支持该参数** | string 类型，默认为 `""`。只支持 NX，XX，GT，LT |
| `password` | `p` | 登录 Redis 服务器的密码 | string 类型，默认为 `""` |

#### 模拟缓存过期示例

```bash
chaosd attack redis cache-expiration -a 127.0.0.1:6379 --option GT --expiration 1m
```

### 使用命令行模式模拟缓存限流

#### 模拟缓存限流命令

```bash
chaosd attack redis cache-limit -h
```

输出结果如下所示：

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

#### 模拟缓存限流相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `addr` | `a` | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string 类型，默认为 `""` |
| `password` | `p` | 登录 Redis 服务器的密码 | string 类型，默认为 `""` |
| `percent` | 无 | 指定 `maxmemory` 为原值的百分比 | string 类型，默认为 `""` |
| `size` | `s` | 指定 `maxmemory` 的大小 | string 类型，默认为 `0`，`0` 表示不限制内存大小 |

#### 模拟缓存限流示例

```bash
chaosd attack redis cache-limit -a 127.0.0.1:6379 -s 256M
```

### 使用命令行模式模拟缓存穿透

该命令将使用 Redis Pipeline 尽快地向 Redis 服务器发送指定数量的 GET 请求，并且由于请求的键值对并不存在于 Redis 服务器，这些请求将造成缓存穿透现象。

#### 模拟缓存穿透命令

```bash
chaosd attack redis cache-penetration -h
```

输出结果如下所示：

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

#### 模拟缓存穿透相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `addr` | `a` | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string 类型，默认为 `""` |
| `password` | `p` | 登录 Redis 服务器的密码 | string 类型，默认为 `""` |
| `request-num` | 无 | 指定向 Redis 服务器发送的无效请求数 | int 类型，默认为 `0` |

#### 模拟缓存穿透示例

```bash
chaosd attack redis cache-penetration -a 127.0.0.1:6379 --request-num 100000
```

### 使用命令行模式模拟哨兵重启

#### 模拟哨兵重启命令

```bash
chaosd attack redis sentinel-restart -h
```

输出结果如下所示：

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

#### 模拟哨兵重启相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `addr` | `a` | 需要注入故障的 Redis Sentinel 的地址以及端口号，如 `127.0.0.1:26379` | string 类型，默认为 `""` |
| `conf` | `c` | 指定哨兵的配置文件路径，用于恢复哨兵 | string 类型，默认为 `""` |
| `flush-config` | 无 | 指定在哨兵重启前，是否将内存中的配置更新到配置文件中 | bool 类型，默认为 `true` |
| `password` | p | 登录 Redis Sentinel 的密码 | string 类型，默认为 `""` |
| `redis-path` | 无 | 指定 `redis-server` 命令的路径 | string 类型，默认为 `""` |

#### 模拟哨兵重启示例

```bash
chaosd attack redis sentinel-restart -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### 使用命令行模式模拟哨兵不可用

#### 模拟哨兵不可用命令

```bash
chaosd attack redis sentinel-stop -h
```

输出结果如下所示：

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

#### 模拟哨兵不可用相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `addr` | `a` | 需要注入故障的 Redis Sentinel 的地址以及端口号，如 `127.0.0.1:26379` | string 类型，默认为 `""` |
| `conf` | `c` | 指定哨兵的配置文件路径，用于恢复哨兵 | string 类型，默认为 `""` |
| `flush-config` | 无 | 指定在哨兵重启前，是否将内存中的配置更新到配置文件中 | bool 类型，默认为 `true` |
| `password` | `p` | 登录 Redis Sentinel 的密码 | string 类型，默认为 `""` |
| `redis-path` | 无 | 指定 `redis-server` 命令的路径 | string 类型，默认为 `""` |

#### 模拟哨兵不可用示例

```bash
chaosd attack redis sentinel-stop -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

## 使用服务模式创建实验

要使用服务模式创建实验，需要进行以下操作：

1. 以服务模式运行 Chaosd。

   ```bash
   chaosd server --port 31767
   ```

2. 向 Chaosd 服务的路径 `/api/attack/redis` 发送 `POST` HTTP 请求。

   ```bash
   curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{fault-configuration}'
   ```

在上述命令中，你需要按照故障类型在 `fault-configuration` 中进行配置。有关对应的配置参数，请参考下文中各个类型故障的相关参数说明和命令示例。

:::note 提示

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 `/api/attack/{uid}` 发送 `DELETE` HTTP 请求。

:::

### 服务模式下模拟缓存过期

#### 模拟缓存过期相关参数说明

| 参数 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- |
| `action` | 实验的行为 | string | 设置为 `"expiration"` |
| `addr` | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string | 默认为 `""` |
| `expiration` | 指定的键值对将会 `expiration` 到达之后过期 | string | 请确保输入的字符串为 `time.Duration` 支持的格式，默认为 `0` |
| `key` | 要设置过期时间的键 | string | 默认为 `""`。当该值为默认时，将对所有键设置过期时间 |
| `option` | 对 `expiration` 的额外操作，用于设置键的过期条件。**只有 Redis 7.0.0 之后的版本支持该参数** | string | 默认为 `""`。只支持 NX，XX，GT，LT |
| `password` | 登录 Redis 服务器的密码 | string | 默认为 `""` |

#### 服务模式下模拟缓存过期示例

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"expiration", "expiration":"1m","addr":"127.0.0.1:6379"}'
```

### 服务模式下模拟缓存限流

#### 模拟缓存限流相关参数说明

| 参数 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- |
| `action` | 实验的行为 | string | 设置为 `"cacheLimit"` |
| `addr` | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string | 默认为 `""` |
| `password` | 登录 Redis 服务器的密码 | string | 默认为 `""` |
| `percent` | 指定 `maxmemory` 为原值的百分比 | string | 默认为 `""` |
| `size` | 指定 `maxmemory` 的大小 | string | 默认为 `0`，`0` 表示不限制内存大小 |

#### 服务模式下模拟缓存限流示例

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"cacheLimit", ""addr":"127.0.0.1:6379", "percent":"50%"}'
```

### 服务模式下模拟缓存穿透

#### 模拟缓存穿透相关参数说明

| 参数          | 说明                                                             | 类型     | 值                     |
| :------------ | :--------------------------------------------------------------- | :------- | :--------------------- |
| `action`      | 实验的行为                                                       | string   | 设置为 `"penetration"` |
| `addr`        | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string   | 默认为 `""`            |
| `password`    | 登录 Redis 服务器的密码                                          | string   | 默认为 `""`            |
| `request-num` | 指定向 Redis 服务器发送的无效请求数                              | int 类型 | 默认为 `0`             |

#### 服务模式下模拟缓存穿透示例

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"penetration", ""addr":"127.0.0.1:6379", "request-num":"10000"}'
```

### 服务模式下模拟哨兵重启

#### 模拟哨兵重启相关参数说明

| 参数 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- |
| `action` | 实验的行为 | string | 设置为 `"restart"` |
| `addr` | 需要注入故障的 Redis Sentinel 的地址以及端口号，如 `127.0.0.1:26379` | string | 默认为 `""` |
| `conf` | 指定哨兵的配置文件路径，用于恢复哨兵 | string | 默认为 `""` |
| `flush-config` | 指定在哨兵重启前，是否将内存中的配置更新到配置文件中 | bool 类型 | 默认为 `true` |
| `password` | 登录 Redis Sentinel 的密码 | string | 默认为 `""` |
| `redis-path` | 指定 `redis-server` 命令的路径 | string | 默认为 `""` |

#### 服务模式下模拟哨兵重启示例

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"restart", ""addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```

### 服务模式下模拟哨兵不可用

#### 模拟哨兵不可用相关参数说明

| 参数           | 说明                                                                 | 类型      | 值              |
| :------------- | :------------------------------------------------------------------- | :-------- | :-------------- |
| `action`       | 实验的行为                                                           | string    | 设置为 `"stop"` |
| `addr`         | 需要注入故障的 Redis Sentinel 的地址以及端口号，如 `127.0.0.1:26379` | string    | 默认为 `""`     |
| `conf`         | 指定哨兵的配置文件路径，用于恢复哨兵                                 | string    | 默认为 `""`     |
| `flush-config` | 指定在哨兵重启前，是否将内存中的配置更新到配置文件中                 | bool 类型 | 默认为 `true`   |
| `password`     | 登录 Redis Sentinel 的密码                                           | string    | 默认为 `""`     |
| `redis-path`   | 指定 `redis-server` 命令的路径                                       | string    | 默认为 `""`     |

#### 服务模式下模拟哨兵不可用示例

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"stop", ""addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```
