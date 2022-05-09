---
title: Simulate Network Faults
---

This document introduces how to use Chaosd to simulate network faults. The simulations can be completed by modifying network routing and traffic flow control using iptables, ipsets, tc, etc.

:::note

Make sure the NET_SCH_NETEM module is installed in the Linux kernel. If you are using CentOS, you can install the module through the kernel-modules-extra package. Most other Linux distributions have installed it already by default.

:::

## Create network fault experiments using command-line mode

This section introduces how to create network fault experiments using command-line mode.

Before creating an experiment, you can run the following command to check the types of network faults supported by Chaosd:

```bash
chaosd attack network --help
```

The output is as follows:

```bash
Network attack related commands

Usage:
  chaosd attack network [command]

Available Commands:
  bandwidth limit network bandwidth
  corrupt     corrupt network packet
  delay       delay network
  dns attack  DNS server or map specified host to specified IP
  duplicate   duplicate network packet
  loss        loss network packet
  partition   partition
  port        attack network port

Flags:
  -h, --help   help for network

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'

Use "chaosd attack network [command] --help" for more information about a command.
```

Currently, you can simulate four experimental scenarios using Chaosd: network corruption, network latency, network duplication, and network loss.

### Network corruption

You can run the command below to see the configuration of simulated network corruption using Chaosd.

#### The command for network corruption

The command is as follows:

```bash
chaosd attack network corrupt --help
```

The output is as follows:

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

#### Configuration items related to network corruption

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| correlation | c | The correlation between the percentage of current corrupt occurrence and the previous occurrence. | Int. It is a percentage ranging from 0 to 100 (10 is 10%) ("0" by default ). |
| device | d | Name of the impacted network interface card. | String, such as "eth0". The value is required. |
| egress-port | e | The egress traffic that only impacts specific destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname | H | The host name impacted by traffic. | String, such as "chaos-mesh.org". |
| ip | i | The IP address impacted by egress traffic. | String, such as "123.123.123.123". |
| protocol | p | The IP protocol impacted by traffic. | String. Supported protocols: tcp, udp, icmp, all (all network protocols). |
| source-port | s | The egress traffic which only impact specific source ports. It can only be configured when the protocol is tcp or udp. | String. Use a ',' to delimit the specific port or to indicate the range of the ports, such as "80,8001:8010". |

#### An example of network corruption

Run the following command to simulate network corruption:

```bash
chaosd attack network corrupt -d eth0 -i 172.16.4.4 --percent 50
```

If the command runs successfully, the output is as follows:

```bash
Attack network successfully, uid: 4eab1e62-8d60-45cb-ac85-3c17b8ac4825
```

### Network latency

You can run the command below to see the configuration of simulated network latency using Chaosd.

#### The command for network latency

The command is as follows:

```bash
chaosd attack network delay --help
```

The output is as follows:

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

#### Configuration items related to network latency

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| correlation | c | The correlation between the current latency and the previous one. | Int. It is a percentage ranging from 0 to 100 (10 is 10%) ("0" by default). |
| device | d | Name of the impacted network interface card. | String, such as "eth0". The value is required. |
| egress-port | e | The egress traffic which only impact specific destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname | H | The host name impacted by traffic. | String, such as "chaos-mesh.org". |
| ip | i | The IP address impacted by egress traffic. | String, such as "123.123.123.123". |
| jitter | j | Range of the length of network delay time. | String. The time units can be: ns, us (µs), ms, s, m, h, such as "1ms". |
| latency | l | Length of network delay time. | String. The time units can be: ns, us (μs), ms, s, m, h, such as "1ms". |
| protocol | p | The IP protocol impacted by traffic. | String. It supports the following protocol types: tcp, udp, icmp, all (all network protocols). |
| source-port | s | The egress traffic that only impacts specified source ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |

#### An example of network latency

Run the following command to simulate network latency:

```bash
chaosd attack network delay -d eth0 -i 172.16.4.4 -l 10ms
```

If the command runs successfully, the output is as follows:

```bash
Attack network successfully, uid: 4b23a0b5-e193-4b27-90a7-3e04235f32ab
```

### Network duplication

You can run the command below to see the configuration of simulated network duplication using Chaosd.

#### The command for network duplication

The command is as follows:

```bash
chaosd attack network duplicate --help
```

The output is as follows:

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

