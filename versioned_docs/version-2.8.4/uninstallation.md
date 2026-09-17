---
title: Uninstall Chaos Mesh
---

This document describes how to uninstall Chaos Mesh, using either Helm or a manual approach. It is also helpful to manually purge a Chaos Mesh installation from your Kubernetes cluster if necessary.

## Uninstall Chaos Mesh with Helm

### Step 1: Clean Up Chaos Experiments

Before uninstalling Chaos Mesh, make sure that all the chaos experiments are deleted. You can list the chaos-related objects by executing:

```shell
for i in $(kubectl api-resources | grep chaos-mesh | awk '{print $1}'); do kubectl get $i -A; done
```

Once you are sure that all the chaos experiments have been deleted, you can uninstall Chaos Mesh.

### Step 2: List Helm Releases

You could list the installed helm release by executing:

```shell
helm list -A
```

The output should look like:

```text
NAME                    NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
chaos-mesh-playground   chaos-mesh      1               2021-12-01 22:58:18.037052401 +0800 CST deployed        chaos-mesh-2.1.0        2.1.0
```

This means that Chaos Mesh has been installed as a Helm release named `chaos-mesh-playground` in the `chaos-mesh` namespace. This is the target release to uninstall.

### Step 3: Delete Helm Releases

After you determine the target Helm release, you can delete it by executing:

```shell
helm uninstall chaos-mesh-playground -n chaos-mesh
```

### Step 4: Remove CRDs

`helm uninstall` does not remove the CRDs, so you can remove them manually by executing:

```shell
kubectl delete crd $(kubectl get crd | grep 'chaos-mesh.org' | awk '{print $1}')
```

## Uninstall Chaos Mesh Manually

If you installed Chaos Mesh using the `install.sh` script, modified some configurations or components after installation, or ran into problems when uninstalling Chaos Mesh, the following steps can help you uninstall Chaos Mesh manually.

### Step 1: Clean Up Chaos Experiments

Before uninstalling Chaos Mesh, make sure that all the chaos experiments are deleted. You can list the chaos-related objects by executing:

```shell
for i in $(kubectl api-resources | grep chaos-mesh | awk '{print $1}'); do kubectl get $i -A; done
```

Once you are sure that all the chaos experiments have been deleted, you can uninstall Chaos Mesh.

### Step 2: Remove Chaos Mesh Workloads

A typical Chaos Mesh installation includes several kinds of components:

- A `Deployment` named `chaos-controller-manager`, which serves as the controller and reconciler for Chaos Mesh.
- A `DaemonSet` named `chaos-daemon`, which acts as the Chaos Mesh agent on each Kubernetes worker node.
- A `Deployment` named `chaos-dashboard`, which provides the Web UI for Chaos Mesh.
- A `Deployment` named `chaos-dns-server`, which is a DNS proxy server that is deployed only if you enable the DNSChaos feature.

You should remove these workload objects.

Then delete their corresponding `Service` objects:

- chaos-daemon
- chaos-dashboard
- chaos-mesh-controller-manager
- chaos-mesh-dns-server

### Step 3: Remove Chaos Mesh RBAC Objects

There are several RBAC objects as Chaos Mesh installed:

- ClusterRoleBinding
  - chaos-mesh-playground-chaos-controller-manager-cluster-level
  - chaos-mesh-playground-chaos-controller-manager-target-namespace
  - chaos-mesh-playground-chaos-dns-server-cluster-level
  - chaos-mesh-playground-chaos-dns-server-target-namespace
- ClusterRole
  - chaos-mesh-playground-chaos-controller-manager-cluster-level
  - chaos-mesh-playground-chaos-controller-manager-target-namespace
  - chaos-mesh-playground-chaos-dns-server
  - chaos-mesh-playground-chaos-dns-server-cluster-level
- RoleBinding
  - chaos-mesh-playground-chaos-controller-manager-control-plane
  - chaos-mesh-playground-chaos-dns-server-control-plane
- Role
  - chaos-mesh-playground-chaos-controller-manager-control-plane
  - chaos-mesh-playground-chaos-dns-server-control-plane
- ServiceAccount
  - chaos-controller-manager
  - chaos-daemon
  - chaos-dns-server

You should remove these RBAC objects.

### Step 4: Remove ConfigMaps And Secrets

There are several ConfigMaps and Secrets as Chaos Mesh installed:

- ConfigMap
  - chaos-mesh
  - dns-server-config
- Secret
  - chaos-mesh-webhook-certs

You should remove these ConfigMap and Secret objects.

### Step 5: Remove Webhook

There are several Webhooks as Chaos Mesh installed:

- ValidatingWebhookConfigurations
  - chaos-mesh-validation
  - chaos-mesh-validate-auth
- MutatingWebhookConfigurations
  - chaos-mesh-mutation

You should remove these webhooks.

### Step 6: Remove CRDs

Finally, you can remove the CRDs by executing:

```shell
kubectl delete crd $(kubectl get crd | grep 'chaos-mesh.org' | awk '{print $1}')
```
