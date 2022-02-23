---
title: 模拟网络故障
---

本文主要介绍如何使用 Chaosd 模拟网络故障场景。该功能通过使用 iptables、ipsets、tc 等工具修改网络路由、流量控制来模拟网络故障。

::: note 注意

请确保 Linux 内核拥有 请确保 Linux 内核拥有 NET_SCH_NETEM 模块。对于 CentOS，可以通过 kernel-modules-extra 包安装该模块，大部分其他发行版已默认安装相应模块。

:::

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

### 使用命令行模式模拟网络包错误

通过运行网络包错误命令，可以查看模拟网络包错误场景支持的配置。

#### 网络包错误命令

具体命令如下所示：

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

#### 网络包错误相关配置说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| correlation | c | 表示包错误发生的概率与前一次是否发生的相关性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | e | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip | i | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| protocol | p | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| percent | 无 | 网络包错误的比例 | string 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |

#### 网络包错误示例

运行以下命令，模拟网络包错误：

```bash
chaosd attack network corrupt -d eth0 -i 172.16.4.4 --percent 50
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 4eab1e62-8d60-45cb-ac85-3c17b8ac4825
```

### 使用命令行模式模拟网络包延迟

通过运行网络包延迟命令，查看模拟网络延迟场景支持的配置。

#### 网络包延迟命令

具体命令如下所示：

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

#### 网络包延迟相关配置说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| correlation | c | 表示延迟时间的时间长度与前一次延迟时长的相关性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | e | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip | i | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| jitter | j | 延迟时间的变化范围 | string 类型，可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms" |
| latency | l | 表示延迟的时间长度 | string 类型，可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms" |
| protocol | p | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

#### 网络包延迟示例

运行以下命令，模拟网络包延迟：

```bash
chaosd attack network delay -d eth0 -i 172.16.4.4 -l 10ms
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 4b23a0b5-e193-4b27-90a7-3e04235f32ab
```

### 使用命令行模式模拟网络包重复

可以运行网络包重复命令，查看模拟网络包重复场景支持的配置：

#### 网络包重复命令

具体命令如下所示：

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

#### 网络包重复相关配置说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| correlation | c | 表示包重复发生的概率与前一次是否发生的相关性性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | e | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip | i | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| percent | 无 | 网络包重复的比例 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |
| protocol | p | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

#### 网络包重复示例

运行以下命令，模拟网络包重复：

```bash
chaosd attack network duplicate -d eth0 -i 172.16.4.4 --percent 50
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 7bcb74ee-9101-4ae4-82f0-e44c8a7f113c
```

### 使用命令行模式模拟网络包丢失

可以运行网络包丢失命令，查看模拟网络包丢失场景支持的配置：

#### 使用命令行模式模拟网络包丢失命令

具体命令如下所示：

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

#### 网络包丢失相关配置说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| correlation | c | 表示丢包发生的概率与前一次是否发生的相关性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | e | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip | i | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| percent | 无 | 网络丢包的比例 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |
| protocol | p | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | s | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

#### 网络包丢失示例

运行以下命令，模拟网络包丢失：

```bash
chaosd attack network loss -d eth0 -i 172.16.4.4 --percent 50
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 1e818adf-3942-4de4-949b-c8499f120265
```

### 使用命令行模式模拟网络分区

可以运行网络分区命令，查看模拟网络分区场景支持的配置。

#### 网络分区命令

具体命令如下所示：

```bash
chaosd attack network partition --help
```

输出结果如下所示：

```bash
partition

Usage:
  chaosd attack network partition [flags]

Flags:
      --accept-tcp-flags string   only the packet which match the tcp flag can be accepted, others will be dropped. only set when the protocol is tcp.
  -d, --device string             the network interface to impact
      --direction string          specifies the partition direction, values can be 'from', 'to'. 'from' means packets coming from the 'IPAddress' or 'Hostname' and going to your server, 'to' means packets originating from your server and going to the 'IPAddress' or 'Hostname'.
  -h, --help                      help for partition
  -H, --hostname string           only impact traffic to these hostnames
  -i, --ip string                 only impact egress traffic to these IP addresses
  -p, --protocol string           only impact traffic using this IP protocol, supported: tcp, udp, icmp, all

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### 网络分区相关配置说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| accept-tcp-flags | 无 | 表示接收包含指定标志的的 tcp 数据包，其他的则丢弃。具体配置规则参考 iptables 的 tcp-flags。仅当 protocol 为 tcp 时可以配置。 | string 类型，例如："SYN,ACK SYN,ACK" |
| device | d | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| direction | 无 | 指定分区的方向，对来自/发送到 hostname 指定的主机或者 ip 指定的地址的数据包进行分区 | string 类型，可选值为 "from" 或者 "to" |
| hostname | H | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip | i | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| protocol | p | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、udp、icmp、all（表示影响所有网络协议） |

#### 网络分区命令示例

```bash
./chaosd attack network partition -i 172.16.4.4 -d eth0 --direction from
```

### 使用命令行模式模拟 DNS 故障

可以运行 DNS 故障命令，查看模拟 DNS 故障场景支持的配置。

#### DNS 故障命令

具体命令如下所示：

```bash
chaosd attack network dns --help
```

输出结果如下所示：

```bash
attack DNS server or map specified host to specified IP

Usage:
  chaosd attack network dns [flags]

Flags:
  -d, --dns-domain-name string   map this host to specified IP
  -i, --dns-ip string         map specified host to this IP address
      --dns-server string     update the DNS server in /etc/resolv.conf with this value (default "123.123.123.123")
  -h, --help                  help for dns

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### DNS 故障相关配置说明

相关配置说明如下所示：

