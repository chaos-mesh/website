---
title: 模拟网络故障
---

本文主要介绍如何使用 Chaosd 模拟网络故障场景。该功能通过使用 iptables、ipsets、tc 等工具修改网络路由、流量控制来模拟网络故障。

## 注意事项

请确保 Linux 内核拥有 请确保 Linux 内核拥有 NET_SCH_NETEM 模块。对于 CentOS，可以通过 kernel-modules-extra 包安装该模块，大部分其他发行版已默认安装相应模块。

## 使用命令行模式创建网络故障实验

本节介绍如何在命令行模式创建网络故障实验。

在创建网络故障实验前，可以运行以下命令查看 Chaosd 支持的网络故障类型：

```bash
chaosd attack network --help
```

输出结果如下所示：

```bash
Network attack related commands

Usage:
  chaosd attack network [command]

Available Commands:
  corrupt     corrupt network packet
  delay       delay network
  duplicate   duplicate network packet
  loss        loss network packet

Flags:
  -h, --help   help for network

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'

Use "chaosd attack network [command] --help" for more information about a command.
```

目前 Chaosd 支持模拟网络包错误（corrupt）、延迟（delay）、重复（duplicate）、丢失（loss）四种实验场景。

### 网络包错误

可以运行以下命令，查看模拟网络包错误场景支持的配置：

```bash
chaosd attack network corrupt --help
```

输出结果如下所示：

```bash
corrupt network packet

Usage:
  chaosd attack network corrupt [flags]

Flags:
  -c, --correlation string   correlation is percentage (10 is 10%) (default "0")
  -d, --device string        the network interface to impact
  -e, --egress-port string   only impact egress traffic to these destination ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp
  -h, --help                 help for corrupt
  -H, --hostname string      only impact traffic to these hostnames
  -i, --ip string            only impact egress traffic to these IP addresses
      --percent string       percentage of packets to corrupt (10 is 10%) (default "1")
  -p, --protocol string      only impact traffic using this IP protocol, supported: tcp, udp, icmp, all
  -s, --source-port string   only impact egress traffic from these source ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

相关配置说明如下所示：

| 配置项      | 配置缩写 | 说明                                                               | 值                                                                          |
| :---------- | :------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| correlation | c        | 表示包错误发生的概率与前一次是否发生的相关性                       | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0        |
| device      | d        | 影响的网卡设备名称                                                 | string 类型，例如 "eth0"，必须要设置                                        |
| egress-port | e        | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |
| hostname    | H        | 只影响到指定的主机名                                               | string 类型，如 "chaos-mesh.org"                                            |
| ip          | i        | 只影响到指定的 IP 地址                                             | string 类型，如 "123.123.123.123"                                           |
| protocol    | p        | 只影响指定的 IP 协议                                               | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s        | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |

### 网络包延迟

可以运行以下命令，查看模拟网络延迟场景支持的配置：

```bash
chaosd attack network delay --help
```

输出结果如下所示：

```bash
delay network

Usage:
  chaosd attack network delay [flags]

Flags:
  -c, --correlation string   correlation is percentage (10 is 10%) (default "0")
  -d, --device string        the network interface to impact
  -e, --egress-port string   only impact egress traffic to these destination ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp
  -h, --help                 help for delay
  -H, --hostname string      only impact traffic to these hostnames
  -i, --ip string            only impact egress traffic to these IP addresses
  -j, --jitter string        jitter time, time units: ns, us (or µs), ms, s, m, h.
  -l, --latency string       delay egress time, time units: ns, us (or µs), ms, s, m, h.
  -p, --protocol string      only impact traffic using this IP protocol, supported: tcp, udp, icmp, all
  -s, --source-port string   only impact egress traffic from these source ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

相关配置说明如下所示：

| 配置项      | 配置缩写 | 说明                                                               | 值                                                                          |
| :---------- | :------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| correlation | c        | 表示延迟时间的时间长度与前一次延迟时长的相关性                     | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0        |
| device      | d        | 影响的网卡设备名称                                                 | string 类型，例如 "eth0"，必须要设置                                        |
| egress-port | e        | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |
| hostname    | H        | 只影响到指定的主机名                                               | string 类型，如 "chaos-mesh.org"                                            |
| ip          | i        | 只影响到指定的 IP 地址                                             | string 类型，如 "123.123.123.123"                                           |
| jitter      | j        | 延迟时间的变化范围                                                 | string 类型，可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms"       |
| latency     | l        | 表示延迟的时间长度                                                 | string 类型，可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms"       |
| protocol    | p        | 只影响指定的 IP 协议                                               | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s        | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |

### 网络包重复

可以运行以下命令，查看模拟网络包重复场景支持的配置：

```bash
chaosd attack network duplicate --help
```