#### Configuration items related to network duplication

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| correlation | c | The correlation between the percentage of current duplication occurrence and the previous one. | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "0"). |
| device | d | Name of the impacted network interface card. | String, such as "eth0". The value is required. |
| egress-port | e | The egress traffic that only impacts specified destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname | H | The host name impacted by traffic. | String, such as "chaos-mesh.org". |
| ip | i | The IP address impacted by egress traffic. | String, such as "123.123.123.123". |
| percent | none | Ratio of network packet duplicate. | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "1"). |
| protocol | p | The IP protocol impacted by traffic. | String. It supports the following protocol types: tcp, udp, icmp, all (all network protocols). |
| source-port | s | The egress traffic which only impact specific source ports. It can only be configured when the protocol is tcp or udp. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |

#### An example of network duplication

Run the following command to simulate network duplication:

```bash
chaosd attack network duplicate -d eth0 -i 172.16.4.4 --percent 50
```

If the command runs successfully, the output is as follows:

```bash
Attack network successfully, uid: 7bcb74ee-9101-4ae4-82f0-e44c8a7f113c
```

### Network loss

You can run the command below to see the configuration of simulated network loss using Chaosd:

#### The command for network loss

The command is as follows:

```bash
chaosd attack network loss --help
```

The output is as follows:

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

#### Configuration items related to network loss

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| correlation | c | The correlation between the percentage of the current network loss and the previous one. | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "0"). |
| device | d | Name of the impacted network interface card. | String, such as "eth0". The value is required. |
| egress-port | e | The egress traffic that only impacts specified destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname | H | The host name impacted by traffic. | String, such as "chaos-mesh.org". |
| ip | i | The IP address impacted by egress traffic. | String, such as "123.123.123.123". |
| percent | none | Ratio of network packet loss. | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "1"). |
| protocol | p | Only impact traffic using this IP protocol. | String. It supports the following protocol types: tcp, udp, icmp, all (all network protocols). |
| source-port | s | The egress traffic which only impact specific source ports. It can only be configured when the protocol is tcp or udp. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |

#### An example of network loss

Run the following command to simulate network loss:

```bash
chaosd attack network loss -d eth0 -i 172.16.4.4 --percent 50
```

If the command runs successfully, the output is as follows:

```bash
Attack network successfully, uid: 1e818adf-3942-4de4-949b-c8499f120265
```

### Network partition

You can run the command below to see the configuration of simulated network partition using Chaosd.

#### The command for network partition

The command is as follows:

```bash
chaosd attack network partition --help
```

The output is as follows:

```bash
partition

Usage:
  chaosd attack network partition [flags]

Flags:
      --accept-tcp-flags string   only the packet which match the tcp flag can be accepted, others will be dropped. only set when the protocol is tcp.
  -d, --device string             the network interface to impact
      --direction string          specifies the partition direction, values can be 'to', 'from' or 'both'. 'from' means packets coming from the 'IPAddress' or 'Hostname' and going to your server, 'to' means packets originating from your server and going to the 'IPAddress' or 'Hostname'. (default "both")
  -h, --help                      help for partition
  -H, --hostname string           only impact traffic to these hostnames
  -i, --ip string                 only impact egress traffic to these IP addresses
  -p, --protocol string           only impact traffic using this IP protocol, supported: tcp, udp, icmp, all

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```


#### Configuration items related to network partition

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| accept-tcp-flags | none | only the packet which match the tcp flag can be accepted, others will be dropped. only set when the protocol is tcp. | string, such as "SYN,ACK SYN,ACK" |
| device | d | the network interface to impact | string, such as "eth0", required |
| direction | d | specifies the partition direction, values can be 'to', 'from' or 'both'. 'from' means packets coming from the 'IPAddress' or 'Hostname' and going to your server, 'to' means packets originating from your server and going to the 'IPAddress' or 'Hostname'. | string, values can be 'to', 'from' or 'both' (default "both") |
| hostname | H | only impact traffic to these hostnames | string, such as "chaos-mesh.org". one of "hostname" and "ip" is required |
| ip | i | only impact egress traffic to these IP addresses | string, such as "192.168.123.123". one of "hostname" and "ip" is required |
| protocol | p | only impact traffic using this IP protocol, supported: tcp, udp, icmp, all | string, such as "tcp", "udp", "icmp", "all" |


