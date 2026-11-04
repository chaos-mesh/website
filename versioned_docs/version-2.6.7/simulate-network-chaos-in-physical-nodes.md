---
title: Simulate Network Faults
---

This document introduces how to use Chaosd to simulate network faults. The simulations can be completed by modifying network routing and traffic flow control using iptables, ipsets, tc, etc.

:::note

Make sure the NET_SCH_NETEM module is installed in the Linux kernel. If you are using CentOS, you can install the module through the kernel-modules-extra package. Most other Linux distributions have installed it already by default.

:::

Before creating an experiment, you can run the following command to check the types of network faults supported by Chaosd:

```bash
chaosd attack network --help
```

Currently, you can simulate the following experimental scenarios using Chaosd: network corruption, network latency, network duplication, network loss, network partition, DNS fault, network bandwidth limitation, and port occupation.

To create experiments using the service mode, you need to run Chaosd in the service mode and then send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service:

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{fault-configuration}'
```

For the `fault-configuration` part in the above command, you need to configure it according to the fault types. For the corresponding parameters and examples, refer to the parameters of each fault type in the following sections.

:::note

When running an experiment, remember to record the UID of the experiment. When you want to end the experiment corresponding to the UID, you need to send a `DELETE` HTTP request to the `/api/attack/{uid}` path of the Chaosd service.

:::

## Simulate network corruption

### Parameters for simulating network corruption

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"corrupt"` |
| `correlation` | c | `correlation` | The correlation between the percentage of current corrupt occurrence and the previous occurrence. | string | It is a percentage ranging from 0 to 100 (10 is 10%) (`"0"` by default). |
| `device` | d | `device` | Name of the impacted network interface card. | string | Such as `"eth0"`, required. |
| `egress-port` | e | `egress-port` | The egress traffic that only impacts specific destination ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to separate the specific port or to indicate the range of the port, such as `"80,8001:8010"`. |
| `hostname` | H | `hostname` | The host name impacted by traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"chaos-mesh.org"`. |
| `ip` | i | `ip-address` | The IP address impacted by egress traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"123.123.123.123"`. |
| `protocol` | p | `ip-protocol` | The IP protocol impacted by traffic. | string | Supported protocols: tcp, udp, icmp, all (all network protocols). |
| `source-port` | s | `source-port` | The egress traffic which only impact specific source ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to delimit the specific port or to indicate the range of the ports, such as `"80,8001:8010"`. |
| `percent` | — | `percent` | Ratio of network packet corruption. | string | It is a percentage which range is 0 to 100 (10 is 10%) (default `"1"`). |

### Simulate network corruption using the command-line mode

To see the configuration of simulated network corruption using Chaosd, run the following command:

```bash
chaosd attack network corrupt --help
```

Run the following command to simulate network corruption:

```bash
chaosd attack network corrupt -d eth0 -i 172.16.4.4 --percent 50
```

### Simulate network corruption using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"corrupt","device":"eth0","ip-address":"172.16.4.4","percent":"50"}'
```

## Simulate network latency

### Parameters for simulating network latency

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"delay"` |
| `correlation` | c | `correlation` | The correlation between the current latency and the previous one. | string | It is a percentage ranging from 0 to 100 (10 is 10%) (`"0"` by default). |
| `device` | d | `device` | Name of the impacted network interface card. | string | Such as `"eth0"`, required. |
| `egress-port` | e | `egress-port` | The egress traffic which only impact specific destination ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to separate the specific port or to indicate the range of the port, such as `"80,8001:8010"`. |
| `hostname` | H | `hostname` | The host name impacted by traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"chaos-mesh.org"`. |
| `ip` | i | `ip-address` | The IP address impacted by egress traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"123.123.123.123"`. |
| `jitter` | j | `jitter` | Range of the length of network delay time. | string | The time units can be: ns, us (µs), ms, s, m, h, such as `"1ms"`. |
| `latency` | l | `latency` | Length of network delay time. | string | The time units can be: ns, us (µs), ms, s, m, h, such as `"1ms"`. |
| `protocol` | p | `ip-protocol` | The IP protocol impacted by traffic. | string | Supported protocols: tcp, udp, icmp, all (all network protocols). |
| `source-port` | s | `source-port` | The egress traffic that only impacts specified source ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to separate the specific port or to indicate the range of the port, such as `"80,8001:8010"`. |

### Simulate network latency using the command-line mode

