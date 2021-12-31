---
title: Chaosd Introduction
---

## Chaosd introduction

[Chaosd](https://github.com/chaos-mesh/chaosd) is a Chaos Engineering testing tool provided by Chaos Mesh. You need to download and deploy it separately (see [Download and deploy](#download-and-deploy)). It is used to inject faults into physical machine environments and also recover faults.

Chaosd has the following core strengths:

- Easy-to-use: You only need to execute simple commands in Chaosd to create and manage Chaos experiments.
- Various fault types: Chaosd provides various fault types to be injected into physical machines at different levels, including process, network, pressure, disk, host, etc. More fault types are to be added.
- Multiple work modes: Chaosd can be used both as a command-line tool and as a service to meet the needs of different scenarios.

### Supported fault types

You can use Chaosd to simulate the following fault types:

- Process: Injects faults into the processes. Operations such as killing the process or stopping the process are supported.
- Network: Injects faults into the network of physical machines. Operations such as increasing network latency, losing packets, and corrupting packets are supported.
- Pressure: Injects pressure on the CPU or memory of the physical machines.
- Disk: Injects faults into disks of the physical machines. Operations such as increasing disk load of reads and writes, and filling disks are supported.
- Host: Injects faults into the physical machine. Operations such as shutdown the physical machine are supported.

For details about the introduction and usage of each fault type, refer to the related documentation.

### Operating environment

Your glibc version must be v2.17 or later versions.

### Download and deploy

1. Set the version of Chaosd to be downloaded as the environment variable. For example, v1.0.0:

   ```bash
   export CHAOSD_VERSION=v1.0.0
   ```

   To view all released versions of Chaosd, refer to [releases](https://github.com/chaos-mesh/chaosd/releases).

   To download the latest version (not stable), use `latest`:

   ```bash
   export CHAOSD_VERSION=latest
   ```

2. Download Chaosd:

   ```bash
   curl -fsSL -o chaosd-$CHAOSD_VERSION-linux-amd64.tar.gz https://mirrors.chaos-mesh.org/chaosd-$CHAOSD_VERSION-linux-amd64.tar.gz
   ```

3. Unzip the Chaosd file and move it to the `/usr/local` directory:

   ```bash
   tar zxvf chaosd-$CHAOSD_VERSION-linux-amd64.tar.gz && sudo mv chaosd-$CHAOSD_VERSION-linux-amd64 /usr/local/
   ```

4. Add the Chaosd directory to the `PATH` environment variable:

   ```bash
   export PATH=/usr/local/chaosd-$CHAOSD_VERSION-linux-amd64:$PATH
   ```

### Work modes

You can use Chaosd in the following modes:

- Command-line mode: Run Chaosd directly as a command-line tool to inject and recover faults.
- Service mode: Run Chaosd as a service in the background, to inject and recover faults by sending HTTP requests.
