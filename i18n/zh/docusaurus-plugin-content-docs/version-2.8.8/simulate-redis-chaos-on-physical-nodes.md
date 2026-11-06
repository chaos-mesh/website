---
title: 模拟 Redis 故障
---

本文主要介绍如何使用 Chaosd 模拟 Redis 故障。该功能通过使用 `go-redis` 包中的 Golang 接口和 `redis-server` 命令行工具模拟 Redis 故障场景，支持通过命令行模式或服务模式创建实验。

在创建 Redis 故障实验前，可运行以下命令查看 Chaosd 支持的 Redis 故障类型：

```bash
chaosd attack redis -h
```

目前 Chaosd 支持模拟缓存过期、缓存限流、缓存穿透、哨兵重启和哨兵不可用等故障场景。

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

该命令与 Redis `EXPIRE` 操作意义一致，详情参考 [Redis 官方文档](https://redis.io/commands/expire/)。

:::note

目前不支持恢复执行了 `cache-expiration` 操作的 key，如需恢复请提前备份。

:::

### 模拟缓存过期相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "expiration" |
| `addr` | a | addr | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string 类型 | 默认为 `""` |
| `expiration` | 无 | expiration | 指定的键值对将会在到达 `expiration` 之后过期 | string 类型 | 默认为 `"0"`，请确保输入的字符串为 `time.Duration` 支持的格式 |
| `key` | k | key | 要设置过期时间的键 | string 类型 | 默认为 `""`。当该值为默认时，将对所有键设置过期时间 |
| `option` | 无 | option | 对 `expiration` 的额外操作，用于设置键的过期条件。**只有 Redis 7.0.0 之后的版本支持该参数** | string 类型 | 默认为 `""`。只支持 NX，XX，GT，LT |
| `password` | p | password | 登录 Redis 服务器的密码 | string 类型 | 默认为 `""` |

### 使用命令行模式模拟缓存过期场景

```bash
chaosd attack redis cache-expiration -h
```

示例如下：

```bash
chaosd attack redis cache-expiration -a 127.0.0.1:6379 --option GT --expiration 1m
```

### 使用服务模式模拟缓存过期场景

示例如下：

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"expiration", "expiration":"1m","addr":"127.0.0.1:6379"}'
```

## 模拟缓存限流场景

### 模拟缓存限流相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "cacheLimit" |
| `addr` | a | addr | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string 类型 | 默认为 `""` |
| `password` | p | password | 登录 Redis 服务器的密码 | string 类型 | 默认为 `""` |
| `percent` | 无 | percent | 指定 `maxmemory` 为原值的百分比 | string 类型 | 默认为 `""` |
| `size` | s | cacheSize | 指定 `maxmemory` 的大小 | string 类型 | 默认为 `0`，`0` 表示不限制内存大小 |

### 使用命令行模式模拟缓存限流场景

```bash
chaosd attack redis cache-limit -h
```

示例如下：

```bash
chaosd attack redis cache-limit -a 127.0.0.1:6379 -s 256M
```

### 使用服务模式模拟缓存限流场景

示例如下：

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"cacheLimit", "addr":"127.0.0.1:6379", "percent":"50%"}'
```

## 模拟缓存穿透场景

该命令将使用 Redis Pipeline 尽快地向 Redis 服务器发送指定数量的 GET 请求，并且由于请求的键值对并不存在于 Redis 服务器，这些请求将造成缓存穿透现象。

### 模拟缓存穿透相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "penetration" |
| `addr` | a | addr | 需要注入故障的 Redis 服务器的地址以及端口号，如 `127.0.0.1:6379` | string 类型 | 默认为 `""` |
| `password` | p | password | 登录 Redis 服务器的密码 | string 类型 | 默认为 `""` |
| `request-num` | 无 | requestNum | 指定向 Redis 服务器发送的无效请求数 | int 类型 | 默认为 `0` |

### 使用命令行模式模拟缓存穿透场景

```bash
chaosd attack redis cache-penetration -h
```

示例如下：

```bash
chaosd attack redis cache-penetration -a 127.0.0.1:6379 --request-num 100000
```

