---
title: Chaosd Introduction
---

## Chaosd Introduction

[Chaosd](https://github.com/chaos-mesh/chaosd) injects faults into Linux hosts through a command-line tool or an HTTP service. It records experiments and recovery data in SQLite so that you can inspect experiments and recover supported faults.

:::note Chaosd version

This page describes **Chaosd v1.5.0**. Chaosd is released separately from Chaos Mesh. The website's version selector refers to Chaos Mesh, not Chaosd. See the [v1.5.0 release notes](https://github.com/chaos-mesh/chaosd/releases/tag/v1.5.0) for the changes in this release.

:::

### Supported fault types

The CLI supports the following fault types. Run `chaosd attack <command> --help` for available actions and flags.

| Command | Faults |
| :-- | :-- |
| `process` | Stop or kill processes. |
| `network` | Delay, loss, corruption, duplication, partition, DNS, bandwidth, port occupation, flood, and interface failure. |
| `stress` | CPU and memory pressure. |
| `disk` | Read load, write load, and disk fill. |
| `host` | Shutdown and reboot. |
| `jvm` | Method latency, return values, exceptions, stress, garbage collection, and Byteman rules. |
| `clock` | Time offsets in a target process. |
| `kafka` | Disk fill, message flood, and broker I/O faults. |
| `redis` | Sentinel faults and cache faults. |
| `file` | Create, modify, delete, rename, append, and replace file contents. |
| `http` | Abort or delay HTTP traffic, apply proxy configuration, and send requests. |
| `vm` | Stop a virtual machine through libvirt. |
| `user-defined` | Run custom attack and recovery commands. |

Host and file faults are available through the CLI only. For the other fault types, the HTTP service accepts `POST /api/attack/<kind>`. The custom command endpoint uses `user_defined`. HTTP requests use JSON configuration fields, which can differ from CLI flag names.

### Operating environment

The Chaosd v1.5.0 prebuilt archives support Linux **amd64** and **arm64**, and require **glibc 2.34 or later**. Older archives retain their original requirements. When building from source, runtime requirements depend on the libraries in the build environment.

Clock injection is unsupported on arm64. Other runtime tools depend on the selected fault. For example, network faults use tools such as `tc`, `ipset`, and `iptables`; CPU stress uses `stress-ng`, and memory stress uses `memStress`. Run experiments with the privileges required by the target operation, often root or Linux capabilities.

### Download and deploy

1. Select Chaosd v1.5.0 and the architecture of the Linux host. Use `amd64` for x86-64 or `arm64` for AArch64.

   ```bash
   export CHAOSD_VERSION=v1.5.0
   export CHAOSD_ARCH=amd64
   ```

   To view other released versions, see [Chaosd releases](https://github.com/chaos-mesh/chaosd/releases). The `latest` archive follows development builds and is not a stable release.

2. Download the archive:

   ```bash
   curl -fsSLO "https://mirrors.chaos-mesh.org/chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}.tar.gz"
   ```

3. Extract the archive and move the entire directory, including `tools`, to `/usr/local`:

   ```bash
   tar -xzf "chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}.tar.gz"
   sudo mv "chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}" /usr/local/
   ```

4. Add the directory to `PATH` and check the installed version:

   ```bash
   export PATH="/usr/local/chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}:$PATH"
   chaosd version
   ```

Keep the `tools` directory beside the `chaosd` executable. Chaosd adds the bundled tools to its search path and uses the bundled Byteman unless `BYTEMAN_HOME` is set.

### Work modes

- Command-line mode: Run `chaosd attack <command>` to create an experiment and `chaosd recover <UID>` to recover a supported fault.
- Service mode: Run Chaosd in the background and send HTTP requests to create or recover experiments. See [Deploy Chaosd server](simulate-physical-machine-chaos.md#deploy-chaosd-server) for TLS configuration when connecting from Chaos Mesh.

For local use, start the service on the loopback address:

```bash
chaosd server --host 127.0.0.1 --port 31767
```

The default bind address is `0.0.0.0`. Plain HTTP has no authentication. Use TLS with client certificate verification when exposing the service to Chaos Mesh.

Chaosd stores `chaosd.dat` beside its executable. That directory must be writable by the account running stateful commands. Preserve the database and fault-created backups until recovery is complete. Moving the executable changes the database and helper locations. See [Search and recover experiments](chaosd-search-recover.md) for recovery limits and scheduled experiments.
