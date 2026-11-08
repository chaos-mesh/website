---
title: Simulate Faults on Physical Machines
---

This document describes how to create PhysicalMachineChaos (physical machine chaos) experiments in Chaos Mesh to simulate the faults of network, disk, pressure, JVM, time, and others in physical or virtual machines.

## Introduction to PhysicalMachineChaos

You can use PhysicalMachineChaos to simulate the faults of network, disk, pressure, JVM, time, and others in physical or virtual machines. Before using PhysicalMachineChaos provided by Chaos Mesh, you need to deploy Chaosd in your physical or virtual machines. Chaosd is released separately from Chaos Mesh. The following table lists the corresponding Chaosd version for each Chaos Mesh minor version:

| Chaos Mesh version | Chaosd version   |
| :----------------- | :--------------- |
| v2.1.x             | v1.1.x           |
| v2.2.x             | v1.2.x           |
| v2.3.x             | v1.3.x           |
| v2.4.x – v2.7.x    | v1.4.x           |
| v2.8.x and later   | v1.5.x and later |

Some faults require a newer Chaosd version than the corresponding version in the table above:

- `http-*` faults require Chaosd v1.5.0 or later.
- `file-*` faults require Chaosd v1.6.0 or later.
- Kafka authentication requires Chaosd v1.4.0 or later.
- Disk faults are recommended to use Chaosd v1.4.0 or later, which fixes disk attacks used by PhysicalMachineChaos.

