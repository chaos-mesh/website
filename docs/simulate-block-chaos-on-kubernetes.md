---
title: Simulate Block Device Latency
---

## BlockChaos Introduction

Chaos Mesh provides the BlockChaos experiment type. You can use this experiment type to simulate a block device latency scenario. This document describes how to install the dependencies of a BlockChaos experiment, and create a BlockChaos.

:::note

BlockChaos is in a early stage. The installation and configuration experience of it will continue to improve. If you find any issues, please open an issue in [chaos-mesh/chaos-mesh](https://github.com/chaos-mesh/chaos-mesh) to report.

:::

## Install kernel module

BlockChaos depends on the [chaos-driver](https://github.com/chaos-mesh/chaos-driver) kernel module. It can only be injected on a machine with this module installed. For now, you have to manually compile and install the module.

1. Download the source code of this module through:

   ```bash
   curl -fsSL -o chaos-driver-v0.2.1.tar.gz https://github.com/chaos-mesh/chaos-driver/archive/refs/tags/v0.2.1.tar.gz
   ```

2. Uncompress it:

   ```bash
   tar xvf chaos-driver-v0.2.1.tar.gz
   ```

3. Prepare the headers of your current kernel. If you are using CentOS/Fedora, you can install the kernel headers with:

   ```bash
   yum install kernel-devel-$(uname -r)
   ```

   If you are using Ubuntu/Debian, you can install the kernel headers with:

   ```bash
   apt install linux-headers-$(uname -r)
   ```

4. Compile the module:

   ```bash
   cd chaos-driver-v0.2.1
   make driver/chaos_driver.ko
   ```

5. Install the kernel module:
   ```bash
   insmod ./driver/chaos_driver.ko
   ```

This module has to be installed every time after rebooting. If you want the kernel to load this module automatically, you can copy the module to a subdirectory in ` /lib/modules/$(uname -r)/kernel/drivers` and run `depmod -a`, then add `chaos_driver` to the `/etc/modules`.

If you have upgraded the kernel, the module should be recompiled.

:::note

DKMS or akmod is more recommanded for automatic kernel module compiling/loading. If you want to help us improve the installation experience, creating a DKMS or akmod package and submit them to different distributions repositories are very welcomed.

:::

## Create experiments using the YAML file

1. Write the experiment configuration to the YAML configuration file. In the following example, the `block-latency.yaml` file is used.

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: BlockChaos
   metadata:
     name: hostpath-example-delay
   spec:
     selector:
       labelSelectors:
         app: hostpath-example
     mode: all
     volumeName: hostpath-example
     action: delay
     delay:
       latency: 1s
   ```

   :::note Only hostpath or localvolume is supported. :::

2. Use `kubectl` to create an experiment:
   ```bash
   kubectl apply -f block-latency.yaml
   ```

You can find the following magic happened:

1. The elevator of the volume is changed to `ioem` or `ioem-mq`. You can check it through `cat /sys/block/<device>/queue/scheduler`
2. The `ioem` or `ioem-mq` scheduler will receive the latency request and delay the request for the specified time.

The fields in the YAML configuration file are described in the following table:

| Parameter | Type | Note | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| mode | string | Specifies the mode of the experiment. The mode options include `one` (selecting a random Pod), `all` (selecting all eligible Pods), `fixed` (selecting a specified number of eligible Pods), `fixed-percent` (selecting a specified percentage of Pods from the eligible Pods), and `random-max-percent` (selecting the maximum percentage of Pods from the eligible Pods). | None | Yes | `one` |
| value | string | Provides parameters for the `mode` configuration, depending on `mode`.For example, when `mode` is set to `fixed-percent`, `value` specifies the percentage of Pods. | None | No | 1 |
| selector | struct | Specifies the target Pod. For details, refer to [Define the experiment scope](./define-chaos-experiment-scope.md). | None | Yes |  |
| volumeName | string | Specifies the volume to inject in the target pods. There should be a corresponding entry in the pods' `.spec.volumes` | None | Yes | `hostpath-example` |
| delay.latency | string | Specifies the latency of the block device. | None | Yes | `500ms` |
