---
title: 模拟网络故障
---

本文主要介绍如何使用 Chaosd 模拟网络故障场景。该功能通过使用 iptables、ipsets、tc 等工具修改网络路由、流量控制来模拟网络故障。

:::info

请确保 Linux 内核中有 `NET_SCH_NETEM` 模块。对于 CentOS，可以通过 `kernel-modules-extra` 包安装该模块，大部分其他发行版默认已安装相应模块。

:::

在创建网络故障实验前，可以运行以下命令查看 Chaosd 支持的网络故障类型：

```bash
chaosd attack network --help
```

目前 Chaosd 支持模拟以下实验场景：网络包错误（corrupt）、网络延迟（delay）、网络包重复（duplicate）、网络包丢失（loss）、网络分区（partition）、DNS 故障（dns）、网络带宽限制（bandwidth）、端口占用（port）、网卡禁用（down）以及网络流量泛洪（flood）。

要使用服务模式创建实验，你需要以服务模式运行 Chaosd，然后向 Chaosd 服务的路径 `/api/attack/network` 发送 `POST` HTTP 请求：

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{fault-configuration}'
```

在上述命令中，你需要按照故障类型在 `fault-configuration` 中进行配置。有关对应的配置参数和示例，请参考下文中各个类型故障的相关参数说明。

:::info

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 `/api/attack/{uid}` 发送 `DELETE` HTTP 请求。

:::

## 模拟网络包错误场景

### 模拟网络包错误相关参数说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "corrupt" |
| correlation | c | correlation | 表示包错误发生的概率与前一次是否发生的相关性 | string 类型 | 取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | device | 影响的网卡设备名称 | string 类型 | 例如 "eth0"，必须要设置 |
| egress-port | e | egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | hostname | 只影响到指定的主机名 | string 类型 | 如 "chaos-mesh.org" |
| ip | i | ip-address | 只影响到指定的 IP 地址 | string 类型 | 如 "123.123.123.123" |
| protocol | p | ip-protocol | 只影响指定的 IP 协议 | string 类型 | 支持协议类型包括：tcp、udp、icmp、all（表示影响所有网络协议） |
| source-port | s | source-port | 仅影响到来自指定源端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| percent | — | percent | 网络包错误的比例 | string 类型 | 取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |

### 使用命令行模式模拟网络包错误场景

通过运行网络包错误命令，可以查看模拟网络包错误场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network corrupt --help
```

运行以下命令，模拟网络包错误：

```bash
chaosd attack network corrupt -d eth0 -i 172.16.4.4 --percent 50
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 4eab1e62-8d60-45cb-ac85-3c17b8ac4825
```

### 使用服务模式模拟网络包错误场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"corrupt","device":"eth0","ip-address":"172.16.4.4","percent":"50"}'
```

## 模拟网络延迟场景

### 模拟网络延迟相关参数说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "delay" |
| correlation | c | correlation | 表示延迟时间的时间长度与前一次延迟时长的相关性 | string 类型 | 取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | device | 影响的网卡设备名称 | string 类型 | 例如 "eth0"，必须要设置 |
| egress-port | e | egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | hostname | 只影响到指定的主机名 | string 类型 | 如 "chaos-mesh.org" |
| ip | i | ip-address | 只影响到指定的 IP 地址 | string 类型 | 如 "123.123.123.123" |
| jitter | j | jitter | 延迟时间的变化范围 | string 类型 | 可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms" |
| latency | l | latency | 表示延迟的时间长度 | string 类型 | 可使用的时间单位包括：ns、us (µs)、ms、s、m、h，如 "1ms" |
| protocol | p | ip-protocol | 只影响指定的 IP 协议 | string 类型 | 支持协议类型包括：tcp、udp、icmp、all（表示影响所有网络协议） |
| source-port | s | source-port | 仅影响到来自指定源端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

### 使用命令行模式模拟网络延迟场景

通过运行网络包延迟命令，查看模拟网络延迟场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network delay --help
```

运行以下命令，模拟网络包延迟：

```bash
chaosd attack network delay -d eth0 -i 172.16.4.4 -l 10ms
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 4b23a0b5-e193-4b27-90a7-3e04235f32ab
```

### 使用服务模式模拟网络延迟场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"delay","device":"eth0","ip-address":"172.16.4.4","latency":"10ms"}'
```

## 模拟网络包重复场景

### 模拟网络包重复相关参数说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "duplicate" |
| correlation | c | correlation | 表示包重复发生的概率与前一次是否发生的相关性 | string 类型 | 取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | device | 影响的网卡设备名称 | string 类型 | 例如 "eth0"，必须要设置 |
| egress-port | e | egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | hostname | 只影响到指定的主机名 | string 类型 | 如 "chaos-mesh.org" |
| ip | i | ip-address | 只影响到指定的 IP 地址 | string 类型 | 如 "123.123.123.123" |
| percent | — | percent | 网络包重复的比例 | string 类型 | 取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |
| protocol | p | ip-protocol | 只影响指定的 IP 协议 | string 类型 | 支持协议类型包括：tcp、udp、icmp、all（表示影响所有网络协议） |
| source-port | s | source-port | 仅影响到来自指定源端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

### 使用命令行模式模拟网络包重复场景

可以运行网络包重复命令，查看模拟网络包重复场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network duplicate --help
```