To see the configuration of simulated network latency using Chaosd, run the following command:

```bash
chaosd attack network delay --help
```

Run the following command to simulate network latency:

```bash
chaosd attack network delay -d eth0 -i 172.16.4.4 -l 10ms
```

### Simulate network latency using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"delay","device":"eth0","ip-address":"172.16.4.4","latency":"10ms"}'
```

## Simulate network duplication

### Parameters for simulating network duplication

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"duplicate"` |
| `correlation` | c | `correlation` | The correlation between the percentage of current duplication occurrence and the previous one. | string | It is a percentage which range is 0 to 100 (10 is 10%) (default `"0"`). |
| `device` | d | `device` | Name of the impacted network interface card. | string | Such as `"eth0"`, required. |
| `egress-port` | e | `egress-port` | The egress traffic that only impacts specified destination ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to separate the specific port or to indicate the range of the port, such as `"80,8001:8010"`. |
| `hostname` | H | `hostname` | The host name impacted by traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"chaos-mesh.org"`. |
| `ip` | i | `ip-address` | The IP address impacted by egress traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"123.123.123.123"`. |
| `percent` | — | `percent` | Ratio of network packet duplicate. | string | It is a percentage which range is 0 to 100 (10 is 10%) (default `"1"`). |
| `protocol` | p | `ip-protocol` | The IP protocol impacted by traffic. | string | Supported protocols: tcp, udp, icmp, all (all network protocols). |
| `source-port` | s | `source-port` | The egress traffic which only impact specific source ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to separate the specific port or to indicate the range of the ports, such as `"80,8001:8010"`. |

### Simulate network duplication using the command-line mode

To see the configuration of simulated network duplication using Chaosd, run the following command:

```bash
chaosd attack network duplicate --help
```

Run the following command to simulate network duplication:

```bash
chaosd attack network duplicate -d eth0 -i 172.16.4.4 --percent 50
```

### Simulate network duplication using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"duplicate","ip-address":"172.16.4.4","device":"eth0","percent":"50"}'
```

## Simulate network loss

### Parameters for simulating network loss

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"loss"` |
| `correlation` | c | `correlation` | The correlation between the percentage of the current network loss and the previous one. | string | It is a percentage which range is 0 to 100 (10 is 10%) (default `"0"`). |
| `device` | d | `device` | Name of the impacted network interface card. | string | Such as `"eth0"`, required. |
| `egress-port` | e | `egress-port` | The egress traffic that only impacts specified destination ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to separate the specific port or to indicate the range of the port, such as `"80,8001:8010"`. |
| `hostname` | H | `hostname` | The host name impacted by traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"chaos-mesh.org"`. |
| `ip` | i | `ip-address` | The IP address impacted by egress traffic. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"123.123.123.123"`. |
| `percent` | — | `percent` | Ratio of network packet loss. | string | It is a percentage which range is 0 to 100 (10 is 10%) (default `"1"`). |
| `protocol` | p | `ip-protocol` | Only impact traffic using this IP protocol. | string | Supported protocols: tcp, udp, icmp, all (all network protocols). |
| `source-port` | s | `source-port` | The egress traffic which only impact specific source ports. It can only be configured when the protocol is TCP or UDP. | string | Use a `,` to separate the specific port or to indicate the range of the port, such as `"80,8001:8010"`. |

### Simulate network loss using the command-line mode

To see the configuration of simulated network loss using Chaosd, run the following command:

```bash
chaosd attack network loss --help
```

Run the following command to simulate network loss:

```bash
chaosd attack network loss -d eth0 -i 172.16.4.4 --percent 50
```

### Simulate network loss using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"loss","ip-address":"172.16.4.4","device":"eth0","percent":"50"}'
```

## Simulate network partition

### Parameters for simulating network partition

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"partition"` |
| `accept-tcp-flags` | — | `accept-tcp-flags` | Only the packet which match the tcp flag can be accepted, others will be dropped. Only set when the protocol is tcp. | string | Such as `"SYN,ACK SYN,ACK"` |
| `device` | d | `device` | The network interface to impact | string | Such as `"eth0"`, required |
| `direction` | — | `direction` | Specifies the partition direction, values can be 'to', 'from' or 'both'. 'from' means packets coming from the 'ip-address' or 'hostname' and going to your server, 'to' means packets originating from your server and going to the 'ip-address' or 'hostname'. | string | Values can be `"to"`, `"from"` or `"both"` (default `"both"`) |
| `hostname` | H | `hostname` | Only impact traffic to these hostnames. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"chaos-mesh.org"`. |
| `ip` | i | `ip-address` | Only impact egress traffic to these IP addresses. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"192.168.123.123"`. |
| `protocol` | p | `ip-protocol` | Only impact traffic using this IP protocol | string | Supported protocols: tcp, udp, icmp, all (all network protocols). |

