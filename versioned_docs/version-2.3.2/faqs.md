---
title: FAQs
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

## Questions

### Q: If I do not have deployed Kubernetes clusters, can I use Chaos Mesh to create chaos experiments?

No. Instead, you could use [`chaosd`](https://github.com/chaos-mesh/chaosd/) to inject failures without kubernetes.

### Q: I have deployed Chaos Mesh and created PodChaos experiments successfully, but I still failed in creating NetworkChaos/TimeChaos Experiment. The log is shown as below:

```console
2020-06-18T02:49:15.160Z ERROR controllers.TimeChaos failed to apply chaos on all pods {"reconciler": "timechaos", "error": "rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing dial tcp xx.xx.xx.xx:xxxx: connect: connection refused\""}
```

The reason is that `chaos-controller-manager` failed to connect to `chaos-daemon`. You need to first check the Pod network and its [policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/).

If everything is in order, maybe you can use the `hostNetwork` parameter to fix this problem as follows:

<PickHelmVersion>{`helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --version latest --set chaosDaemon.hostNetwork=true`}</PickHelmVersion>

Reference: <https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#hostport-services-do-not-work>

### Q: The default administrator Google Cloud user account is forbidden to create chaos experiments. How to fix it?

The default administrator Google Cloud user cannot be checked by `AdmissionReview`. You need to create an administrator role and assign the role to your account to grant the privilege of creating chaos experiments to it. For example:

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
  namespace: chaos-testing
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

### Q: Daemon throws an error similar to `version 1.41 is too new. The maximum supported API version is 1.39`

This indicates that the maximum API version that the Docker daemon can accept is `1.39`, but the client in `chaos-daemon` uses `1.41` by default. You can choose the following options to solve this problem:

1. Upgrade your Docker to a newer version.
2. Helm install/upgrade with `--set chaosDaemon.env.DOCKER_API_VERSION=1.39`.

## DNSChaos

### Q: While trying to run DNSChaos in OpenShift, the problems regarding authorization blocked the process

If the error message is similar to the following:

```bash
Error creating: pods "chaos-dns-server-123aa56123-" is forbidden: unable to validate against any security context constraint: [spec.containers[0].securityContext.capabilities.add: Invalid value: "NET_BIND_SERVICE": capability may not be added]
```

You need to add the privileged Security Context Constraints (SCC) to the `chaos-dns-server`.

```bash
oc adm policy add-scc-to-user privileged -n chaos-mesh -z chaos-dns-server
```

## Installation

### Q: While trying to install Chaos Mesh in OpenShift, the problems regarding authorization blocked the installation process

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

You need to add privileged scc to default.

```bash
oc adm policy add-scc-to-user privileged -n chaos-mesh -z chaos-daemon
```

### Q: Failed to install Chaos Mesh with the message: no matches for kind "CustomResourceDefinition" in version "apiextensions.k8s.io/v1"

This issue occurs when you install Chaos Mesh on Kubernetes v1.15 or an earlier version. We use `apiextensions.k8s.io/v1` by default, but it was introduced in Kubernetes v1.16 on 2019-09-19.

When you install Chaos Mesh on Kubernetes lower than v1.16, you need to follow the below process:

1. Manually create CRD through `https://mirrors.chaos-mesh.org/<chaos-mesh-version>/crd-v1beta1.yaml`.
2. Add `--validate=false`. If the configuration is not added, compatibility issues with breaking changes with CRD might occur. For example, `kubectl create -f https://mirrors.chaos-mesh.org/v2.1.0/crd-v1beta1.yaml --validate=false`.
3. Use Helm to finish the rest process of installation, and append `--skip-crds` with `helm install` command.

We suggest upgrading your Kubernetes cluster by referencing Kubernetes [Version Skew Policy](https://kubernetes.io/releases/version-skew-policy/).
