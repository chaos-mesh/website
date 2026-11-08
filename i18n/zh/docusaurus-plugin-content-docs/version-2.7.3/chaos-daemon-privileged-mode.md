---
title: 为什么 Chaos Daemon 以特权模式运行
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

当你使用 Helm 安装 Chaos Mesh 时，Chaos Daemon 默认以特权（privileged）DaemonSet 的方式运行，该行为由 `chaosDaemon.privileged` Helm 值控制，大多数情况下应保持开启。本文档介绍 Chaos Daemon 使用这些权限做了什么、什么情况下可以关闭特权模式，以及需要遵循哪些安全实践。

## Chaos Daemon 是什么

Chaos Daemon 是 Chaos Mesh 的执行组件，以 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 的方式运行在符合调度条件的节点上。对于需要访问节点的故障，Chaos Controller Manager 通过 gRPC 向受影响节点上的 Chaos Daemon 发送请求。

Helm chart 默认对 Chaos Controller Manager 与 Chaos Daemon 之间的 gRPC 连接启用 mTLS。使用默认配置安装时，chart 会生成客户端和服务端证书。

关于 Chaos Mesh 的整体架构，参见 [Chaos Mesh 简介](overview.md)。

## 为什么需要特权权限

Chaos Daemon 从节点侧注入故障。它进入目标容器的 Linux 命名空间，访问节点的容器运行时，或操作块设备等宿主机资源。这些操作需要普通应用容器通常不具备的权限。

下表举例说明不同实验中的节点侧操作。

| 实验类型 | Chaos Daemon 做了什么 | 需要的访问权限 |
| --- | --- | --- |
| NetworkChaos | Chaos Daemon 根据故障动作，在目标网络命名空间中使用 `tc`、ipset 或 iptables。 | 进入目标网络命名空间需要 `CAP_SYS_ADMIN`。修改防火墙规则等网络配置需要 `CAP_NET_ADMIN`。 |
| DNSChaos | 修改目标容器的 `/etc/resolv.conf`，使其使用 Chaos DNS Server。 | 进入目标容器的挂载命名空间并修改 DNS 解析配置。 |
| HTTPChaos | 在目标 PID 和网络命名空间中启动 `tproxy`，拦截并修改 HTTP 流量。 | 进入目标命名空间，并将流量重定向到代理。 |
| PodChaos | 执行 `container-kill` 时，Chaos Daemon 请求 Docker 或 containerd 终止容器。使用 CRI-O 时，Chaos Daemon 通过 CRI-O 查询容器 PID，再直接发送 `SIGKILL`。Chaos Controller Manager 通过 Kubernetes API 执行 `pod-kill` 和 `pod-failure`。 | 执行 `container-kill` 时访问容器运行时 socket。使用 CRI-O 时，还需要向目标进程发送信号的权限。 |
| StressChaos | 使用 `stress-ng` 施加 CPU 压力，使用 `memStress` 施加内存压力。 | 启动辅助进程，并将其加入目标容器的 cgroup。 |
| TimeChaos | Chaos Daemon 修改目标进程的 vDSO 时钟函数，使其时钟产生偏移。 | 通过 `ptrace` 附加到目标进程并写入其内存。`CAP_SYS_PTRACE` 允许 Chaos Daemon 跟踪原本无权跟踪的进程。 |
| IOChaos | 在目标 Pod 内运行 `toda` FUSE daemon，拦截注入卷上的 I/O。 | 进入目标 Pod 的挂载 Namespace 并在其中挂载 FUSE 文件系统属于特权操作。 |
| BlockChaos | 通过 chaos-driver 内核模块配置卷对应块设备的 I/O elevator。 | 操作节点上的块设备属于特权操作。 |
| JVMChaos | 进入目标容器，向其中复制 Byteman agent，并将该 agent attach 到目标 JVM 进程。 | 进入目标容器的 Namespace 并操作其中的进程属于特权操作。 |
| KernelChaos | 向 Chaos Controller Manager 提供目标容器的 PID，再由 Controller Manager 调用 `bpfki` sidecar 注入内核故障。 | `bpfki` sidecar 需要节点权限来加载 eBPF 程序。 |

