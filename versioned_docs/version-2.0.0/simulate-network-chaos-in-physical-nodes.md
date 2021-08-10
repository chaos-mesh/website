---
title: Simulate Network Faults
sidebar_label: Simulate Network Faults
---

This document introduces how to use Chaosd to simulate network faults. The simulations can be completed by modifying network routing and traffic flow control using iptables, ipsets, tc, etc.

## Notes

Make sure the NET_SCH_NETEM module is installed in the Linux kernel. If you are using CentOS, you can install the module through the kernel-modules-extra package. Most other Linux distributions have installed it already by default.

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

Currently, you can simulate four experimental scenarios using Chaosd: network corruption, network latency, network duplication, and network loss.

### Network corruption

You can run the following command to see the configuration of simulated network corruption using Chaosd:

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

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description                                                                                                                 | Value                                                                                                                     |
| :----------------- | :----------- | :-------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| correlation        | c            | The correlation between the percentage of current corrupt occurrence and the previous occurrence.                           | Int. It is a percentage ranging from 0 to 100 (10 is 10%) ("0" by default ).                                              |
| device             | d            | Name of the impacted network interface card.                                                                                | String, such as “eth0”. The value is required.                                                                            |
| egress-port        | e            | The egress traffic that only impacts specific destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname           | H            | The host name impacted by traffic.                                                                                          | String, such as "chaos-mesh.org".                                                                                         |
| ip                 | i            | The IP address impacted by egress traffic.                                                                                  | String, such as "123.123.123.123".                                                                                        |
| protocol           | p            | The IP protocol impacted by traffic.                                                                                        | String. Supported protocols: tcp, udp, icmp, all (all network protocols).                                                 |
| source-port        | s            | The egress traffic which only impact specific source ports. It can only be configured when the protocol is tcp or udp.      | String. Use a ',' to delimit the specific port or to indicate the range of the ports, such as "80,8001:8010".             |

### Network latency

You can run the following command to see the configuration of simulated network latency using Chaosd:

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

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description                                                                                                                 | Value                                                                                                                     |
| :----------------- | :----------- | :-------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| correlation        | c            | The correlation between the current latency and the previous one.                                                           | Int. It is a percentage ranging from 0 to 100 (10 is 10%) ("0" by default).                                               |
| device             | d            | Name of the impacted network interface card.                                                                                | String, such as “eth0”. The value is required.                                                                            |
| egress-port        | e            | The egress traffic which only impact specific destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname           | H            | The host name impacted by traffic.                                                                                          | String, such as "chaos-mesh.org".                                                                                         |
| ip                 | i            | The IP address impacted by egress traffic.                                                                                  | String, such as "123.123.123.123".                                                                                        |
| jitter             | j            | Range of the length of network delay time.                                                                                  | String. The time units can be: ns, us (µs), ms, s, m, h, such as "1ms".                                                   |
| latency            | l            | Length of network delay time.                                                                                               | String. The time units can be: ns, us (μs), ms, s, m, h, such as "1ms".                                                   |
| protocol           | p            | The IP protocol impacted by traffic.                                                                                        | String. It supports the following protocol types: tcp, udp, icmp, all (all network protocols).                            |
| source-port        | s            | The egress traffic that only impacts specified source ports. It can only be configured when the protocol is TCP or UDP.     | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |

### Network duplication

You can run the following command to see the configuration of simulated network duplication using Chaosd:

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

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description                                                                                                                  | Value                                                                                                                     |
| :----------------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| correlation        | c            | The correlation between the percentage of current duplication occurrence and the previous one.                               | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "0").                                                |
| device             | d            | Name of the impacted network interface card.                                                                                 | String, such as “eth0”. The value is required.                                                                            |
| egress-port        | e            | The egress traffic that only impacts specified destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname           | H            | The host name impacted by traffic.                                                                                           | String, such as "chaos-mesh.org".                                                                                         |
| ip                 | i            | The IP address impacted by egress traffic.                                                                                   | String, such as "123.123.123.123".                                                                                        |
| percent            | none         | Ratio of network packet duplicate.                                                                                           | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "1").                                                |
| protocol           | p            | The IP protocol impacted by traffic.                                                                                         | String. It supports the following protocol types: tcp, udp, icmp, all (all network protocols).                            |
| source-port        | s            | The egress traffic which only impact specific source ports. It can only be configured when the protocol is tcp or udp.       | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |

### Network loss

You can run the following command to see the configuration of simulated network loss using Chaosd:

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

The related configuration items are described as follows:

| Configuration item | Abbreviation | Description                                                                                                                 | Value                                                                                                                     |
| :----------------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| correlation        | c            | The correlation between the percentage of the current network loss and the previous one.                                     | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "0").                                                |
| device             | d            | Name of the impacted network interface card.                                                                                 | String, such as “eth0”. The value is required.                                                                            |
| egress-port        | e            | The egress traffic that only impacts specified destination ports. It can only be configured when the protocol is TCP or UDP. | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |
| hostname           | H            | The host name impacted by traffic.                                                                                           | String, such as "chaos-mesh.org".                                                                                         |
| ip                 | i            | The IP address impacted by egress traffic.                                                                                   | String, such as "123.123.123.123".                                                                                        |
| percent            | none         | Ratio of network packet loss.                                                                                                | Int. It is a percentage which range is 0 to 100 (10 is 10%) (default "1").                                                |
| protocol           | p            | Only impact traffic using this IP protocol.                                                                                  | String. It supports the following protocol types: tcp, udp, icmp, all (all network protocols).                            |
| source-port        | s            | The egress traffic which only impact specific source ports. It can only be configured when the protocol is tcp or udp.       | String. You need to use a ',' to separate the specific port or to indicate the range of the port, such as "80,8001:8010". |

### Examples

Simulate network corruption:

```bash
chaosd attack network corrupt -d eth0 -i 172.16.4.4 --percent 50
```

The output is as follows:

```bash
Attack network successfully, uid: 4eab1e62-8d60-45cb-ac85-3c17b8ac4825
```

Simulate network latency:

```bash
chaosd attack network delay -d eth0 -i 172.16.4.4 -l 10ms
```

The output is as follows:

```bash
Attack network successfully, uid: 4b23a0b5-e193-4b27-90a7-3e04235f32ab
```

Simulate network duplication:

```bash
chaosd attack network duplicate -d eth0 -i 172.16.4.4 --percent 50
```

The output is as follows:

```bash
Attack network successfully, uid: 7bcb74ee-9101-4ae4-82f0-e44c8a7f113c
```

Simulate network loss:

```bash
chaosd attack network loss -d eth0 -i 172.16.4.4 --percent 50
```

The output is as follows:

```bash
Attack network successfully, uid: 1e818adf-3942-4de4-949b-c8499f120265
```

When running the experiments, remember to save the uid of the experiments. To end a network fault simulation, use `recover`:

```bash
chaosd recover 1e818adf-3942-4de4-949b-c8499f120265
```

The output is as follows:

```bash
Recover 1e818adf-3942-4de4-949b-c8499f120265 successfully
```

## Create network fault experiments using service mode

(To be added)
