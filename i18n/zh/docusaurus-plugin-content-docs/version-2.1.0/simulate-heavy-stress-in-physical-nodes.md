---
title: 模拟压力场景
---

本文主要介绍如何使用 Chaosd 模拟压力场景。该功能通过使用 [stress-ng](https://wiki.ubuntu.com/Kernel/Reference/stress-ng) 在主机上生成 CPU 或者内存压力，支持通过命令行模式或服务模式创建压力实验。

## 使用命令行模式创建压力实验

本节介绍如何在命令行模式中创建压力实验。

在创建压力实验前，可运行以下命令查看 Chaosd 支持的压力实验类型：

```bash
chaosd attack stress --help
```

输出如下所示：

```bash
Stress attack related commands

Usage:
  chaosd attack stress [command]

Available Commands:
  cpu         continuously stress CPU out
  mem         continuously stress virtual memory out

Flags:
  -h, --help   help for stress

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'

Use "chaosd attack stress [command] --help" for more information about a command.
```

目前 Chaosd 支持创建 CPU 压力实验和内存压力实验。

### 模拟 CPU 压力场景

#### 模拟 CPU 压力命令

运行以下命令可查看模拟 CPU 压力场景支持的配置：

```bash
chaosd attack stress cpu --help
```

输出如下所示：

```bash
continuously stress CPU out

Usage:
  chaosd attack stress cpu [options] [flags]

Flags:
  -h, --help              help for cpu
  -l, --load int          Load specifies P percent loading per CPU worker. 0 is effectively a sleep (no load) and 100 is full loading. (default 10)
  -o, --options strings   extend stress-ng options.
  -w, --workers int       Workers specifies N workers to apply the stressor. (default 1)

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### 模拟 CPU 压力相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| load | l | 指定使用每个 worker 占用 CPU 负载的百分比。如果为 0，则表示为一个空负载；为 100 则表示满负载 | int 类型，取值范围为 0 到 100， 默认值为 10 |
| workers | w | 指定用于生成 CPU 压力的 worker 数量 | int 类型，默认值为 1 |
| options | o | stress-ng 的其他参数设置，一般情况下不需要配置 | string 类型，默认值为 "" |

#### 模拟 CPU 压力示例

```bash
chaosd attack stress cpu --workers 2 --load 10
```

输出如下所示：

```bash
[2021/05/12 03:38:33.698 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --cpu 2 --cpu-load 10"]
[2021/05/12 03:38:33.702 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --cpu 2 --cpu-load 10"] [Pid=27483]
Attack stress cpu successfully, uid: 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
```

### 模拟内存压力场景

#### 模拟内存压力命令

运行以下命令可查看模拟内存压力场景支持的配置：

```bash
chaosd attack stress mem --help
```

输出如下所示：

```bash
continuously stress virtual memory out

Usage:
  chaosd attack stress mem [options] [flags]

Flags:
  -h, --help              help for mem
  -o, --options strings   extend stress-ng options.
  -s, --size string       Size specifies N bytes consumed per vm worker, default is the total available memory. One can specify the size as % of total available memory or in units of B, KB/KiB, MB/MiB, GB/GiB, TB/TiB..

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### 模拟内存压力相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| size | s | 指定每个 vm worker 占用内存的大小 | string 类型，支持使用单位 B，KB/KiB，MB/MiB，GB/GiB，TB/TiB 来设置占用的内存大小。如果不设置，则默认占用所有可用的内存。 |
| options | o | stress-ng 的其他参数设置，一般情况下不需要配置 | string 类型，默认值为 "" |

#### 模拟内存压力示例

```bash
chaosd attack stress mem --workers 2 --size 100M
```

输出如下所示：

```bash
[2021/05/12 03:37:19.643 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --vm 2 --vm-keep --vm-bytes 100000000"]
[2021/05/12 03:37:19.654 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --vm 2 --vm-keep --vm-bytes 100000000"] [Pid=26799]
Attack stress mem successfully, uid: c2bff2f5-3aac-4ace-b7a6-322946ae6f13
```

## 使用服务模式创建压力实验

要使用服务模式创建实验，请进行以下操作：

1. 以服务模式运行 chaosd。
   ```bash
   chaosd server --port 31767
   ```
2. 向 chaosd 服务的路径 /api/attack/stress 发送 HTTP POTST 请求。 `bash curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{fault-configuration}' ` 其中 `fault-configuration` 需要按照故障类型进行配置，对应的配置参数请参考下文中各个类型故障的相关参数说明和命令示例。 在运行实验时，请注意保存实验的 uid 信息，当要结束 uid 对应的实验时，需要向 chaosd 服务的路径 /api/attack/{uid} 发送 HTTP DELETE 请求。

### 服务模式模拟 CPU 压力场景

#### 模拟 CPU 压力相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| action | 实验的行为 | 设置为 "cpu" |
| load | 指定使用每个 worker 占用 CPU 负载的百分比。如果为 0，则表示为一个空负载；为 100 则表示满负载 | int 类型，取值范围为 0 到 100， 默认值为 10 |
| workers | 指定用于生成 CPU 压力的 worker 数量 | int 类型，默认值为 1 |
| options | stress-ng 的其他参数设置，一般情况下不需要配置 | string 类型，默认值为 "" |

#### 服务模式模拟 CPU 压力示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"load":10, "action":"cpu","workers":1}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

### 服务模式模拟内存压力场景

#### 模拟内存压力相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| action | 实验的行为 | 设置为 "mem" |
| size | 指定每个 vm worker 占用内存的大小 | string 类型，支持使用单位 B，KB/KiB，MB/MiB，GB/GiB，TB/TiB 来设置占用的内存大小。如果不设置，则默认占用所有可用的内存。 |
| options | stress-ng 的其他参数设置，一般情况下不需要配置 | string 类型，默认值为 "" |

#### 服务模式模拟内存压力示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"size":"100M", "action":"mem"}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```