| 配置项          | 配置缩写 | 说明                           | 值                                      |
| :-------------- | :------- | :----------------------------- | :-------------------------------------- |
| dns-domain-name | H        | 表示影响的域名。               | string 类型，例如："chaos-mesh.org"     |
| dns-ip          | i        | 表示将影响的域名映射到该地址。 | string 类型，例如 "123.123.123.123"     |
| dns-server      | 无       | 指定 DNS 服务地址。            | string 类型，默认值为 "123.123.123.123" |

#### DNS 故障示例

```bash
./chaosd attack network dns --dns-ip 123.123.123.123 --dns-domain-name chaos-mesh.org
```

## 使用服务模式创建网络故障实验

要使用服务模式创建实验，请进行以下操作：

1. 以服务模式运行 chaosd。
   ```bash
   chaosd server --port 31767
   ```
2. 向 chaosd 服务的路径 /api/attack/network 发送 HTTP POTST 请求。 `bash curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{fault-configuration}' ` 其中 `fault-configuration` 需要按照故障类型进行配置，对应的配置参数请参考下文中各个类型故障的相关参数说明和命令示例。 在运行实验时，请注意保存实验的 uid 信息，当要结束 uid 对应的实验时，需要向 chaosd 服务的路径 /api/attack/{uid} 发送 HTTP DELETE 请求。

### 使用服务模式模拟网络包错误

在使用服务模拟网络包错误时，请参考如下内容。

#### 网络包错误相关参数说明

相关参数说明如下所示：

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| action | 实验的行为 | 设置为 "corrupt" |
| correlation | 表示包错误发生的概率与前一次是否发生的相关性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip-address | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| ip-protocol | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| percent | 网络包错误的比例 | string 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |

#### 使用服务模式模拟网络包错误示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"corrupt","device":"eth0","ip-address":"172.16.4.4","percent":"50"}'
```

### 使用服务模式模拟网络包延迟

在使用服务模拟网络包延迟时，请参考如下内容。

#### 网络包延迟相关参数说明

相关参数说明如下所示：

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| action | 实验的行为 | 设置为 "delay" |
| correlation | 表示延迟时间的时间长度与前一次延迟时长的相关性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip-address | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| jitter | 延迟时间的变化范围 | string 类型，可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms" |
| latency | 表示延迟的时间长度 | string 类型，可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms" |
| ip-protocol | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

#### 使用服务模式模拟网络包延迟示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"delay","device":"eth0","ip-address":"172.16.4.4","latency":"10ms"}'
```

### 使用服务模式模拟网络包重复

在使用服务模拟网络包重复时，请参考如下内容。

#### 网络包重复相关参数说明

相关参数说明如下所示：

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| action | 实验的行为 | 设置为 "duplicate" |
| correlation | 表示包重复发生的概率与前一次是否发生的相关性性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip-address | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| percent | 网络包重复的比例 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |
| ip-protocol | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

#### 使用服务模式模拟网络包重复示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"duplicate","ip-protocol":"172.16.4.4","device":"eth0","percent":"50"}'
```

### 使用服务模式模拟网络包丢失

在使用服务模拟网络包丢失时，请参考如下内容。

#### 网络包丢失相关参数说明

相关参数说明如下所示：

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| action | 实验的行为 | 设置为 "loss" |
| correlation | 表示丢包发生的概率与前一次是否发生的相关性 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip-address | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| percent | 网络丢包的比例 | int 类型，取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |
| ip-protocol | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、 udp、icmp、all（表示影响所有网络协议） |
| source-port | 仅影响到指定目的端口的入口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型，使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

#### 使用服务模式模拟网络包丢失示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"loss","ip-protocol":"172.16.4.4","device":"eth0","percent":"50"}'
```

### 使用服务模式模拟网络分区

在使用服务模拟网络分区时，请参考如下内容。

#### 网络分区相关参数说明

相关参数说明如下所示：

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| action | 实验的行为 | 设置为 "partition" |
| accept-tcp-flags | 表示接收包含指定标志的的 tcp 数据包，其他的则丢弃。具体配置规则参考 iptables 的 tcp-flags。仅当 protocol 为 tcp 时可以配置。 | string 类型，例如："SYN,ACK SYN,ACK" |
| device | 影响的网卡设备名称 | string 类型，例如 "eth0"，必须要设置 |
| direction | 指定分区的方向，对来自/发送到 hostname 指定的主机或者 ip 指定的地址的数据包进行分区 | string 类型，可选值为 "from" 或者 "to" |
| hostname | 只影响到指定的主机名 | string 类型，如 "chaos-mesh.org" |
| ip | 只影响到指定的 IP 地址 | string 类型，如 "123.123.123.123" |
| protocol | 只影响指定的 IP 协议 | string 类型，支持协议类型包括：tcp、udp、icmp、all（表示影响所有网络协议） |

#### 服务模式网络分区命令示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"partition","ip-protocol":"172.16.4.4","device":"eth0","direction":"from"}'
```

### 使用服务模式模拟 DNS 故障

在使用服务模拟 DNS 故障时，请参考如下内容。

#### DNS 故障相关参数说明

相关参数说明如下所示：

| 参数            | 说明                           | 值                                      |
| :-------------- | :----------------------------- | :-------------------------------------- |
| action          | 实验的行为                     | 设置为 "dns"                            |
| dns-domain-name | 表示影响的域名。               | string 类型，例如："chaos-mesh.org"     |
| dns-ip          | 表示将影响的域名映射到该地址。 | string 类型，例如 "123.123.123.123"     |
| dns-server      | 指定 DNS 服务地址。            | string 类型，默认值为 "123.123.123.123" |

#### 使用服务模式模拟 DNS 故障示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"dns","dns-ip":"123.123.123.123","dns-domain-name":"chaos-mesh.org"}'
```
