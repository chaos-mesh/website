---
title: Why Chaos Daemon Runs in Privileged Mode
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

When you install Chaos Mesh with Helm, Chaos Daemon runs as a privileged DaemonSet by default. This is controlled by the `chaosDaemon.privileged` Helm value, and in most cases you should keep it enabled. This document explains what Chaos Daemon does with these permissions, when you can turn off privileged mode, and which security practices to follow.

## What Chaos Daemon does

Chaos Daemon is the execution component of Chaos Mesh. It runs as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) on every node of the cluster. Chaos Controller Manager watches the Chaos custom resources (CRs), sends injection instructions over gRPC to the Chaos Daemon on the affected nodes, and Chaos Daemon performs the actual fault injection on those nodes.

Among the components of Chaos Mesh, only Chaos Daemon requires elevated permissions. The gRPC connection between Chaos Controller Manager and Chaos Daemon is protected by mTLS, which is generated and enabled by default during installation.

For the overall architecture of Chaos Mesh, see [Chaos Mesh Overview](overview.md).

## Why elevated permissions are required

Most chaos experiments are not executed from inside the target Pod. Instead, Chaos Daemon injects faults from the node by entering the namespaces of the target Pod, by operating the container runtime of the node, or by touching node resources such as block devices directly. These operations are only permitted for processes with root-level permissions on the node.

The following table lists what Chaos Daemon actually does for each type of chaos experiment:

| Experiment | What Chaos Daemon does | Why elevated permissions are required |
| --- | --- | --- |
| NetworkChaos | Enters the network namespace of the target Pod and configures `tc`, ipset, and iptables rules in it. | Entering the network namespace of another process requires `CAP_SYS_ADMIN`; changing its network configuration requires `CAP_NET_ADMIN` and `CAP_NET_RAW`. |
| DNSChaos | Rewrites iptables rules in the network namespace of the target Pod, so that DNS requests are redirected to the Chaos DNS Server. | Same as NetworkChaos. |
| HTTPChaos | Runs the `tproxy` process in the network namespace of the target Pod to intercept and modify HTTP traffic. | Same as NetworkChaos, plus launching a process inside the target Pod. |
| PodChaos | Kills containers through the container runtime (Docker, containerd, or CRI-O), whose socket on the node is mounted into Chaos Daemon. | Operating the container runtime of the node is a privileged operation. |
| StressChaos | Runs `stress-ng` in the cgroup of the target container. | Managing processes in the cgroup of another container requires `CAP_SYS_ADMIN` and `CAP_KILL`. |
| TimeChaos | Modifies the memory of the processes inside the target container to replace their vDSO clock functions, so their clocks are offset. | Writing to the memory of another process requires `SYS_PTRACE`. |
| IOChaos | Runs the `toda` FUSE daemon inside the target Pod to intercept I/O on the injected volume. | Entering the mount namespace of the target Pod and mounting a FUSE filesystem inside it are privileged operations. |
| BlockChaos | Configures the I/O elevator of the volume's block device through the chaos-driver kernel module. | Operating block devices of the node is a privileged operation. |
| JVMChaos | Enters the target container, copies the Byteman agent into it, and attaches the agent to the target JVM process. | Entering the namespaces of the target container and manipulating its processes are privileged operations. |
| KernelChaos | Loads eBPF programs through the `bpfki` sidecar to inject faults at kernel functions. | Loading eBPF programs requires node-level permissions. The `bpfki` sidecar always runs as privileged, regardless of the `chaosDaemon.privileged` value. |

This is why Chaos Mesh requires `chaosDaemon.privileged=true` in most cases: without these permissions, Chaos Daemon cannot enter the namespaces of the target Pods, and most experiments fail with permission errors.

## The chaosDaemon.privileged value

`chaosDaemon.privileged` controls the security context of the Chaos Daemon DaemonSet. It defaults to `true`. When it is enabled, the Chaos Daemon container runs in privileged mode, which means processes inside it are essentially equivalent to root on the host.

If your cluster policy forbids privileged containers, you can install Chaos Mesh with privileged mode disabled:

<PickHelmVersion>{`helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-mesh --set chaosDaemon.privileged=false --version latest`}</PickHelmVersion>

In this case, Chaos Mesh grants Chaos Daemon the following Linux capabilities instead of full privileged mode:

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

Note the following limitations before you disable privileged mode:

- The capability list still includes `CAP_SYS_ADMIN`, which on its own grants almost as much power as privileged mode. Disabling privileged mode mainly helps when a cluster policy rejects `privileged: true` explicitly but allows specific capabilities, for example, an OPA Gatekeeper policy.
- Even the capability list can be rejected by cluster policies. On OpenShift, you need to grant the privileged Security Context Constraints (SCC) to the `chaos-daemon` service account. On a cluster with Pod Security Standards (PSS) enforced, you need to label the `chaos-mesh` namespace with the `privileged` enforce level. For details, see [the installation FAQ about OpenShift](faqs.md#while-trying-to-install-chaos-mesh-in-openshift-authorization-problems-blocked-the-installation-process) and [the installation FAQ about PSS](faqs.md#installation-fails-on-a-cluster-with-pod-security-standards-pss-enabled).
- KernelChaos is not affected by this value, because its `bpfki` sidecar always runs as privileged.

## Security considerations

Because processes in Chaos Daemon are essentially equivalent to root on every node, anyone who can create chaos experiments can, through Chaos Daemon, affect any Pod and many node resources within the namespaces that Chaos Mesh is allowed to inject faults into. Treat Chaos Mesh as a highly privileged workload and follow these practices:

- Restrict who can create Chaos resources (such as `NetworkChaos` and `Schedule`) with Kubernetes RBAC.
- Limit the scope of experiments by configuring the namespaces that Chaos Mesh is allowed to affect. See [Configure namespace for Chaos experiments](configure-enabled-namespace.md).
- Keep mTLS enabled between Chaos Controller Manager and Chaos Daemon (it is enabled by default), so that the gRPC interface of Chaos Daemon is not callable by arbitrary workloads.

## Further reading

- [Install Chaos Mesh using Helm](production-installation-using-helm.mdx)
- [Chaos Mesh Overview](overview.md)
- [Configure namespace for Chaos experiments](configure-enabled-namespace.md)
