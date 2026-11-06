---
title: 模拟 Redis 故障
---

本文介绍如何使用 Chaosd 模拟 Redis 故障。该功能使用 `go-redis` 包中的 Golang 接口以及 `redis-server` 命令行工具。你可以通过命令行模式或服务模式创建实验。

在创建实验前，你可以运行以下命令查看 Chaosd 支持的 Redis 故障类型：

```bash
chaosd attack redis -h
```

目前 Chaosd 支持模拟缓存过期、缓存穿透、缓存限制、Sentinel 重启以及 Sentinel 停止。

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

## 模拟缓存过期场景

### 模拟缓存过期相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "expiration" |
| `addr` | a | addr | 被注入故障的 Redis 服务器的地址和端口，例如 `127.0.0.1:6379` | string 类型 | 默认值为 `""` |
| `expiration` | — | expiration | 到达 `expiration` 之后指定的 key 将被过期 | string 类型 | 默认值为 `"0"`。请确保该字符串符合 `time.Duration` 支持的格式 |
| `key` | k | key | 将要过期的 key | string 类型 | 默认值为 `""`，即对所有的 key 设置过期 |
| `option` | — | option | `expiration` 的附加选项。**只有 Redis 7.0.0 之后的版本支持该标志** | string 类型 | 默认值为 `""`。只支持 NX、XX、GT 和 LT |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |

### 使用命令行模式模拟缓存过期场景

该命令的含义与 Redis 中的 `EXPIRE` 相同。有关更多详细信息，请参见 [Redis 官方文档](https://redis.io/commands/expire/)。

:::note

目前 Chaosd 不支持恢复已执行 `cache-expiration` 的 key，因此如果你希望恢复它们，请提前备份。

:::

```bash
chaosd attack redis cache-expiration -h
```

```bash
chaosd attack redis cache-expiration -a 127.0.0.1:6379 --option GT --expiration 1m
```

### 使用服务模式模拟缓存过期场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"expiration", "expiration":"1m","addr":"127.0.0.1:6379"}'
```

## 模拟缓存限制场景

### 模拟缓存限制相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "cacheLimit" |
| `addr` | a | addr | 被注入故障的 Redis 服务器的地址和端口，例如 `127.0.0.1:6379` | string 类型 | 默认值为 `""` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `percent` | — | percent | 将 `maxmemory` 指定为原始值的百分比 | string 类型 | 默认值为 `""` |
| `size` | s | cacheSize | 指定 `maxmemory` 的大小 | string 类型 | 默认为 `0`，即不限制内存 |

### 使用命令行模式模拟缓存限制场景

```bash
chaosd attack redis cache-limit -h
```

```bash
chaosd attack redis cache-limit -a 127.0.0.1:6379 -s 256M
```

### 使用服务模式模拟缓存限制场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"cacheLimit", "addr":"127.0.0.1:6379", "percent":"50%"}'
```

## 模拟缓存穿透场景

### 模拟缓存穿透相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "penetration" |
| `addr` | a | addr | 被注入故障的 Redis 服务器的地址和端口，例如 `127.0.0.1:6379` | string 类型 | 默认值为 `""` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `request-num` | — | requestNum | 指定发送到 Redis 服务器的请求数量 | int 类型 | 默认值为 `0` |

### 使用命令行模式模拟缓存穿透场景

该命令将通过 Redis Pipeline 尽快将指定数量的 `GET` 请求发送到 Redis 服务器。由于所请求的 key 在 Redis 服务器上不存在，因此这些请求会引发缓存穿透现象。

```bash
chaosd attack redis cache-penetration -h
```

```bash
chaosd attack redis cache-penetration -a 127.0.0.1:6379 --request-num 100000
```

### 使用服务模式模拟缓存穿透场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"penetration", "addr":"127.0.0.1:6379", "requestNum":10000}'
```

## 模拟 Sentinel 重启场景

### 模拟 Sentinel 重启相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "restart" |
| `addr` | a | addr | 被注入故障的 Sentinel 的地址和端口，例如 `127.0.0.1:26379` | string 类型 | 默认值为 `""` |
| `conf` | c | conf | 指定 Sentinel 配置文件的路径，该文件将被用于恢复 Sentinel | string 类型 | 默认值为 `""` |
| `flush-config` | — | flushConfig | 强制 Sentinel 将其配置（包括当前的 Sentinel 状态）重写到磁盘上 | bool 类型 | 默认值为 `true` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `redis-path` | — | redisPath | 指定包含 `redis-server` 可执行文件的目录，例如 `/opt/redis/bin`。留空时使用 Chaosd 进程的 `PATH` 查找 | string 类型 | 默认值为 `""` |

### 使用命令行模式模拟 Sentinel 重启场景

```bash
chaosd attack redis sentinel-restart -h
```

```bash
chaosd attack redis sentinel-restart -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### 使用服务模式模拟 Sentinel 重启场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"restart", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```

## 模拟 Sentinel 停止场景

### 模拟 Sentinel 停止相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "stop" |
| `addr` | a | addr | 被注入故障的 Sentinel 的地址和端口，例如 `127.0.0.1:26379` | string 类型 | 默认值为 `""` |
| `conf` | c | conf | 指定 Sentinel 配置文件的路径，该文件将被用于恢复 Sentinel | string 类型 | 默认值为 `""` |
| `flush-config` | — | flushConfig | 强制 Sentinel 将其配置（包括当前的 Sentinel 状态）重写到磁盘上 | bool 类型 | 默认值为 `true` |
| `password` | p | password | 登录服务器的密码 | string 类型 | 默认值为 `""` |
| `redis-path` | — | redisPath | 指定包含 `redis-server` 可执行文件的目录，例如 `/opt/redis/bin`。留空时使用 Chaosd 进程的 `PATH` 查找 | string 类型 | 默认值为 `""` |

### 使用命令行模式模拟 Sentinel 停止场景

```bash
chaosd attack redis sentinel-stop -h
```

```bash
chaosd attack redis sentinel-stop -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### 使用服务模式模拟 Sentinel 停止场景

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"stop", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```