运行以下命令，模拟网络包重复：

```bash
chaosd attack network duplicate -d eth0 -i 172.16.4.4 --percent 50
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 7bcb74ee-9101-4ae4-82f0-e44c8a7f113c
```

### 使用服务模式模拟网络包重复场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"duplicate","ip-address":"172.16.4.4","device":"eth0","percent":"50"}'
```

## 模拟网络包丢失场景

### 模拟网络包丢失相关参数说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "loss" |
| correlation | c | correlation | 表示丢包发生的概率与前一次是否发生的相关性 | string 类型 | 取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 0 |
| device | d | device | 影响的网卡设备名称 | string 类型 | 例如 "eth0"，必须要设置 |
| egress-port | e | egress-port | 仅影响到指定目的端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |
| hostname | H | hostname | 只影响到指定的主机名 | string 类型 | 如 "chaos-mesh.org" |
| ip | i | ip-address | 只影响到指定的 IP 地址 | string 类型 | 如 "123.123.123.123" |
| percent | — | percent | 网络丢包的比例 | string 类型 | 取值范围为 0 到 100，表示百分比（10 表示 10%），默认值为 1 |
| protocol | p | ip-protocol | 只影响指定的 IP 协议 | string 类型 | 支持协议类型包括：tcp、udp、icmp、all（表示影响所有网络协议） |
| source-port | s | source-port | 仅影响到来自指定源端口的出口流量，仅当 protocol 为 tcp 或 udp 时配置 | string 类型 | 使用 "," 分隔指定的端口或者端口范围，如 "80,8001:8010" |

### 使用命令行模式模拟网络包丢失场景

可以运行网络包丢失命令，查看模拟网络包丢失场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network loss --help
```

运行以下命令，模拟网络包丢失：

```bash
chaosd attack network loss -d eth0 -i 172.16.4.4 --percent 50
```

运行成功时，会输出以下结果：

```bash
Attack network successfully, uid: 1e818adf-3942-4de4-949b-c8499f120265
```

### 使用服务模式模拟网络包丢失场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"loss","ip-address":"172.16.4.4","device":"eth0","percent":"50"}'
```

## 模拟网络分区场景

### 模拟网络分区相关参数说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "partition" |
| accept-tcp-flags | — | accept-tcp-flags | 表示接收包含指定标志的 tcp 数据包，其他的则丢弃。具体配置规则参考 iptables 的 tcp-flags。仅当 protocol 为 tcp 时可以配置 | string 类型 | 例如："SYN,ACK SYN,ACK" |
| device | d | device | 影响的网卡设备名称 | string 类型 | 例如 "eth0"，必须要设置 |
| direction | — | direction | 指定分区的方向，可选值为 "to"、"from" 或 "both"。"from" 表示来自 "ip" 或 "hostname" 指定地址并发往你的服务器的数据包；"to" 表示从你的服务器发出并发往 "ip" 或 "hostname" 指定地址的数据包 | string 类型 | 可选值为 "to"、"from" 或 "both"，默认值为 "both" |
| hostname | H | hostname | 只影响到指定的主机名 | string 类型 | 如 "chaos-mesh.org" |
| ip | i | ip-address | 只影响到指定的 IP 地址 | string 类型 | 如 "123.123.123.123" |
| protocol | p | ip-protocol | 只影响指定的 IP 协议 | string 类型 | 支持协议类型包括：tcp、udp、icmp、all（表示影响所有网络协议） |

### 使用命令行模式模拟网络分区场景

可以运行网络分区命令，查看模拟网络分区场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network partition --help
```

运行以下命令，模拟网络分区：

```bash
chaosd attack network partition -i 172.16.4.4 -d eth0 --direction from
```

### 使用服务模式模拟网络分区场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"partition","ip-address":"172.16.4.4","device":"eth0","direction":"from"}'
```

## 模拟 DNS 故障场景

### 模拟 DNS 故障相关参数说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "dns" |
| dns-domain-name | d | dns-domain-name | 表示影响的域名 | string 类型 | 例如："chaos-mesh.org" |
| dns-ip | i | dns-ip | 表示将影响的域名映射到该地址 | string 类型 | 例如 "123.123.123.123" |
| dns-server | — | dns-server | 指定 DNS 服务地址 | string 类型 | 默认值为 "123.123.123.123" |

### 使用命令行模式模拟 DNS 故障场景

可以运行 DNS 故障命令，查看模拟 DNS 故障场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network dns --help
```

通过映射指定的主机名和 IP 地址从而模拟 DNS 故障，运行命令如下所示：

```bash
chaosd attack network dns --dns-ip 123.123.123.123 --dns-domain-name chaos-mesh.org
```

配置错误的 DNS 服务地址从而模拟 DNS 故障，运行命令如下所示：

```bash
chaosd attack network dns --dns-server 123.123.123.123
```