### Simulate network partition using the command-line mode

To see the configuration of simulated network partition using Chaosd, run the following command:

```bash
chaosd attack network partition --help
```

Run the following command to simulate network partition:

```bash
chaosd attack network partition -i 172.16.4.4 -d eth0 --direction from
```

### Simulate network partition using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"partition","ip-address":"172.16.4.4","device":"eth0","direction":"from"}'
```

## Simulate DNS fault

### Parameters for simulating DNS fault

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"dns"` |
| `dns-domain-name` | d | `dns-domain-name` | Map this host to specified IP (dns-ip) | string | Such as `"chaos-mesh.org"`. |
| `dns-ip` | i | `dns-ip` | Map specified host (dns-domain-name) to this IP address | string | Such as `"123.123.123.123"` |
| `dns-server` | — | `dns-server` | Update the DNS server in /etc/resolv.conf with this value | string | Default value is `"123.123.123.123"` |

### Simulate DNS fault using the command-line mode

To see the configuration of simulated DNS fault using Chaosd, run the following command:

```bash
chaosd attack network dns --help
```

Run the following command to simulate DNS fault by mapping specified host to specified IP:

```bash
chaosd attack network dns --dns-ip 123.123.123.123 --dns-domain-name chaos-mesh.org
```

Run the following command to simulate DNS fault by using wrong DNS server:

```bash
chaosd attack network dns --dns-server 123.123.123.123
```

### Simulate DNS fault using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"dns","dns-domain-name":"chaos-mesh.org","dns-ip":"123.123.123.123"}'
```

## Simulate network bandwidth

### Parameters for simulating network bandwidth

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"bandwidth"` |
| `buffer` | b | `buffer` | The maximum amount of bytes that tokens can be available for instantaneously | uint32 | Such as `10000`, required |
| `device` | d | `device` | The network interface to impact | string | Such as `"eth0"`, required |
| `hostname` | H | `hostname` | Only impact traffic to these hostnames. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"chaos-mesh.org"`. |
| `ip` | i | `ip-address` | Only impact egress traffic to these IP addresses. `hostname` and `ip-address` cannot be empty at the same time. When `hostname` and `ip-address` are set at the same time, the configuration item affects both the specified `hostname` and `ip-address`. | string | Such as `"123.123.123.123"`. |
| `limit` | l | `limit` | The number of bytes that can be queued waiting for tokens to become available | uint32 | Such as `10000`, required |
| `minburst` | m | `minburst` | Specifies the size of the peakrate bucket | uint32 | Such as `10000` |
| `peakrate` | — | `peakrate` | The maximum depletion rate of the bucket | uint64 | Such as `10000` |
| `rate` | r | `rate` | The speed knob, allows bps, kbps, mbps, gbps, tbps unit. The bps unit means bytes per second. | string | Such as `"1mbps"`, required |

### Simulate network bandwidth using the command-line mode

To see the configuration of simulated network bandwidth using Chaosd, run the following command:

```bash
chaosd attack network bandwidth --help
```

Run the following command to simulate network bandwidth:

```bash
chaosd attack network bandwidth --buffer 10000 --device eth0 --limit 10000 --rate 10mbps
```

### Simulate network bandwidth using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"bandwidth","buffer":10000,"limit":10000,"rate":"10mbps","device":"eth0"}'
```

## Simulate port occupation

### Parameters for simulating port occupation

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Action of the experiment. | string | Set to `"occupied"` |
| `port` | p | `port` | The specified port to be occupied | int | Such as `8080`, required |

### Simulate port occupation using the command-line mode

To see the configuration of simulated port occupation, run the following command:

```bash
chaosd attack network port --help
```

Run the following command to simulate port occupation:

```bash
chaosd attack network port --port 8080
```

### Simulate port occupation using the service mode

Send a `POST` HTTP request to the `/api/attack/network` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/network -H "Content-Type:application/json" -d '{"action":"occupied","port":8080}'
```
