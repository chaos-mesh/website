---
title: 卸载 Chaos Mesh
---

这篇文档介绍了如何卸载 Chaos Mesh，包括使用 Helm 卸载 Chaos Mesh 和手动卸载 Chaos Mesh。如果你需要从 Kubernetes 集群中手动清除 Chaos Mesh，这篇文档也是非常有用的。

## 通过 Helm 卸载 Chaos Mesh

### 第 1 步：清理混沌实验

在卸载 Chaos Mesh 之前，请确保所有的混沌实验都已被删除。你可以通过执行以下命令来查看混沌实验相关的对象：

```shell
for i in $(kubectl api-resources | grep chaos-mesh | awk '{print $1}'); do kubectl get $i -A; done
```

一旦确保所有的混沌实验都已被删除，你可以通过执行以下命令来卸载 Chaos Mesh：

### 第 2 步：查看 Helm Release

你可以通过执行以下命令来查看已安装的 Helm Release：

```shell
helm list -A
```

输出应该像下面这样：

```text
NAME                    NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
chaos-mesh-playground   chaos-mesh      1               2021-12-01 22:58:18.037052401 +0800 CST deployed        chaos-mesh-2.1.0        2.1.0
```

这表示一个名为 `chaos-mesh-playground` 的 Helm Release 已经安装在命名空间 `chaos-mesh` 中，所以这里是将要卸载的 Helm Release。

### 第 3 步：删除 Helm Release

在确认目标 Helm Release 后，你可以通过执行以下命令来删除 Helm Release：

```shell
helm uninstall chaos-mesh-playground -n chaos-mesh
```

### 第 4 步：删除 CRDs

`helm uninstall` 不会删除 CRDs，所以你可以手动删除它们，执行以下命令：

```shell
kubectl delete crd $(kubectl get crd | grep 'chaos-mesh.org' | awk '{print $1}')
```

## 手动卸载 Chaos Mesh

如果你通过脚本 `install.sh` 安装了 Chaos Mesh，或者你修改了 Chaos Mesh 的配置和组件，或者你遇到了卸载 Chaos Mesh 时的问题，这里是一些手动卸载 Chaos Mesh 的方法。

### 第 1 步：清理混沌实验

在卸载 Chaos Mesh 之前，请确保所有的混沌实验都已被删除。你可以通过执行以下命令来查看混沌实验相关的对象：

```shell
for i in $(kubectl api-resources | grep chaos-mesh | awk '{print $1}'); do kubectl get $i -A; done
```

一旦确保所有的混沌实验都已被删除，你可以通过执行以下命令来卸载 Chaos Mesh：

### 第 2 步：删除 Chaos Mesh 工作负载

通常 Chaos Mesh 会安装多种类型的组件：

- 一个名为 `chaos-controller-manager` 的 `Deployment`，它是 Chaos Mesh 的控制器/调节器。
- 一个名为 `chaos-daemon` 的 `DaemonSet`，它是每个 Kubernetes 工作节点上的 Chaos Mesh 的代理。
- 一个名为 `chaos-dashboard` 的 `Deployment`，它是 Chaos Mesh 的 WebUI。
- 一个名为 `chaos-dns-server` 的 `Deployment`，它是 DNS 代理服务器，只有当你启用了 DNSChaos 特性时才会出现。

你应该删除这些工作负载对象。

然后删除它们的对应的 `Service`：

- chaos-daemon
- chaos-dashboard
- chaos-mesh-controller-manager
- chaos-mesh-dns-server

### 第 3 步：删除 Chaos Mesh RBAC 对象

Chaos Mesh 会安装多个 RBAC 对象：

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

你应该删除这些 RBAC 对象。

### 第 4 步：删除 ConfigMaps 和 Secrets

Chaos Mesh 会安装多个 ConfigMaps 和 Secrets：

- ConfigMap
  - chaos-mesh
  - dns-server-config
- Secret
  - chaos-mesh-webhook-certs

你应该删除这些 ConfigMaps 和 Secrets 对象。

### 第 5 步：删除 Webhook

Chaos Mesh 会安装多个 Webhook：

- ValidatingWebhookConfigurations
  - chaos-mesh-validation
  - validate-auth
- MutatingWebhookConfigurations
  - chaos-mesh-mutation

你应该删除这些 Webhooks。

### 第 6 步: 删除 CRDs

最后，你可以通过执行以下命令来删除 CRDs：

```shell
kubectl delete crd $(kubectl get crd | grep 'chaos-mesh.org' | awk '{print $1}')
```