### 使用服务模式模拟 DNS 故障场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"dns","dns-domain-name":"chaos-mesh.org","dns-ip":"123.123.123.123"}'
```

## 模拟网络带宽限制场景

### 模拟网络带宽限制相关参数说明

相关配置说明如下所示：

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "bandwidth" |
| buffer | b | buffer | 能够瞬间发送的最大字节数 | uint32 类型 | 如：`10000`。必须要设置 |
| device | d | device | 影响的网卡设备名称 | string 类型 | 如 `"eth0"`，必须要设置 |
| hostname | H | hostname | 只影响到指定的主机名 | string 类型 | 如 `"chaos-mesh.org"`。`hostname` 与 `ip` 不能同时为空。同时设置 `hostname` 与 `ip` 时，配置项对指定的主机名和 IP 地址均产生影响 |
| ip | i | ip-address | 仅影响到指定的 IP 地址 | string 类型 | 如 `"123.123.123.123"`。`hostname` 与 `ip` 不能同时为空。同时设置 `hostname` 与 `ip` 时，配置项对指定的主机名和 IP 地址均产生影响 |
| limit | l | limit | 在队列中等待的字节数 | uint32 类型 | 如：`10000`。必须要设置 |
| minburst | m | minburst | peakrate bucket 的大小 | uint32 类型 | 如：`10000` |
| peakrate | — | peakrate | bucket 的最大消耗率 | uint64 类型 | 如：`10000` |
| rate | r | rate | 带宽限制的速率 | string 类型 | 如 `"1mbps"`。必须要设置 |

### 使用命令行模式模拟网络带宽限制场景

可以运行限制网络带宽命令，查看该场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network bandwidth --help
```

运行以下命令，模拟限制网络带宽：

```bash
chaosd attack network bandwidth --buffer 10000 --device eth0 --limit 10000 --rate 10mbps
```

### 使用服务模式模拟网络带宽限制场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"bandwidth","buffer":10000,"limit":10000,"rate":"10mbps","device":"eth0"}'
```

## 模拟端口占用场景

### 模拟端口占用相关参数说明

相关配置说明如下所示：

| 配置项   | 配置缩写 | 服务模式字段 | 说明         | 类型        | 值                       |
| :------- | :------- | :----------- | :----------- | :---------- | :----------------------- |
| `action` | —        | action       | 实验的行为   | string 类型 | 设置为 "occupied"        |
| port     | p        | port         | 占用的端口号 | string 类型 | 例如："8080"。必须要设置 |

### 使用命令行模式模拟端口占用场景

可以运行占用端口命令，查看该场景支持的配置。

具体命令如下所示：

```bash
chaosd attack network port --help
```

运行以下命令，模拟端口占用：

```bash
chaosd attack network port --port 8080
```

### 使用服务模式模拟端口占用场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"occupied","port":"8080"}'
```

## 模拟网卡禁用场景

### 模拟网卡禁用相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "down" |
| device | d | device | 禁用的网卡设备名称 | string 类型 | 例如 "eth0"，必须要设置 |
| duration | — | duration | 网卡禁用的持续时间，到期后 Chaosd 会自动恢复网卡 | string 类型 | 例如 "30s"，必须要设置 |

### 使用命令行模式模拟网卡禁用场景

可以运行以下命令，查看模拟网卡禁用场景支持的配置：

```bash
chaosd attack network down --help
```

运行以下命令，禁用指定的网卡：

```bash
chaosd attack network down -d eth0 --duration 30s
```

### 使用服务模式模拟网卡禁用场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"down","device":"eth0","duration":"30s"}'
```

## 模拟网络流量泛洪场景

:::info

网络流量泛洪依赖 `iperf`。请确保运行 Chaosd 的物理机上已安装 `iperf`，并在目标 IP 地址和端口上运行 iperf 服务端。

:::

### 模拟网络流量泛洪相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "flood" |
| duration | — | duration | 泛洪持续时间，单位为秒 | string 类型 | 例如 "30"，必须要设置 |
| ip | i | ip-address | 接收 UDP 流量的 iperf 服务端 IP 地址 | string 类型 | 例如 "172.16.4.4"，必须要设置 |
| parallel | — | parallel | iperf 客户端的并行流数量 | int32 类型 | 例如 1 |
| port | p | port | iperf 服务端的端口 | string 类型 | 例如 "5001"，必须要设置 |
| rate | r | rate | UDP 流量的速率，使用 iperf 的语法 | string 类型 | 例如 "10M"，必须要设置 |

### 使用命令行模式模拟网络流量泛洪场景

可以运行以下命令，查看模拟网络流量泛洪场景支持的配置：

```bash
chaosd attack network flood --help
```

运行以下命令，使用 iperf 生成 UDP 流量：

```bash
chaosd attack network flood -i 172.16.4.4 -p 5001 -r 10M --duration 30
```

### 使用服务模式模拟网络流量泛洪场景

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"flood","ip-address":"172.16.4.4","port":"5001","rate":"10M","parallel":1,"duration":"30"}'
```
