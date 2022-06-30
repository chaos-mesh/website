---
title: 模拟 Redis 故障
---

本文主要介绍如何使用 Chaosd 模拟 Redis 故障。该功能通过使用 `go-redis` 包中的 Golang 接口和 `redis-server` 命令行工具模拟 Redis 故障场景，支持通过命令行模式或服务模式创建实验。

## 使用命令行模式创建实验

在创建进程故障实验前，可运行以下命令行查看 Chaosd 支持的进程故障类型：

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

该命令与 Redis EXPIRE 操作意义一致，详情参考[官方文档](https://redis.io/commands/expire/)。

:::note 注意

目前不支持恢复执行了 `cache-expiration` 操作的 key，如要恢复请提前备份。

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
| `addr` | a | 需要注入故障的 Redis 服务器的地址以及端口号,如 `127.0.0.1:6379` | string 类型，默认为 `""` |
| `expiration` | 无 | 指定的键值对将会 `expiration` 到达之后过期 | string 类型，请确保输入的字符串为 `time.Duration` 支持的格式，默认为 `0`|
| `key` | k | 要从缓存中过期的键 | string 类型，默认为 `""`。当该值为默认时，将对所有键设置过期操作 |
| `option` | 无 | 对 `expiration` 的额外操作，用于设置键的过期条件，**只有7.0之后的 Redis 版本支持该参数** | string 类型，默认为 `""`。只支持 NX，XX，GT，LT |
| `password` | p | 登录 Redis 服务器的密码 | string 类型，默认为 `""`|

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

#### 模拟进程被暂停相关配置说明

| 配置项    | 配置缩写 | 说明                                 | 值                       |
| :-------- | :------- | :----------------------------------- | :----------------------- |
| `addr` | a        | 需要注入故障的 Redis 服务器的地址以及端口号,如 `127.0.0.1:6379` | string 类型，默认为 `""` |
| `password` | p        | 登录 Redis 服务器的密码 | string 类型，默认为 `""`|
| `percent` | 无        | 指定 `maxmemory` 为原值的百分比 | string 类型，默认为 `""` |
| `size` | s        | 指定 `maxmemory` 的大小 | string 类型，默认为 `0` |

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

| 配置项    | 配置缩写 | 说明                                 | 值                       |
| :-------- | :------- | :----------------------------------- | :----------------------- |
| `addr` | a        | 需要注入故障的 Redis 服务器的地址以及端口号,如 `127.0.0.1:6379` | string 类型，默认为 `""` |
| `password` | p        | 登录 Redis 服务器的密码 | string 类型，默认为 `""`|
| `request-num` | 无        | 指定向 Redis 服务器发送的无效请求数 | int 类型，默认为 `0` |


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

| 配置项    | 配置缩写 | 说明                                 | 值                       |
| :-------- | :------- | :----------------------------------- | :----------------------- |
| `addr` | a        | 需要注入故障的 Redis Sentinel 的地址以及端口号,如 `127.0.0.1:26379` | string 类型，默认为 `""` |
| `conf` | c        | 指定哨兵的配置文件路径，用于恢复哨兵 | string 类型，默认为 `""` |
| `flush-config` | 无        | 指定在哨兵重启前，将内存中的配置更新到配置文件中 | bool 类型，默认为 `true` |
| `password` | p        | 登录 Redis Sentinel 的密码 | string 类型，默认为 `""`|
| `redis-path` | 无        | 指定 `redis-server` 命令的路径 | string 类型，默认为 `""` |


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

#### 模拟缓存穿透相关配置说明

| 配置项    | 配置缩写 | 说明                                 | 值                       |
| :-------- | :------- | :----------------------------------- | :----------------------- |
| `addr` | a        | 需要注入故障的 Redis Sentinel 的地址以及端口号,如 `127.0.0.1:26379` | string 类型，默认为 `""` |
| `conf` | c        | 指定哨兵的配置文件路径，用于恢复哨兵 | string 类型，默认为 `""` |
| `flush-config` | 无        | 指定在哨兵重启前，将内存中的配置更新到配置文件中 | bool 类型，默认为 `true` |
| `password` | p        | 登录 Redis Sentinel 的密码 | string 类型，默认为 `""`|
| `redis-path` | 无        | 指定 `redis-server` 命令的路径 | string 类型，默认为 `""` |


#### 模拟缓存穿透示例

```bash
chaosd attack redis sentinel-stop -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

## 使用服务模式创建实验

TODO