特权模式会授予容器全部 Linux capabilities，并放开 seccomp、AppArmor 和 SELinux 对该容器施加的限制。以 Docker 上的 IOChaos 为例，挂载 FUSE 文件系统既需要 `CAP_SYS_ADMIN`，也需要访问 `/dev/fuse`。如果宿主机上有 `/dev/fuse`，Docker 特权容器可以访问该设备。关闭特权模式后，Helm chart 默认仍会添加 `CAP_SYS_ADMIN`，但仅凭这项权限无法获得对 `/dev/fuse` 的访问。因此，如果集群策略允许，通常建议保留默认设置。需要关闭时，先在你的运行环境中验证要执行的实验。参见 [Docker 的 FUSE 示例](https://docs.docker.com/engine/containers/run/#runtime-privilege-and-linux-capabilities)和 [Kubernetes 对特权容器的说明](https://kubernetes.io/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)。

## chaosDaemon.privileged 配置项

`chaosDaemon.privileged` 控制 Chaos Daemon 主容器的特权模式，默认为 `true`。

关闭特权模式前，先确认集群策略允许以下配置。

- 设置 `chaosDaemon.privileged=false` 后，Pod 仍然使用 `hostPID: true`，并通过 `hostPath` 挂载容器运行时 socket 所在的目录等宿主机目录。如果安装命名空间强制执行 Baseline 或 Restricted 策略，且 Pod 未获豁免，Pod Security Admission 会拒绝创建该 Pod。
- 下方列出的默认 capabilities 仍包含 `CAP_SYS_ADMIN`，它授予广泛的系统管理权限。
- 如果设置 `bpfki.create=true` 为 KernelChaos 安装 `bpfki` sidecar，该 sidecar 始终以特权模式运行，与 `chaosDaemon.privileged` 的取值无关。Chart 默认关闭该 sidecar。

有关各平台的配置，请参见 [OpenShift 安装 FAQ](faqs.md#在-openshift-中安装-chaos-mesh-时因授权问题导致安装过程被阻止)和 [Pod Security Standards 安装 FAQ](faqs.md#因-pod-security-standardspss限制导致-chaos-mesh-安装失败)。

按容器运行时从 [Helm 安装指南](production-installation-using-helm.mdx#第-4-步在不同环境下安装)中选择命令，再加上 `--set chaosDaemon.privileged=false`。下面以 Docker 为例，使用默认的 `/var/run/docker.sock`。

<PickHelmVersion>{`helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-mesh --set chaosDaemon.privileged=false --version latest`}</PickHelmVersion>

关闭特权模式后，chart 默认会向 Chaos Daemon 主容器添加以下 Linux capabilities。

```yaml
chaosDaemon:
  capabilities:
    add:
      - SYS_PTRACE
      - NET_ADMIN
      - NET_RAW
      - MKNOD
      - SYS_CHROOT
      - SYS_ADMIN
      - KILL
      # CAP_IPC_LOCK is used to lock memory
      - IPC_LOCK
```

## 安全注意事项

Chaos Daemon 可以操作节点资源，并影响节点上的工作负载。请将它视为高权限组件，并遵循以下实践。

- 通过 Kubernetes RBAC 限制可以创建 Chaos 资源（例如 `NetworkChaos`、`Schedule`）的用户。
- 要限制实验目标的选择范围，请启用 `controllerManager.enableFilterNamespace`，并为允许的命名空间添加注解。该功能默认关闭。参见[配置允许混沌实验的命名空间](configure-enabled-namespace.md)。
- 保持 Chaos Controller Manager 与 Chaos Daemon 之间的 mTLS 开启（默认开启），避免 Chaos Daemon 的 gRPC 接口被任意工作负载调用。

## 延伸阅读

- [使用 Helm 安装 Chaos Mesh](production-installation-using-helm.mdx)
- [Chaos Mesh 简介](overview.md)
- [配置允许混沌实验的命名空间](configure-enabled-namespace.md)
