---
title: 模拟主机故障
---

本文介绍如何通过 Chaosd 的命令行或 HTTP 服务，对 Linux 主机执行关机或重启操作。

:::warning

主机故障会影响整台主机，包括 Chaosd 服务和远程连接。运行 Chaosd 时需要具备关机或重启权限，通常使用 root 用户。

Chaosd 无法恢复关机和重启操作。`chaosd recover <UID>` 和 `DELETE /api/attack/{uid}` 都不能撤销这些操作。设置 `duration` 也不会自动开机或撤销重启。测试关机前，请先安排好重新开机的方式。

:::

## 使用命令行创建主机故障

查看支持的主机操作及其帮助信息：

```bash
chaosd attack host --help
chaosd attack host shutdown --help
chaosd attack host reboot --help
```

### 主机关机

```bash
chaosd attack host shutdown
```

Chaosd 会调用系统的 `shutdown` 命令，具体关机时间取决于该命令在主机上的行为。

### 主机重启

```bash
chaosd attack host reboot
```

Chaosd 会调用系统的 `reboot` 命令。

## 使用 HTTP 服务创建主机故障

:::note

主机 HTTP 接口从 **Chaosd v1.6.0** 开始提供。Chaosd v1.5.0 不提供此接口。

主机故障可直接通过 Chaosd 创建。Chaos Mesh 的 `PhysicalMachineChaos` 目前不提供关机或重启操作。

:::

在需要注入故障的主机上启动 Chaosd：

```bash
chaosd server --host 127.0.0.1 --port 31767
```

以下示例从同一台主机发送请求。如需远程访问，请参阅[运行 Chaosd Server](simulate-physical-machine-chaos.md#运行-chaosd-server)，配置 TLS 和客户端证书。

向 `/api/attack/host` 发送 `POST` 请求，使用 JSON 请求体。`action` 为必填字段，取值为 `shutdown` 或 `reboot`。`uid` 为可选的实验标识，省略时由 Chaosd 自动生成。无需指定 `kind`。

### 主机关机

```bash
curl -X POST 'http://127.0.0.1:31767/api/attack/host' \
  -H 'Content-Type: application/json' \
  -d '{"action":"shutdown"}'
```

### 主机重启

```bash
curl -X POST 'http://127.0.0.1:31767/api/attack/host' \
  -H 'Content-Type: application/json' \
  -d '{"action":"reboot"}'
```

主机关机或重启时，连接可能在收到 HTTP 响应之前断开。