输出结果如下所示：

```bash
duplicate network packet

Usage:
  chaosd attack network duplicate [flags]

Flags:
  -c, --correlation string   correlation is percentage (10 is 10%) (default "0")
  -d, --device string        the network interface to impact
  -e, --egress-port string   only impact egress traffic to these destination ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp
  -h, --help                 help for duplicate
  -H, --hostname string      only impact traffic to these hostnames
  -i, --ip string            only impact egress traffic to these IP addresses
      --percent string       percentage of packets to duplicate (10 is 10%) (default "1")
  -p, --protocol string      only impact traffic using this IP protocol, supported: tcp, udp, icmp, all
  -s, --source-port string   only impact egress traffic from these source ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

相关配置说明如下所示：

| 配置项      | 配置缩写 | 说明                                                               | 值                                                                          |
| :---------- | :------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| correlation | c        | 表示包重复发生的概率与前一次是否发生的相关性性                     | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0        |
| device      | d        | 影响的网卡设备名称                                                 | string 类型，例如 "eth0"，必须要设置                                        |
| egress-port | e        | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |
| hostname    | H        | 只影响到指定的主机名                                               | string 类型，如 "chaos-mesh.org"                                            |
| ip          | i        | 只影响到指定的 IP 地址                                             | string 类型，如 "123.123.123.123"                                           |
| percent     | 无       | 网络包重复的比例                                                   | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1        |
| protocol    | p        | 只影响指定的 IP 协议                                               | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s        | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |

### 网络包丢失

可以运行以下命令，查看模拟网络包丢失场景支持的配置：

```bash
chaosd attack network loss --help
```

输出结果如下所示：

```bash
loss network packet

Usage:
  chaosd attack network loss [flags]

Flags:
  -c, --correlation string   correlation is percentage (10 is 10%) (default "0")
  -d, --device string        the network interface to impact
  -e, --egress-port string   only impact egress traffic to these destination ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp
  -h, --help                 help for loss
  -H, --hostname string      only impact traffic to these hostnames
  -i, --ip string            only impact egress traffic to these IP addresses
      --percent string       percentage of packets to drop (10 is 10%) (default "1")
  -p, --protocol string      only impact traffic using this IP protocol, supported: tcp, udp, icmp, all
  -s, --source-port string   only impact egress traffic from these source ports, use a ',' to separate or to indicate the range, such as 80, 8001:8010. It can only be used in conjunction with -p tcp or -p udp

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

相关配置说明如下所示：

| 配置项      | 配置缩写 | 说明                                                               | 值                                                                          |
| :---------- | :------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| correlation | c        | 表示丢包发生的概率与前一次是否发生的相关性                         | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0        |
| device      | d        | 影响的网卡设备名称                                                 | string 类型，例如 "eth0"，必须要设置                                        |
| egress-port | e        | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |
| hostname    | H        | 只影响到指定的主机名                                               | string 类型，如 "chaos-mesh.org"                                            |
| ip          | i        | 只影响到指定的 IP 地址                                             | string 类型，如 "123.123.123.123"                                           |
| percent     | 无       | 网络丢包的比例                                                     | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1        |
| protocol    | p        | 只影响指定的 IP 协议                                               | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s        | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010"         |

### 使用示例

模拟网络包错误：

```bash
chaosd attack network corrupt -d eth0 -i 172.16.4.4 --percent 50
```

输出结果如下所示：

```bash
Attack network successfully, uid: 4eab1e62-8d60-45cb-ac85-3c17b8ac4825
```

模拟网络包延迟：

```bash
chaosd attack network delay -d eth0 -i 172.16.4.4 -l 10ms
```

输出结果如下所示：

```bash
Attack network successfully, uid: 4b23a0b5-e193-4b27-90a7-3e04235f32ab
```

模拟网络包重复：

```bash
chaosd attack network duplicate -d eth0 -i 172.16.4.4 --percent 50
```

输出结果如下所示：

```bash
Attack network successfully, uid: 7bcb74ee-9101-4ae4-82f0-e44c8a7f113c
```

模拟网络包丢失：

```bash
chaosd attack network loss -d eth0 -i 172.16.4.4 --percent 50
```

输出结果如下所示：

```bash
Attack network successfully, uid: 1e818adf-3942-4de4-949b-c8499f120265
```

在运行实验时，请注意保存实验的 uid 信息。在不需要网络故障场景时，使用 `recover` 命令来结束 uid 对应的实验：

```bash
chaosd recover 1e818adf-3942-4de4-949b-c8499f120265
```

输出结果如下所示：

```bash
Recover 1e818adf-3942-4de4-949b-c8499f120265 successfully
```

## 使用服务模式创建网络故障实验

（正在持续更新中）
