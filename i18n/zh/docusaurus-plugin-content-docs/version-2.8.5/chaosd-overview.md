---
title: Chaosd 组件简介
---

## Chaosd 组件简介

[Chaosd](https://github.com/chaos-mesh/chaosd) 通过命令行工具或 HTTP 服务向 Linux 主机注入故障。它使用 SQLite 保存实验和恢复数据，便于后续查询实验，以及恢复支持恢复的故障。

:::note Chaosd 版本

本文适用于 **Chaosd v1.5.0**。Chaosd 与 Chaos Mesh 独立发布，网站的版本选择器对应 Chaos Mesh 版本，不是 Chaosd 版本。本次发布的改动请参阅 [v1.5.0 发布说明](https://github.com/chaos-mesh/chaosd/releases/tag/v1.5.0)。

:::

### 支持故障类型

命令行支持以下故障类型。运行 `chaosd attack <command> --help` 可查看可用的操作和参数。

| 命令           | 故障                                                                                |
| :------------- | :---------------------------------------------------------------------------------- |
| `process`      | 暂停或终止进程。                                                                    |
| `network`      | 延迟、丢包、损坏包、重复包、网络分区、DNS、带宽限制、端口占用、流量洪泛和网卡故障。 |
| `stress`       | CPU 和内存压力。                                                                    |
| `disk`         | 磁盘读负载、写负载和磁盘填充。                                                      |
| `host`         | 关机和重启。                                                                        |
| `jvm`          | 方法延迟、修改返回值、抛出异常、压力、垃圾回收和 Byteman 规则。                     |
| `clock`        | 目标进程的时间偏移。                                                                |
| `kafka`        | 磁盘填充、消息洪泛和 broker I/O 故障。                                              |
| `redis`        | Sentinel 故障和缓存故障。                                                           |
| `file`         | 创建、修改、删除、重命名、追加和替换文件内容。                                      |
| `http`         | 中断或延迟 HTTP 流量、设置代理和发送请求。                                          |
| `vm`           | 通过 libvirt 停止虚拟机。                                                           |
| `user-defined` | 执行自定义故障注入和恢复命令。                                                      |

主机和文件故障仅支持命令行模式。其他故障类型可通过 HTTP 服务的 `POST /api/attack/<kind>` 创建实验，自定义命令对应的路径使用 `user_defined`。HTTP 请求使用 JSON 配置字段，字段名称可能与命令行参数不同。

### 运行环境

Chaosd v1.5.0 的预编译压缩包支持 Linux **amd64** 和 **arm64**，要求 **glibc 2.34 及以上版本**。旧压缩包保留原有要求。从源码构建时，运行要求取决于构建环境使用的库。

arm64 不支持时间偏移故障。其他运行工具取决于所选故障。例如，网络故障使用 `tc`、`ipset` 和 `iptables` 等工具，CPU 压力使用 `stress-ng`，内存压力使用 `memStress`。运行实验时需要具备目标操作所需的权限，通常为 root 或相应的 Linux capabilities。

### 下载和部署

1. 选择 Chaosd v1.5.0 和 Linux 主机的架构。x86-64 使用 `amd64`，AArch64 使用 `arm64`。

   ```bash
   export CHAOSD_VERSION=v1.5.0
   export CHAOSD_ARCH=amd64
   ```

   其他已发布版本请参阅 [Chaosd releases](https://github.com/chaos-mesh/chaosd/releases)。`latest` 压缩包跟随开发构建，不是稳定版本。

2. 下载压缩包：

   ```bash
   curl -fsSLO "https://mirrors.chaos-mesh.org/chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}.tar.gz"
   ```

3. 解压并将包含 `tools` 的整个目录移动到 `/usr/local`：

   ```bash
   tar -xzf "chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}.tar.gz"
   sudo mv "chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}" /usr/local/
   ```

4. 将目录加入 `PATH`，并检查安装的版本：

   ```bash
   export PATH="/usr/local/chaosd-${CHAOSD_VERSION}-linux-${CHAOSD_ARCH}:$PATH"
   chaosd version
   ```

请保留 `chaosd` 可执行文件旁的 `tools` 目录。Chaosd 会将这些工具加入搜索路径，并在未设置 `BYTEMAN_HOME` 时使用随包提供的 Byteman。

### 运行模式

- 命令行模式：运行 `chaosd attack <command>` 创建实验，运行 `chaosd recover <UID>` 恢复支持恢复的故障。
- 服务模式：在后台运行 Chaosd，通过 HTTP 请求创建或恢复实验。从 Chaos Mesh 连接时的 TLS 配置请参阅[运行 Chaosd Server](simulate-physical-machine-chaos.md#运行-chaosd-server)。

本地使用时，将服务绑定到回环地址：

```bash
chaosd server --host 127.0.0.1 --port 31767
```

默认绑定地址为 `0.0.0.0`。明文 HTTP 不提供身份验证。向 Chaos Mesh 暴露服务时，请使用 TLS 并校验客户端证书。

Chaosd 将 `chaosd.dat` 保存在可执行文件所在的目录中，运行有状态命令的账号需要对该目录具有写权限。恢复完成前，请保留数据库和故障创建的备份文件。移动可执行文件会改变数据库和辅助工具的位置。恢复限制和定时实验的注意事项请参阅[查找和恢复实验](chaosd-search-recover.md)。
