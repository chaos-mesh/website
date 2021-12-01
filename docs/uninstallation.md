---
title: Uninstall Chaos Mesh
---

This document introduces how to uninstall Chaos Mesh, including uninstall Chaos Mesh with Helm and uninstall Chaos Mesh manually. It's also very helpful to manually purge Chaos Mesh installation from Kubernetes cluster if you have to do.

## Uninstall Chaos Mesh with Helm

### Step 1: Clean Up Chaos Experiments

Before uninstall Chaos Mesh, please make sure that all the chaos experiments are deleted. You could list chaos related objects by executing:

```shell
for i in $(kubectl api-resources | grep chaos-mesh | awk '{print $1}'); do kubectl get $i -A; done
```

Once you make sure that all the chaos experiments are deleted, you can uninstall Chaos Mesh.

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

It means that Chaos Mesh has been installed as a helm release named `chaos-mesh-playground` in namespace `chaos-mesh`. So here is the target release to uninstall.

### Step 3: Delete Helm Releases

After determine the target release, you could delete the release by executing:

```shell
helm uninstall chaos-mesh-playground -n chaos-mesh
```

### Step 4: Remove CRDs

`helm uninstall` would not remove the CRDs, so you could remove them manually by executing:

```shell
kubectl delete crd $(kubectl get crd | grep 'chaos-mesh.org' | awk '{print $1}')
```

## Uninstall Chaos Mesh Manually

If you installed Chaos Mesh by script `install.sh`, or you modified some configurations and components after Chaos Mesh installed, or you meet some troubles when uninstalling Chaos Mesh, here are some steps could help you to uninstall Chaos Mesh manually.

### Step 1: Clean Up Chaos Experiments

Before uninstall Chaos Mesh, please make sure that all the chaos experiments are deleted. You could list chaos related objects by executing:

```shell
for i in $(kubectl api-resources | grep chaos-mesh | awk '{print $1}'); do kubectl get $i -A; done
```

Once you make sure that all the chaos experiments are deleted, you can uninstall Chaos Mesh.

### Step 2: Remove Chaos Mesh Workloads

There are usually several kind of components as Chaos Mesh installed:

- A `Deployment` called `chaos-controller-manager`, it is the controller/reconciler for Chaos Mesh.
- A `DaemonSet` called `chaos-daemon`, it is the agent for Chaos Mesh on each Kubernetes worker node.
- A `Deployment` called `chaos-dashboard`, the WebUI for Chaos Mesh.
- A `Deployment` called `chaos-dns-server`, it is the DNS proxy server, only occurs with you enable the DNSChaos feature.

So we could use kubectl to delete these workloads:

Then delete their corresponding `Service`s:

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

You should remove these ConfigMaps And Secrets objects.

### Step 5: Remove Webhook

There are several Webhooks as Chaos Mesh installed:

- ValidatingWebhookConfigurations
  - chaos-mesh-validation
  - validate-auth
- MutatingWebhookConfigurations
  - chaos-mesh-mutation

You should remove these webhooks.

### Step 6: Remove CRDs

At last, you could remove CRds by executing:

```shell
kubectl delete crd $(kubectl get crd | grep 'chaos-mesh.org' | awk '{print $1}')
```
