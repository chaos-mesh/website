---
title: 模拟压力场景
---

本文主要介绍如何使用 Chaosd 模拟压力场景。该功能通过使用 [stress-ng](https://wiki.ubuntu.com/Kernel/Reference/stress-ng) 在主机上生成 CPU 或者内存压力，支持通过命令行模式或服务模式创建压力实验。

在创建压力实验前，可运行以下命令查看 Chaosd 支持的压力实验类型：

```bash
chaosd attack stress --help
```

目前 Chaosd 支持创建 CPU 压力实验和内存压力实验。

要使用服务模式创建实验，你需要以服务模式运行 Chaosd，然后向 Chaosd 服务的路径 `/api/attack/stress` 发送 `POST` HTTP 请求：

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{fault-configuration}'
```

在上述命令中，你需要按照故障类型在 `fault-configuration` 中进行配置。有关对应的配置参数和示例，请参考下文中各个类型故障的相关参数说明。

:::note

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 `/api/attack/{uid}` 发送 `DELETE` HTTP 请求。

:::

## 模拟 CPU 压力场景

### 模拟 CPU 压力相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "cpu" |
| `load` | l | load | 指定使用每个 CPU worker 占用 CPU 负载的百分比。如果为 `0`，则表示为一个空负载；为 `100` 则表示满负载 | int 类型 | 取值范围为 `0` 到 `100`，默认值为 `10` |
| `workers` | w | workers | 指定用于生成 CPU 压力的 worker 数量 | int 类型 | 默认值为 `1` |
| `options` | o | options | stress-ng 的其他参数设置，一般情况下不需要配置 | string 类型 | 默认值为 "" |

### 使用命令行模式模拟 CPU 压力场景

运行以下命令可查看模拟 CPU 压力场景支持的配置：

```bash
chaosd attack stress cpu --help
```

示例如下：

```bash
chaosd attack stress cpu --workers 2 --load 10
```

### 使用服务模式模拟 CPU 压力场景

向 Chaosd 服务的路径 `/api/attack/stress` 发送 `POST` HTTP 请求，并配置如下 `fault-configuration`：

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"load":10, "action":"cpu","workers":1}'
```

## 模拟内存压力场景

### 模拟内存压力相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "mem" |
| `size` | s | size | 指定每个 VM worker 占用内存的大小 | string 类型 | 支持使用单位 B，KB/KiB，MB/MiB，GB/GiB，TB/TiB 来设置占用的内存大小。如果不设置，则默认占用所有可用的内存。 |
| `options` | o | options | stress-ng 的其他参数设置，一般情况下不需要配置 | string 类型 | 默认值为 "" |

### 使用命令行模式模拟内存压力场景

运行以下命令可查看模拟内存压力场景支持的配置：

```bash
chaosd attack stress mem --help
```

示例如下：

```bash
chaosd attack stress mem --workers 2 --size 100M
```

在运行实验时，你需要保存实验的 UID 信息。当不再需要某个压力模拟时，可使用 `recover` 终止对应的 UID 实验：

```bash
chaosd recover c2bff2f5-3aac-4ace-b7a6-322946ae6f13
```

### 使用服务模式模拟内存压力场景

向 Chaosd 服务的路径 `/api/attack/stress` 发送 `POST` HTTP 请求，并配置如下 `fault-configuration`：

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"size":"100M", "action":"mem"}'
```
