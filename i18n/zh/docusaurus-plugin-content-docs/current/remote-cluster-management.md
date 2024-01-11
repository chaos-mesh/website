---
title: 远程集群管理
---

## 远程集群介绍

Chaos Mesh 提供集群范围的 `RemoteCluster` 资源，帮助您管理故障并将故障注入远程 Kubernetes 集群。本文档描述了如何创建 `RemoteCluster` 对象并使用它来注入故障。

:::note 注意

`RemoteCluster` 尚处于早期阶段。它的配置和功能（例如配置迁移、版本管理和认证）将不断完善。如果您遇到任何问题，请在 [chaos-mesh/chaos-mesh](https://github.com/chaos-mesh/chaos-mesh) 中打开一个 issue 进行报告。

:::

## 注册远程集群

要将远程集群注册到在当前集群上安装的 Chaos Mesh 中，您需要创建一个 `RemoteCluster` 资源。创建此资源后，必要的组件将自动安装在远程集群中。以下是 `RemoteCluster` 资源的示例：

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: RemoteCluster
metadata:
  name: cluster-xxxxxxx
spec:
  namespace: chaos-mesh
  version: 2.6.2
  kubeConfig:
    secretRef:
      name: remote-chaos-mesh.kubeconfig
      namespace: chaos-mesh
      key: kubeconfig
  # configOverride:
  #   dashboard:
  #     create: true
```

它将使用 `.spec.kubeConfig` 字段中提供的 `KUBECONFIG` 在指定命名空间安装 `chaos-mesh`。

### 字段说明

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| namespace | string | 在远程集群中安装 Chaos Mesh 的命名空间 | 无 | 是 | chaos-mesh |
| version | string | 在远程集群中安装 Chaos Mesh 的版本 | 无 | 是 | 2.6.1 |
| kubeConfig.secretRef.name | string | 用于存储远程集群的 kubeconfig 的 secret 的名称。该 kubeconfig 将用于安装 chaos-mesh 组件并注入故障 | 无 | 是 | `remote-chaos-mesh.kubeconfig` |
| kubeConfig.secretRef.namespace | string | kubeconfig secret 所在的命名空间名称。 | 无 | 是 | `default` |
| kubeConfig.secretRef.key | string | secret 中 kubeconfig 所在的键。 | 无 | 是 | `kubeconfig` |
| configOverride | string | 在安装或升级期间传递的 helm 值 | 无 | 否 | `{"dashboard":{"create":true}}` |

## 在远程集群中注入故障

要使用注册的 `RemoteCluster` 将故障注入到远程集群，您可以使用每种 chaos 类型的 `.spec` 中的 `remoteCluster` 字段。 例如：

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: burn-cpu
spec:
  remoteCluster: cluster-xxxxxxx
  mode: one
  selector:
    labelSelectors:
      'app.kubernetes.io/component': 'tikv'
  stressors:
    cpu:
      workers: 1
      load: 100
      options: ['--cpu 2', '--timeout 600', '--hdd 1']
  duration: '30s'
```

Chaos Mesh 将使用注册到名为 `cluster-xxxxxxx` 的 `RemoteCluster` 的 kubeconfig 将故障注入到远程集群。相应的 `StressChaos` 将在远程集群中自动创建，并将状态同步回当前集群，以便您可以在单个 kubernetes 中管理多个不同集群的故障注入。
