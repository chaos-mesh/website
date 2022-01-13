---
title: Chaosd 组件简介
---

## Chaosd 组件简介

[Chaosd](https://github.com/chaos-mesh/chaosd) 是 Chaos Mesh 提供的一款混沌工程测试工具（需要单独[下载和部署](#下载和部署)），用于在物理机环境上注入故障，并提供故障恢复功能。

Chaosd 具有以下核心优势：

- 易用性强：输入简单的 Chaosd 命令即可创建混沌实验，并对实验进行管理。
- 故障类型丰富：在物理机的不同层次、不同类型上都提供了故障注入的功能，包括进程、网络、压力、磁盘、主机等，且更多的功能在不断扩展中。
- 支持多种模式：Chaosd 既可作为命令行工具使用，也可以作为服务使用，满足不同场景的使用需求。

### 支持故障类型

你可以使用 Chaosd 模拟以下故障类型：

- 进程：对进程进行故障注入，支持进程的 kill、stop 等操作。
- 网络：对物理机的网络进行故障注入，支持增加网络延迟、丢包、损坏包等操作。
- 压力：对物理机的 CPU 或内存注入压力。
- 磁盘：对物理机的磁盘进行故障注入，支持增加读写磁盘负载、填充磁盘等操作。
- 主机：对物理机本身进行故障注入，支持关机等操作。

对于每种故障类型的详细介绍和使用方式，请参考对应的说明文档。

### 运行环境

glibc 必须为 2.17 及以上版本。

### 下载和部署

1. 将要下载的 Chaosd 版本设置为环境变量，例如 v1.0.0：

   ```bash
   export CHAOSD_VERSION=v1.0.0
   ```

   如果要查看所有已发布的 Chaosd 版本，请参阅 [releases](https://github.com/chaos-mesh/chaosd/releases) 。

   如果要下载最新的非稳定版本，则使用 `latest`：

   ```bash
   export CHAOSD_VERSION=latest
   ```

2. 下载 Chaosd：

   ```bash
   curl -fsSL -o chaosd-$CHAOSD_VERSION-linux-amd64.tar.gz https://mirrors.chaos-mesh.org/chaosd-$CHAOSD_VERSION-linux-amd64.tar.gz
   ```

3. 解压 Chaosd 文件并转移到 /usr/local 目录下：

   ```bash
   tar zxvf chaosd-$CHAOSD_VERSION-linux-amd64.tar.gz && sudo mv chaosd-$CHAOSD_VERSION-linux-amd64 /usr/local/
   ```

4. 将 Chaosd 目录加到环境变量 `PATH` 中：

   ```bash
   export PATH=/usr/local/chaosd-$CHAOSD_VERSION-linux-amd64:$PATH
   ```

### 运行模式

你可以通过以下模式使用 Chaosd：

- 命令行模式：将 Chaosd 作为命令行工具，直接运行即可注入故障、恢复故障。
- 服务模式：将 Chaosd 作为服务运行在后台，通过发送 HTTP 请求来注入故障、恢复故障。
