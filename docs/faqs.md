---
title: FAQs
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

### If I have not deployed a Kubernetes cluster, can I use Chaos Mesh to create chaos experiments?

No. Instead, you can use [`chaosd`](https://github.com/chaos-mesh/chaosd/) to inject failures without Kubernetes.

### I have deployed Chaos Mesh and created PodChaos experiments successfully, but I still failed to create NetworkChaos/TimeChaos experiments. The log is shown below:

```console
2020-06-18T02:49:15.160Z ERROR controllers.TimeChaos failed to apply chaos on all pods {"reconciler": "timechaos", "error": "rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing dial tcp xx.xx.xx.xx:xxxx: connect: connection refused\""}
```

The reason is that `chaos-controller-manager` failed to connect to `chaos-daemon`. You need to first check the Pod network and its [policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/).

If everything is in order, you may fix this problem by using the `hostNetwork` parameter as follows:

<PickHelmVersion>{`helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --version latest --set chaosDaemon.hostNetwork=true`}</PickHelmVersion>

Reference: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#hostport-services-do-not-work

### The default Google Cloud administrator account cannot create chaos experiments. How do I fix it?

The default Google Cloud administrator account cannot be checked by `AdmissionReview`. You need to create an administrator role and assign the role to your account to grant it the privilege of creating chaos experiments. For example:

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: role-cluster-manager-pdmas
rules:
  - apiGroups: ['']
    resources: ['pods', 'namespaces']
    verbs: ['get', 'watch', 'list']
  - apiGroups:
      - chaos-mesh.org
    resources: ['*']
    verbs: ['get', 'list', 'watch', 'create', 'delete', 'patch', 'update']
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: cluster-manager-binding
  namespace: chaos-mesh
subjects:
  # Google Cloud user account
  - kind: User
    name: USER_ACCOUNT
roleRef:
  kind: ClusterRole
  name: role-cluster-manager-pdmas
  apiGroup: rbac.authorization.k8s.io
```

The `USER_ACCOUNT` above should be your Google Cloud user email.

### Daemon throws an error similar to `version 1.41 is too new. The maximum supported API version is 1.39`

This indicates that the maximum API version that the Docker daemon can accept is `1.39`, but the client in `chaos-daemon` uses `1.41` by default. You can choose the following options to solve this problem:

1. Upgrade your Docker to a newer version.
2. Helm install/upgrade with `--set chaosDaemon.env.DOCKER_API_VERSION=1.39`.

## DNSChaos

### While trying to run DNSChaos in OpenShift, authorization problems blocked the process

If the error message is similar to the following:

```bash
Error creating: pods "chaos-dns-server-123aa56123-" is forbidden: unable to validate against any security context constraint: [spec.containers[0].securityContext.capabilities.add: Invalid value: "NET_BIND_SERVICE": capability may not be added]
```

You need to add the privileged Security Context Constraints (SCC) to the `chaos-dns-server`.

```bash
oc adm policy add-scc-to-user privileged -n chaos-mesh -z chaos-dns-server
```

## Installation

### While trying to install Chaos Mesh in OpenShift, authorization problems blocked the installation process

If the error message is similar to the following:

```bash
Error creating: pods "chaos-daemon-" is forbidden: unable
 to validate against any security context constraint: [spec.securityContext.hostNetwork:
 Invalid value: true: Host network is not allowed to be used spec.securityContext.hostPID:
 Invalid value: true: Host PID is not allowed to be used spec.securityContext.hostIPC:
 Invalid value: true: Host IPC is not allowed to be used securityContext.runAsUser:
 Invalid value: "hostPath": hostPath volumes are not allowed to be used spec.containers[0].securityContext.volumes[1]:
 Invalid value: true: Host network is not allowed to be used spec.containers[0].securityContext.containers[0].hostPort:
 Invalid value: 31767: Host ports are not allowed to be used spec.containers[0].securityContext.hostPID:
 Invalid value: true: Host PID is not allowed to be used spec.containers[0].securityContext.hostIPC:
......]
```

You need to add the privileged SCC to the `chaos-daemon` service account.

```bash
oc adm policy add-scc-to-user privileged -n chaos-mesh -z chaos-daemon
```

### Installation fails on a cluster with Pod Security Standards (PSS) enabled

Chaos Daemon must run as a privileged DaemonSet to inject faults into target pods. If the `chaos-mesh` namespace is labeled with a Pod Security Standards (PSS) enforce level other than `privileged` (for example, `baseline` or `restricted`), the creation of Chaos Daemon pods is rejected during installation, with an error message similar to:

```bash
Error creating: pods "chaos-daemon-" is forbidden: violates PodSecurity
"restricted:v1.24": allowPrivilegeEscalation != false, unrestricted capabilities,
runAsNonRoot != true, seccompProfile
```

To fix this, label the `chaos-mesh` namespace with the `privileged` enforce level before installing Chaos Mesh:

```bash
kubectl label namespace chaos-mesh pod-security.kubernetes.io/enforce=privileged --overwrite
```

## Chaosd

### Failed with error: attempt to write a readonly database

When running chaosd using either command mode or service mode, if the current user lacks write permissions to the SQLite database file used by chaosd, this error will occur. By default, the database file is located in the chaosd installation directory at `/usr/local/chaosd-v$VERSION-$OS-$ARCH/chaosd.db` (e.g., `/usr/local/chaosd-v1.4.0-linux-amd64/chaosd.db`).

To resolve this issue, you need to grant write permissions to the database file:

```bash
# Replace the path with your actual chaosd installation directory
sudo chmod 666 /usr/local/chaosd-v*/chaosd.db
# Also ensure the directory is writable
sudo chmod 775 /usr/local/chaosd-v*/
```

Alternatively, you can run chaosd with appropriate privileges or change the ownership of the database file to your current user.

### Network chaos experiments involving tc and iptables require sudo privileges

When creating network chaos experiments that use `tc` (traffic control) or `iptables`, you must execute chaosd commands with `sudo` or root privileges. Without proper permissions, the chaos attack cannot be applied, and recovery operations will also fail.

Examples of network chaos that require sudo:

- Network delay, loss, duplicate, or corrupt
- Network bandwidth limitation
- Network partition

To run these experiments:

```bash
# Command mode
sudo chaosd attack network delay --device eth0 --latency 100ms

# Service mode - start the service with sudo
sudo chaosd server
```

If you don't use sudo, you may see errors like "permission denied" or "operation not permitted" when attempting to modify network configurations.
