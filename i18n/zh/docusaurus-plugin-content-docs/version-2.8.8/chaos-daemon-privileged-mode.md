---
title: 为什么 Chaos Daemon 以特权模式运行
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

当你使用 Helm 安装 Chaos Mesh 时，Chaos Daemon 默认以特权（privileged）DaemonSet 的方式运行，该行为由 `chaosDaemon.privileged` Helm 值控制，大多数情况下应保持开启。本文档介绍 Chaos Daemon 使用这些权限做了什么、什么情况下可以关闭特权模式，以及需要遵循哪些安全实践。

## Chaos Daemon 是什么

Chaos Daemon 是 Chaos Mesh 的执行组件，以 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 的方式运行在集群的每个节点上。Chaos Controller Manager 监听混沌实验的自定义资源（CR），通过 gRPC 向受影响节点上的 Chaos Daemon 下发注入指令，再由 Chaos Daemon 在节点上执行实际的故障注入。

在 Chaos Mesh 的各个组件中，只有 Chaos Daemon 需要特权权限。Chaos Controller Manager 与 Chaos Daemon 之间的 gRPC 连接由 mTLS 保护，相关证书在安装时自动生成并默认开启。

关于 Chaos Mesh 的整体架构，参见 [Chaos Mesh 简介](overview.md)。

## 为什么需要特权权限

大多数混沌实验并不是在目标 Pod 内部执行的。Chaos Daemon 从节点侧注入故障：进入目标 Pod 的 Namespace、操作节点的容器运行时，或者直接操作节点上的资源（例如块设备）。这些操作只有拥有节点 root 级别权限的进程才能执行。

下表列出了 Chaos Daemon 在各类混沌实验中的实际操作：

| 实验类型 | Chaos Daemon 做了什么 | 为什么需要特权权限 |
| --- | --- | --- |
| NetworkChaos | 进入目标 Pod 的网络 Namespace，在其中配置 `tc`、ipset 和 iptables 规则。 | 进入其他进程的网络 Namespace 需要 `CAP_SYS_ADMIN`；修改其中的网络配置需要 `CAP_NET_ADMIN` 和 `CAP_NET_RAW`。 |
| DNSChaos | 在目标 Pod 的网络 Namespace 中改写 iptables 规则，将 DNS 请求重定向到 Chaos DNS Server。 | 与 NetworkChaos 相同。 |
| HTTPChaos | 在目标 Pod 的网络 Namespace 中运行 `tproxy` 进程，拦截并修改 HTTP 流量。 | 与 NetworkChaos 相同，此外还需要在目标 Pod 内启动进程。 |
| PodChaos | 通过容器运行时（Docker、containerd 或 CRI-O）杀死容器，其 socket 从节点挂载到 Chaos Daemon 中。 | 操作节点上的容器运行时属于特权操作。 |
| StressChaos | 在目标容器的 cgroup 中运行 `stress-ng`。 | 管理其他容器 cgroup 中的进程需要 `CAP_SYS_ADMIN` 和 `CAP_KILL`。 |
| TimeChaos | 修改目标容器内进程的内存，替换其 vDSO 时钟函数，从而偏移时钟。 | 写入其他进程的内存需要 `SYS_PTRACE`。 |
| IOChaos | 在目标 Pod 内运行 `toda` FUSE daemon，拦截注入卷上的 I/O。 | 进入目标 Pod 的挂载 Namespace 并在其中挂载 FUSE 文件系统属于特权操作。 |
| BlockChaos | 通过 chaos-driver 内核模块配置卷对应块设备的 I/O elevator。 | 操作节点上的块设备属于特权操作。 |
| JVMChaos | 进入目标容器，向其中复制 Byteman agent，并将该 agent attach 到目标 JVM 进程。 | 进入目标容器的 Namespace 并操作其中的进程属于特权操作。 |
| KernelChaos | 通过 `bpfki` sidecar 加载 eBPF 程序，在内核函数处注入故障。 | 加载 eBPF 程序需要节点级权限。无论 `chaosDaemon.privileged` 取值如何，`bpfki` sidecar 始终以特权模式运行。 |

这也正是大多数情况下 Chaos Mesh 要求 `chaosDaemon.privileged=true` 的原因：缺少这些权限时，Chaos Daemon 无法进入目标 Pod 的 Namespace，大多数实验会因权限错误而失败。

## chaosDaemon.privileged 配置项

`chaosDaemon.privileged` 控制 Chaos Daemon DaemonSet 的 security context，默认为 `true`。开启时，Chaos Daemon 容器以特权模式运行，容器内的进程基本上等同于宿主机上的 root。

如果集群策略禁止特权容器，可以在安装时关闭特权模式：

<PickHelmVersion>{`helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-mesh --set chaosDaemon.privileged=false --version latest`}</PickHelmVersion>

此时，Chaos Mesh 会改为授予 Chaos Daemon 以下 Linux capabilities，而非完整的特权模式：

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

关闭特权模式前，请注意以下限制：

- capabilities 列表中仍包含 `CAP_SYS_ADMIN`，仅此一项就几乎等价于特权模式。关闭特权模式主要适用于集群策略显式拒绝 `privileged: true` 但允许指定 capabilities 的场景，例如 OPA Gatekeeper 策略。
- 即使是 capabilities 列表也可能被集群策略拒绝。在 OpenShift 上，需要为 `chaos-daemon` 服务账号授予 privileged Security Context Constraints（SCC）；在启用了 Pod Security Standards（PSS）的集群上，需要为 `chaos-mesh` 命名空间设置 `privileged` enforce 标签。具体参见[关于 OpenShift 的安装 FAQ](faqs.md#在-openshift-中安装-chaos-mesh-时因授权问题导致安装过程被阻止)和[关于 PSS 的安装 FAQ](faqs.md#因-pod-security-standardspss限制导致-chaos-mesh-安装失败)。
- KernelChaos 不受该配置影响，其 `bpfki` sidecar 始终以特权模式运行。

## 安全注意事项

由于 Chaos Daemon 内的进程基本上等同于每个节点上的 root，任何能够创建混沌实验的用户，都可以通过 Chaos Daemon 影响 Chaos Mesh 允许注入的命名空间内的任意 Pod 以及众多节点资源。请将 Chaos Mesh 视为高权限工作负载，并遵循以下实践：

- 通过 Kubernetes RBAC 限制可以创建 Chaos 资源（例如 `NetworkChaos`、`Schedule`）的用户。
- 配置 Chaos Mesh 允许影响的命名空间，以限制实验的范围。参见[配置允许混沌实验的命名空间](configure-enabled-namespace.md)。
- 保持 Chaos Controller Manager 与 Chaos Daemon 之间的 mTLS 开启（默认开启），避免 Chaos Daemon 的 gRPC 接口被任意工作负载调用。

## 延伸阅读

- [使用 Helm 安装 Chaos Mesh](production-installation-using-helm.mdx)
- [Chaos Mesh 简介](overview.md)
- [配置允许混沌实验的命名空间](configure-enabled-namespace.md)