#### An example of network partition

Run the following command to simulate network partition:

```bash
chaosd attack network partition -i 172.16.4.4 -d eth0 --direction from
```

### DNS fault

You can run the command below to see the configuration of simulated DNS fault using Chaosd.

#### The command for DNS fault

```bash
chaosd attack network dns --help
```

The output is as follows:

```bash
attack DNS server or map specified host to specified IP

Usage:
  chaosd attack network dns [flags]

Flags:
  -d, --dns-domain-name string   map this host to specified IP
  -i, --dns-ip string            map specified host to this IP address
      --dns-server string        update the DNS server in /etc/resolv.conf with this value (default "123.123.123.123")
  -h, --help                     help for dns

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Configuration items related to DNS fault

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| dns-domain-name | d | map this host to specified IP(dns-ip) | string, such as "chaos-mesh.org".  |
| dns-ip | i | map specified host(dns-domain-name) to this IP address | string, such as "123.123.123.123" |
| dns-server | none | update the DNS server in /etc/resolv.conf with this value | string, such as "123.123.123.123" (default "123.123.123.123") |

#### An example of DNS fault

Run the following command to simulate DNS fault by mapping specified host to specified IP:

```bash
chaosd attack network dns --dns-ip 123.123.123.123 --dns-domain-name chaos-mesh.org
```

Run the following command to simulate DNS fault by using wrong DNS server:

```bash
chaosd attack network dns --dns-server 123.123.123.123
```

### Network bandwidth

You can run the command below to see the configuration of simulated network bandwidth using Chaosd.

#### The command for network bandwidth

The command is as follows:

```bash
chaosd attack network bandwidth --help
```

The output is as follows:

```bash
limit network bandwidth

Usage:
  chaosd attack network bandwidth [flags]

Flags:
  -b, --buffer uint32     the maximum amount of bytes that tokens can be available for instantaneously
  -d, --device string     the network interface to impact
  -h, --help              help for bandwidth
  -H, --hostname string   only impact traffic to these hostnames
  -i, --ip string         only impact egress traffic to these IP addresses
  -l, --limit uint32      the number of bytes that can be queued waiting for tokens to become available
  -m, --minburst uint32   specifies the size of the peakrate bucket
      --peakrate uint     the maximum depletion rate of the bucket
  -r, --rate string       the speed knob, allows bps, kbps, mbps, gbps, tbps unit. bps means bytes per second

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Configuration items related to network bandwidth

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| buffer | b | the maximum amount of bytes that tokens can be available for instantaneously | int, such as 10000, required |
| device | d | the network interface to impact | string, such as "eth0", required |
| hostname | H | only impact traffic to these hostnames | string, such as "chaos-mesh.org". `hostname` and `ip` cannot be empty at the same time. when 'hostname' and 'ip' are set at the same time, the configuration item affects both the specified hostname and ip |
| ip | i | only impact egress traffic to these IP addresses | string, such as "123.123.123.123". `hostname` and `ip` cannot be empty at the same time. when 'hostname' and 'ip' are set at the same time, the configuration item affects both the specified hostname and ip |
| limit | l | the number of bytes that can be queued waiting for tokens to become available | int, such as 10000, required |
| minburst | m | specifies the size of the peakrate bucket | int, such as 10000 |
| peakrate | none | the maximum depletion rate of the bucket | int, such as 10000 |
| rate | r | the speed knob, allows bps, kbps, mbps, gbps, tbps unit. bps means bytes per second | string, such as "1mbps", required |

#### An example of network bandwidth

Run the following command to simulate network bandwidth:

```bash
chaosd attack network bandwidth --buffer 10000 --device eth0 --limit 10000 --rate 10mbps
```

### Port occupation

You can run the command below to see the configuration of simulated port occupation.

#### The command for port occupation

The command is as follows:

```bash
chaosd attack network port --help
```

The output is as follows:

```bash
attack network port

Usage:
  chaosd attack network port [flags]

Flags:
  -h, --help          help for port
  -p, --port string   this specified port is to occupied

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### Configuration items related to port occupation

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| port | p | this specified port is to occupied | int, such as 8080, required |

#### An example of port occupation

Run the following command to simulate network bandwidth:

```bash
chaosd attack network port --port 8080
```

## Create network fault experiments using service mode

(To be added)
