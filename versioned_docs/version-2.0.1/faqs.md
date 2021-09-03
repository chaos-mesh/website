---
id: faqs
title: FAQs
sidebar_label: FAQs
---

## Questions

### Q: If I do not have deployed Kubernetes clusters, can I use Chaos Mesh to create chaos experiments?

No. Instead, you could use [`chaosd`](https://github.com/chaos-mesh/chaosd/) to inject failures without kubernetes.

### Q: I have deployed Chaos Mesh and created PodChaos experiments successfully, but I still failed in creating NetworkChaos/TimeChaos Experiment. The log is shown as below:

```
2020-06-18T01:05:26.207Z	ERROR	controllers.TimeChaos	failed to apply chaos on all pods	{"reconciler": "timechaos", "error": "rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing dial tcp xx.xx.xx.xx:xxxxx: connect: connection refused\""}
```

You can use the `hostNetwork` parameter to fix this issue as follows:

```
helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n chaos-testing --set chaosDaemon.hostNetwork=true
```

### Q: The default administrator Google Cloud user account is forbidden to create chaos experiments. How to fix it?

The default administrator Google Cloud user cannot be checked by `AdmissionReview`. You need to create an administrator role and assign the role to your account to grant the privilege of creating chaos experiments to it. For example:

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: role-cluster-manager-pdmas
rules:
- apiGroups: [""]
  resources: ["pods", "namespaces"]
  verbs: ["get", "watch", "list"]
- apiGroups:
  - chaos-mesh.org
  resources: [ "*" ]
  verbs: ["get", "list", "watch", "create", "delete", "patch", "update"]
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

## DNSChaos

### Q: While trying to run DNSChaos in OpenShift, the problems regarding authorization blocked the process.

If the error message is similar to the following:

```bash
Error creating: pods "chaos-dns-server-123aa56123-" is forbidden: unable to validate against any security context constraint: [spec.containers[0].securityContext.capabilities.add: Invalid value: "NET_BIND_SERVICE": capability may not be added]
```

You need to add the privileged Security Context Constraints (SCC) to the `chaos-dns-server`.

```bash
oc adm policy add-scc-to-user privileged -n chaos-testing -z chaos-dns-server
```

## Installation

### Q: While trying to install Chaos Mesh in OpenShift, the problems regarding authorization blocked the installation process.

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
oc adm policy add-scc-to-user privileged -n chaos-testing -z chaos-daemon
```