### 使用服务模式模拟缓存穿透场景

示例如下：

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"penetration", "addr":"127.0.0.1:6379", "requestNum":10000}'
```

## 模拟哨兵重启场景

### 模拟哨兵重启相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "restart" |
| `addr` | a | addr | 需要注入故障的 Redis Sentinel 的地址以及端口号，如 `127.0.0.1:26379` | string 类型 | 默认为 `""` |
| `conf` | c | conf | 指定哨兵的配置文件路径，用于恢复哨兵 | string 类型 | 默认为 `""` |
| `flush-config` | 无 | flushConfig | 指定在哨兵重启前，是否将内存中的配置更新到配置文件中 | bool 类型 | 默认为 `true` |
| `password` | p | password | 登录 Redis Sentinel 的密码 | string 类型 | 默认为 `""` |
| `redis-path` | 无 | redisPath | 指定包含 `redis-server` 可执行文件的目录，例如 `/opt/redis/bin`。留空时使用 Chaosd 进程的 `PATH` 查找 | string 类型 | 默认为 `""` |

### 使用命令行模式模拟哨兵重启场景

```bash
chaosd attack redis sentinel-restart -h
```

示例如下：

```bash
chaosd attack redis sentinel-restart -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### 使用服务模式模拟哨兵重启场景

示例如下：

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"restart", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```

## 模拟哨兵不可用场景

### 模拟哨兵不可用相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "stop" |
| `addr` | a | addr | 需要注入故障的 Redis Sentinel 的地址以及端口号，如 `127.0.0.1:26379` | string 类型 | 默认为 `""` |
| `conf` | c | conf | 指定哨兵的配置文件路径，用于恢复哨兵 | string 类型 | 默认为 `""` |
| `flush-config` | 无 | flushConfig | 指定在哨兵重启前，是否将内存中的配置更新到配置文件中 | bool 类型 | 默认为 `true` |
| `password` | p | password | 登录 Redis Sentinel 的密码 | string 类型 | 默认为 `""` |
| `redis-path` | 无 | redisPath | 指定包含 `redis-server` 可执行文件的目录，例如 `/opt/redis/bin`。留空时使用 Chaosd 进程的 `PATH` 查找 | string 类型 | 默认为 `""` |

### 使用命令行模式模拟哨兵不可用场景

```bash
chaosd attack redis sentinel-stop -h
```

示例如下：

```bash
chaosd attack redis sentinel-stop -a 127.0.0.1:26379 --conf /home/redis-test/sentinel-26379.conf
```

### 使用服务模式模拟哨兵不可用场景

示例如下：

```bash
curl -X POST 127.0.0.1:31767/api/attack/redis -H "Content-Type:application/json" -d '{"action":"stop", "addr":"127.0.0.1:26379", "conf":"/home/redis-test/sentinel-26379.conf"}'
```

## 使用 Chaos Mesh 创建实验

:::note[版本说明]

本节的配置说明适用于 Chaos Mesh 2.8.8 及更高版本。

:::

使用前，请先按[模拟物理机故障](simulate-physical-machine-chaos.md)配置 Chaosd 和目标机器。

将 `spec.action` 设置为 `redis-expiration`、`redis-penetration`、`redis-cacheLimit`、`redis-restart` 或 `redis-stop`，并将故障参数填写在同名配置块中。

对于 `redis-restart` 和 `redis-stop`，`redisPath` 是一个字符串，用于指定 `redis-server` 所在的目录，例如 `/opt/redis/bin`。如果不设置此字段或将它留空，Chaosd 会通过自身进程的 `PATH` 查找 `redis-server`。

:::warning

从早于 2.8.8 的版本升级时，请按以下顺序操作：

1. 升级 CRD 前，移除现有 `PhysicalMachineChaos` 资源以及 `Schedule`、`Workflow`、`WorkflowNode` 资源中物理机实验模板内的布尔类型 `redisPath`。同时移除已保存的清单中的布尔值。
2. 将 Chaos Mesh 及其 CRD 升级至 2.8.8 或更高版本。
3. 如需指定 Redis 安装路径，再将 `redisPath` 设置为目录字符串。

:::
