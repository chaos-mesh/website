---
title: Why Chaos Daemon Runs in Privileged Mode
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

When you install Chaos Mesh with Helm, Chaos Daemon runs as a privileged DaemonSet by default. This is controlled by the `chaosDaemon.privileged` Helm value, and in most cases you should keep it enabled. This document explains what Chaos Daemon does with these permissions, when you can turn off privileged mode, and which security practices to follow.

## What Chaos Daemon does

Chaos Daemon is the execution component of Chaos Mesh. It runs as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) on eligible nodes. For faults that require node access, Chaos Controller Manager sends gRPC requests to Chaos Daemon on the affected nodes.

The Helm chart enables mTLS for the gRPC connection between Chaos Controller Manager and Chaos Daemon by default. With the default settings, the chart generates the client and server certificates at install time.

For the overall architecture of Chaos Mesh, see [Chaos Mesh Overview](overview.md).

## Why elevated permissions are required

Chaos Daemon injects faults from the node. It enters the Linux namespaces of target containers, accesses the node's container runtime, or operates on host resources such as block devices. These operations require permissions beyond those of a typical application container.

The following table shows what Chaos Daemon does for several types of chaos experiments:

| Experiment | What Chaos Daemon does | Access and permissions needed |
| --- | --- | --- |
| NetworkChaos | Chaos Daemon uses `tc`, ipset, or iptables in the target network namespace, depending on the action. | Enter the target network namespace with `CAP_SYS_ADMIN`. Changing network settings such as firewall rules requires `CAP_NET_ADMIN`. |
| DNSChaos | Updates the target container's `/etc/resolv.conf` to use Chaos DNS Server. | Enter the container's mount namespace and write to its DNS configuration. |
| HTTPChaos | Starts `tproxy` in the target PID and network namespaces to intercept and modify HTTP traffic. | Enter the target namespaces and redirect traffic to the proxy. |
| PodChaos | For `container-kill`, Chaos Daemon asks Docker or containerd to kill the container. With CRI-O, Chaos Daemon looks up the container PID through CRI-O and sends `SIGKILL` directly. Chaos Controller Manager handles `pod-kill` and `pod-failure` through the Kubernetes API. | Access the container runtime socket for `container-kill`. With CRI-O, Chaos Daemon also needs permission to signal the target process. |
| StressChaos | Runs `stress-ng` for CPU stress and `memStress` for memory stress. | Start a helper process and attach it to the target container's cgroup. |
| TimeChaos | Chaos Daemon modifies target processes' vDSO clock functions to offset their clocks. | Attach to the target process with `ptrace` and write to its memory. `CAP_SYS_PTRACE` lets the Daemon trace processes it would otherwise lack permission to trace. |
| IOChaos | Runs the `toda` FUSE daemon inside the target Pod to intercept I/O on the injected volume. | Entering the mount namespace of the target Pod and mounting a FUSE filesystem inside it are privileged operations. |
| BlockChaos | Configures the I/O elevator of the volume's block device through the chaos-driver kernel module. | Operating block devices of the node is a privileged operation. |
| JVMChaos | Enters the target container, copies the Byteman agent into it, and attaches the agent to the target JVM process. | Entering the namespaces of the target container and manipulating its processes are privileged operations. |
| KernelChaos | Supplies the target container's PID to Chaos Controller Manager, which calls the `bpfki` sidecar to inject the kernel fault. | The `bpfki` sidecar needs node-level permissions to load eBPF programs. |

Privileged mode gives the container all Linux capabilities and lifts the constraints that seccomp, AppArmor, and SELinux impose on it. For example, on Docker, IOChaos needs both `CAP_SYS_ADMIN` and access to `/dev/fuse` to mount a FUSE filesystem. A privileged Docker container can access `/dev/fuse` when the device is available on the host. With privileged mode disabled, the Helm chart still adds `CAP_SYS_ADMIN` by default, but that capability alone does not grant access to `/dev/fuse`. For most installations, keep the default if your cluster policy allows it. If you need to disable privileged mode, first verify that the experiments you plan to run work in your environment. See [Docker's FUSE example](https://docs.docker.com/engine/containers/run/#runtime-privilege-and-linux-capabilities) and [Kubernetes's description of privileged containers](https://kubernetes.io/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers).

## The chaosDaemon.privileged value

`chaosDaemon.privileged` defaults to `true` and controls privileged mode for the main Chaos Daemon container.

Before disabling privileged mode, confirm that your cluster policy allows the following configuration.

- With `chaosDaemon.privileged=false`, the Pod still uses `hostPID: true` and mounts `hostPath` volumes, including the directory containing the container runtime socket. Pod Security Admission rejects this Pod if the installation namespace enforces Baseline or Restricted and no exemption applies.
- The default capabilities listed below include `CAP_SYS_ADMIN`, which grants broad administrative access.
- If you set `bpfki.create=true` to install the `bpfki` sidecar for KernelChaos, the sidecar runs in privileged mode regardless of `chaosDaemon.privileged`. The chart disables the sidecar by default.

For platform-specific setup, see the installation FAQs for [OpenShift SCC](faqs.md#while-trying-to-install-chaos-mesh-in-openshift-authorization-problems-blocked-the-installation-process) and [Pod Security Standards](faqs.md#installation-fails-on-a-cluster-with-pod-security-standards-pss-enabled).

Choose the command for your container runtime from the [Helm installation guide](production-installation-using-helm.mdx#step-4-install-chaos-mesh-in-different-environments) and add `--set chaosDaemon.privileged=false`. The example below uses Docker and its default socket at `/var/run/docker.sock`.

<PickHelmVersion>{`helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-mesh --set chaosDaemon.privileged=false --version latest`}</PickHelmVersion>

With privileged mode disabled, the chart adds these Linux capabilities to the main Chaos Daemon container by default:

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

## Security considerations

Chaos Daemon can affect workloads and node resources. Treat it as a highly privileged workload and follow these practices:

- Restrict who can create Chaos resources (such as `NetworkChaos` and `Schedule`) with Kubernetes RBAC.
- Enable `controllerManager.enableFilterNamespace` and annotate the allowed namespaces to limit experiment target selection. This feature is off by default. See [Configure namespace for Chaos experiments](configure-enabled-namespace.md).
- Keep mTLS enabled between Chaos Controller Manager and Chaos Daemon (it is enabled by default), so that the gRPC interface of Chaos Daemon is not callable by arbitrary workloads.

## Further reading

- [Install Chaos Mesh using Helm](production-installation-using-helm.mdx)
- [Chaos Mesh Overview](overview.md)
- [Configure namespace for Chaos experiments](configure-enabled-namespace.md)