If your environment supports it, use the latest stable Chaosd release. Newer releases include fixes and keep the HTTP API used by PhysicalMachineChaos backward compatible. For runtime requirements, such as the glibc version required by prebuilt archives, see [Operating environment](chaosd-overview.md#operating-environment).

For version-specific changes, see [Chaosd releases](https://github.com/chaos-mesh/chaosd/releases).

## Deploy Chaosd server

Before creating PhysicalMachineChaos experiments using Chaos Mesh, you need to deploy Chaosd in service mode to all physical or virtual machines that are going to be injected with faults. After deploying Chaosd, run Chaosd server as follows:

1. Deploy Chaosd, generate a TLS certificate, and create `PhysicalMachine`:

   - For the deployment method of Chaosd, refer to [Download and deploy Chaosd](chaosd-overview.md#download-and-deploy).
   - After deploying Chaosd, **before** starting Chaosd server, you need to generate a TLS certificate and create a `PhysicalMachine` in Kubernetes clusters. For more information on how to generate TLS certificates, refer to [Generate TLS certificates for Chaosd](chaosctl-tool.md).

2. Start Chaosd server:

   - After generating the TLS certificate through Chaosctl, run the following command to start Chaosd in service mode:

     ```bash
     chaosd server --https-port 31768 --CA=/etc/chaosd/pki/ca.crt --cert=/etc/chaosd/pki/chaosd.crt --key=/etc/chaosd/pki/chaosd.key
     ```

     :::note

     The TLS certificates are saved to the default output directory of Chaosctl. If you manually specified another directory when generating certificates, replace the directory in the command line with the corresponding one.

     :::

- If the TLS certificate is not generated through Chaosctl, you can run the following command to start Chaosd in service mode. However, for the security of your clusters, this is **not** recommended.

  ```bash
  chaosd server --port 31767
  ```

## Create experiments using Chaos Dashboard

1. Open Chaos Dashboard, and click **NEW EXPERIMENT** on the page to create a new experiment:

   ![create a new experiment](./img/create-new-exp.png)

2. Click **PHYSIC** in **Experiment Type** and choose a specific type of the experiment, such as **NETWORK ATTACK**. Then, choose a specific behavior and fill out the corresponding configurations:

   ![PhysicalMachineChaos experiment](./img/physicalmachinechaos-exp.png)

3. Fill out the experiment information to specify the range and the planned duration of the experiment:

   ![PhysicalMachineChaos experiment information](./img/physicalmachinechaos-exp-info.png)

4. Submit the experiment.

## Create experiments using a YAML file

1. Write the experimental configurations to the "physicalmachine.yaml" file. For example:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: PhysicalMachineChaos
   metadata:
     name: physical-network-delay
     namespace: chaos-mesh
   spec:
     action: network-delay
     mode: one
     selector:
       namespaces:
         - default
       labelSelectors:
         'arch': 'amd64'
     network-delay:
       device: ens33
       ip-address: 140.82.112.3
       latency: 1000ms
     duration: '10m'
   ```

   The experimental configurations above send HTTP requests to Chaosd service in the specified physical machines or virtual machines to trigger network latency experiments.

2. Create the experiment using `kubectl`. The command is as follows:

   ```bash
   kubectl apply -f physicalmachine.yaml
   ```

### Configuration description

| Configuration item | Type | Description | Default value | Required | Example |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | string | Defines the actions of physical machines faults, optional values are as follows: `stress-cpu`, `stress-mem`, `disk-read-payload`, `disk-write-payload`, `disk-fill`, `network-corrupt`, `network-duplicate`, `network-loss`, `network-delay`, `network-partition`, `network-dns`, `process`, `jvm-exception`, `jvm-gc`, `jvm-latency`, `jvm-return`, `jvm-stress`, `jvm-rule-data`, `clock`, `redis-expiration`, `redis-penetration`, `redis-cacheLimit`, `redis-restart`, `redis-stop`, `kafka-fill`, `kafka-flood`, `kafka-io` | None | Yes | `stress-cpu` |
| `address` | string array | Selects the `address` of Chaosd service to inject faults, only one of `address` or `selector` could be specified | [] | Yes | ["192.168.0.10:31767"] |
| `selector` | struct | Specifies the target PhysicalMachine. For details, refer to [Define the experiment scope](define-chaos-experiment-scope.md), only one of `address` or `selector` could be specified | None | No |  |
| `mode` | string | Specifies the mode of the experiment. The mode options include `one` (selecting a random PhysicalMachine), `all` (selecting all eligible PhysicalMachines), `fixed` (selecting a specified number of eligible PhysicalMachines), `fixed-percent` (selecting a specified percentage of PhysicalMachines from the eligible PhysicalMachines), and `random-max-percent` (selecting the maximum percentage of PhysicalMachines from the eligible PhysicalMachines). | None | Yes | `one` |
| `value` | string | Provides a parameter for the `mode` configuration, depending on `mode`. For example, when `mode` is set to `fixed-percent`, `value` specifies the percentage of PhysicalMachines. | None | No | `1` |
| `duration` | string | Specifies the duration of experiments | None | Yes | `30s` |

Each fault action has its own specific configurations. The following section introduces various fault types and their corresponding configuration methods.

#### CPU stress

To simulate a CPU stress scenario, you need to set the action to "stress-cpu". For the corresponding configurations, refer to [Parameters for simulating CPU stress](simulate-heavy-stress-in-physical-nodes.md#parameters-for-simulating-cpu-stress).

#### Memory stress

To simulate a memory stress scenario, you need to set the action to "stress-mem". For the corresponding configurations, refer to [Parameters for simulating memory stress](simulate-heavy-stress-in-physical-nodes.md#parameters-for-simulating-memory-stress).

#### Disk read load

To simulate a disk read load scenario, you need to set the action to "disk-read-payload". For the corresponding configurations, refer to [Parameters for simulating disk read load](simulate-disk-pressure-in-physical-nodes.md#parameters-for-simulating-disk-read-load).

#### Disk write load

To simulate a disk write load scenario, you need to set the action to "disk-write-payload". For the corresponding configurations, refer to [Parameters for simulating disk write load](simulate-disk-pressure-in-physical-nodes.md#parameters-for-simulating-disk-write-load).

#### Disk fill

To simulate a disk fill scenario, you need to set the action to "disk-fill". For the corresponding configurations, refer to [Parameters for simulating disk fill](simulate-disk-pressure-in-physical-nodes.md#parameters-for-simulating-disk-fill).

:::note[Version support]

In Chaos Mesh 2.8.8 and later, set `disk-fill.fill-by-fallocate` to `true` to use `fallocate`. Set it to `false` or omit it to use `dd`.

:::

#### Network corruption

To simulate a network corruption scenario, you need to set the action to "network-corrupt". For the corresponding configurations, refer to [Parameters for simulating network corruption](simulate-network-chaos-in-physical-nodes.md#parameters-for-simulating-network-corruption).

#### Network latency

To simulate a network latency scenario, you need to set the action to "network-delay". For the corresponding configurations, refer to [Parameters for simulating network latency](simulate-network-chaos-in-physical-nodes.md#parameters-for-simulating-network-latency).

#### Network duplication

To simulate a network duplication scenario, you need to set the action to "network-duplicate". For the corresponding configurations, refer to [Parameters for simulating network duplication](simulate-network-chaos-in-physical-nodes.md#parameters-for-simulating-network-duplication).

#### Network loss

To simulate a network loss scenario, you need to set the action to "network-loss". For the corresponding configurations, refer to [Parameters for simulating network loss](simulate-network-chaos-in-physical-nodes.md#parameters-for-simulating-network-loss).

#### Network partition

To simulate a network partition scenario, you need to set the action to "network-partition". For the corresponding configurations, refer to [Parameters for simulating network partition](simulate-network-chaos-in-physical-nodes.md#parameters-for-simulating-network-partition).

#### DNS fault

To simulate a DNS fault scenario, you need to set the action to "network-dns". For the corresponding configurations, refer to [Parameters for simulating DNS fault](simulate-network-chaos-in-physical-nodes.md#parameters-for-simulating-dns-fault).

#### Process fault

To simulate a process fault scenario, you need to set the action to "process". For the corresponding configurations, refer to [Parameters for killing a process](simulate-process-chaos-in-physical-nodes.md#parameters-for-killing-a-process).

#### Throw custom exceptions for JVM applications

To simulate a scenario that JVM applications throw custom exceptions, you need to set the action to "jvm-exception". For the corresponding configurations, refer to [Parameters for throwing custom exceptions](simulate-jvm-application-chaos-in-physical-nodes.md#parameters-for-throwing-custom-exceptions).

#### Increase method latency for JVM applications

To simulate a scenario that JVM applications increase method latency, you need to set the action to "jvm-latency". For the corresponding configurations, refer to [Parameters for increasing method latency](simulate-jvm-application-chaos-in-physical-nodes.md#parameters-for-increasing-method-latency).

#### Modify return values of methods for JVM applications

To simulate a scenario that JVM applications modify return values of methods, you need to set the action to "jvm-return". For the corresponding configurations, refer to [Parameters for modifying return values of a method](simulate-jvm-application-chaos-in-physical-nodes.md#parameters-for-modifying-return-values-of-a-method).

#### Trigger garbage collection for JVM applications

To simulate a scenario that JVM applications trigger garbage collection, you need to set the action to "jvm-gc". For the corresponding configurations, refer to [Parameters for triggering garbage collection](simulate-jvm-application-chaos-in-physical-nodes.md#parameters-for-triggering-garbage-collection).

#### Trigger faults using Byteman configuration files for JVM applications

To simulate a scenario that JVM applications trigger faults using Byteman configuration files, you need to set the action to "jvm-rule-data". For the corresponding configurations, refer to [Parameters for triggering faults by setting Byteman configuration files](simulate-jvm-application-chaos-in-physical-nodes.md#parameters-for-triggering-faults-by-setting-byteman-configuration-files).

#### Time offset

To simulate a time offset scenario, you need to set the action to "clock". For the corresponding configurations, refer to [Parameters for simulating time faults](simulate-time-chaos-on-physical-nodes.md#parameters-for-simulating-time-faults).

#### Kafka faults

Set `action` to `kafka-fill`, `kafka-flood`, or `kafka-io`. For configuration and a YAML example, see [Simulate Kafka faults](simulate-kafka-chaos-on-physical-nodes.md).

#### Redis faults

Set `action` to `redis-expiration`, `redis-penetration`, `redis-cacheLimit`, `redis-restart`, or `redis-stop`. For the fault parameters, refer to [Simulate Redis faults](simulate-redis-chaos-on-physical-nodes.md#create-experiments-using-chaos-mesh).
