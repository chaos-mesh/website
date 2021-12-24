---
title: Simulate Network Faults
---

This document describes how to simulate network faults using NetworkChaos in Chaos Mesh.

## NetworkChaos introduction

NetworkChaos is a fault type in Chaos Mesh. By creating a NetworkChaos experiment, you can simulate a network fault scenario for a cluster. Currently, NetworkChaos supports the following fault types:

- **Partition**: network disconnection and partition.
- **Net Emulation**: poor network conditions, such as high delays, high packet loss rate, packet reordering, and so on.
- **Bandwidth**: limit the communication bandwidth between nodes.

## Notes

Before creating NetworkChaos experiments, ensure the following:

1. During the network injection process, make sure that the connection between Controller Manager and Chaos Daemon works, otherwise the NetworkChaos cannot be restored anymore.
2. If you want to simulate Net Emulation fault, make sure the NET_SCH_NETEM module is installed in the Linux kernel. If you are using CentOS, you can install the module through the kernel-modules-extra package. Most other Linux distributions have installed the module already by default.

## Create experiments using Chaos Dashboard

1. Open Chaos Dashboard, and click **NEW EXPERIMENT** on the page to create a new experiment:

   ![Create Experiment](./img/create-new-exp.png)

2. In the **Choose a Target** area, choose **NETWORK ATTACK** and select a specific behavior, such as **LOSS**. Then fill out specific configuration.

   ![NetworkChaos Experiments](./img/networkchaos-exp.png)

   For details of specific configuration fields, refer to [Field description](#field description).

3. Fill out the experiment information, and specify the experiment scope and the scheduled experiment duration.

   ![Experiment Information](./img/exp-info.png)

4. Submit the experiment information.

## Create experiments using the YAML files

### Net emulation example

1. Write the experiment configuration to the `network-delay.yaml` file, as shown below:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: NetworkChaos
   metadata:
     name: delay
   spec:
     action: delay
     mode: one
     selector:
       namespaces:
         - default
       labelSelectors:
         'app': 'web-show'
     delay:
       latency: '10ms'
       correlation: '100'
       jitter: '0ms'
   ```

   This configuration causes a latency of 10 milliseconds in the network connections of the target Pods. In addition to latency injection, Chaos Mesh supports packet loss and packet reordering injection. For details, see [field description](#field-description).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

   ```bash
   kubectl apply -f ./network-delay.yaml
   ```

### Partition example

1. Write the experiment configuration to the `network-partition.yaml` file, as shown below:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: NetworkChaos
   metadata:
     name: partition
   spec:
     action: partition
     mode: all
     selector:
       namespaces:
         - default
       labelSelectors:
         'app': 'app1'
     direction: to
     target:
       mode: all
       selector:
         namespaces:
           - default
         labelSelectors:
           'app': 'app2'
   ```

   This configuration blocks the connection created from `app1` to `app2`. The value for the `direction` field can be `to`, `from` or `both`. For details, refer to [Field description](#field-description).

2. After the configuration file is prepared, use `kubectl` to create the experiment:

   ```bash
   kubectl apply -f ./network-partition.yaml
   ```

### Bandwidth example

1. Write the experiment configuration to the `network-bandwidth.yaml` file, as shown below:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: NetworkChaos
   metadata:
     name: bandwidth
   spec:
     action: bandwidth
     mode: all
     selector:
       namespaces:
         - default
       labelSelectors:
         'app': 'app1'
     bandwidth:
       rate: '1mbps'
       limit: 100
       buffer: 10000
   ```

   This configuration limits the bandwidth of `app1` to 1 mbps.

2. After the configuration file is prepared, use `kubectl` to create the experiment:

   ```bash
   kubectl apply -f ./network-bandwidth.yaml
   ```

## Field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| action | string | Indicates the specific fault type. Available types include: `netem`, `delay` (network delay), `loss` (packet loss), `duplicate` (packet duplicating), `corrupt` (packet corrupt), `partition` (network partition), and `bandwidth` (network bandwidth limit).After you specify `action` field, refer to [Description for `action`-related fields](#description-for-action-related-fields) for other necessary field configuration. | None | Yes | Partition |
| target | Selector | Used in combination with direction, making Chaos only effective for some packets. | None | No |  |
| direction | enum | Indicates the direction of `target` packets. Available vaules include `from` (the packets from `target`), `to` (the packets to `target`), and `both` ( the packets from or to `target`). This parameter makes Chaos only take effect for a specific direction of packets. | to | No | both |
| mode | string | Specifies the mode of the experiment. The mode options include `one` (selecting a random Pod), `all` (selecting all eligible Pods), `fixed` (selecting a specified number of eligible Pods), `fixed-percent` (selecting a specified percentage of Pods from the eligible Pods), and `random-max-percent` (selecting the maximum percentage of Pods from the eligible Pods). | None | Yes | `one` |
| value | string | Provides a parameter for the `mode` configuration, depending on `mode`. For example, when `mode` is set to `fixed-percent`, `value` specifies the percentage of Pods. | None | No | 1 |
| containerNames | []string | Specifies the name of the container into which the fault is injected. | None | No | ["nginx"] |
| selector | struct | Specifies the target Pod. For details, refer to [Define the experiment scope](./define-chaos-experiment-scope.md). | None | Yes |  |
| externalTargets | []string | Indicates the network targets except for Kubernetes, which can be IPv4 addresses or domains. This parameter only works with `direction: to`. | None | No | 1.1.1.1, www.google.com |
| device | string | Specifies the affected network interface | None | No | "eth0" |

### Description for `action`-related fields

For the Net Emulation and Bandwidth fault types, you can further configure the `action` related parameters according to the following description.

- Net Emulation type: `delay`, `loss`, `duplicated`, `corrupt`
- Bandwidth type: `bandwidth`

#### delay

Setting `action` to `delay` means simulating network delay fault. You can also configure the following parameters.

| Parameter | Type | Description | Required | Required | Example |
| --- | --- | --- | --- | --- | --- |
| latency | string | Indicates the network latency | No | No | 2ms |
| correlation | string | Indicates the correlation between the current latency and the previous one. Range of value: [0, 100] | No | No | 50 |
| jitter | string | Indicates the range of the network latency | No | No | 1ms |
| reorder | Reorder(#Reorder) | Indicates the status of network packet reordering |  | No |  |

The computational model for `correlation` is as follows:

1. Generate a random number whose distribution is related to the previous value:

   ```c
   rnd = value * (1-corr) + last_rnd * corr
   ```

   `rnd` is the random number. `corr` is the `correlation` you fill out before.

2. Use this random number to determine the delay of the current packet:

   ```c
   ((rnd % (2 * sigma)) + mu) - sigma
   ```

   In the above command, `sigma` is `jitter` and `mu` is `latency`.

#### reorder

Setting `action` to `reorder` means simulating network packet reordering fault. You can also configure the following parameters.

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| reorder | string | Indicates the probability to reorder | 0 | No | 0.5 |
| correlation | string | Indicates the correlation between this time's length of delay time and the previous time's length of delay time. Range of value: [0, 100] | 0 | No | 50 |
| gap | int | Indicates the gap before and after packet reordering | 0 | No | 5 |

#### loss

Setting `action` to `loss` means simulating packet loss fault. You can also configure the following parameters.

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| loss | string | Indicates the probability of packet loss. Range of value: [0, 100] | 0 | No | 50 |
| correlation | string | Indicates the correlation between the probability of current packet loss and the previous time's packet loss. Range of value: [0, 100] | 0 | No | 50 |

#### duplicate

Set `action` to `duplicate`, meaning simulating package duplication. At this point, you can also set the following parameters.

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| duplicate | string | Indicates the probability of packet duplicating. Range of value: [0, 100] | 0 | No | 50 |
| correlation | string | Indicates the correlation between the probability of current packet duplicating and the previous time's packet duplicating. Range of value: [0, 100] | 0 | No | 50 |

#### corrupt

Setting `action` to `corrupt` means simulating package corruption fault. You can also configure the following parameters.

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| corrupt | string | Indicates the probability of packet corruption. Range of value: [0, 100] | 0 | No | 50 |
| correlation | string | Indicates the correlation between the probability of current packet corruption and the previous time's packet corruption. Range of value: [0, 100] | 0 | No | 50 |

For occasional events such as `reorder`, `loss`, `duplicate`, and `corrupt`, the `correlation` is more complicated. For specific model description, refer to [NetemCLG](http://web.archive.org/web/20200120162102/http://netgroup.uniroma2.it/twiki/bin/view.cgi/Main/NetemCLG).

#### bandwidth

Setting `action` to `bandwidth` means simulating bandwidth limit fault. You also need to configure the following parameters.

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| rate | string | Indicates the rate of bandwidth limit |  | Yes | 1mbps |
| limit | string | Indicates the number of bytes waiting in queue |  | Yes | 1 |
| buffer | uint32 | Indicates the maximum number of bytes that can be sent instantaneously |  | Yes | 1 |
| peakrate | uint64 | Indicates the maximum consumption of `bucket` (usually not set) |  | No | 1 |
| minburst | uint32 | Indicates the size of `peakrate bucket` (usually not set) |  | No | 1 |

For more details of these fields, you can refer to [tc-tbf document](https://man7.org/linux/man-pages/man8/tc-tbf.8.html).
