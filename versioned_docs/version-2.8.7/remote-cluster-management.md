---
title: Remote Cluster Management
---

## Remote Cluster Introduction

Chaos Mesh provides the cluster scoped `RemoteCluster` resource to help you manage and inject faults into remote Kubernetes clusters. This document describes how to create a `RemoteCluster` object and use it to inject faults.

:::note

`RemoteCluster` is in an early stage. The configuration and function of it (for example, configuration migration, version management and authentication) will continue to improve. If you encounter any problems, please open an issue in [chaos-mesh/chaos-mesh](https://github.com/chaos-mesh/chaos-mesh) to report them.

:::

## Register a remote cluster

To register a remote cluster with the Chaos Mesh installed in the current cluster, you will need to create a `RemoteCluster` resource. After creating such a resource, necessary components will be installed automatically in the remote cluster. The following is an example of a `RemoteCluster` resource:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: RemoteCluster
metadata:
  name: cluster-xxx
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

It will install the `chaos-mesh` Helm chart with the `KUBECONFIG` provided in the `.spec.kubeConfig` field in the specified namespace.

### Field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| namespace | string | Represents the namespace in which Chaos Mesh components are installed in the remote cluster | None | Yes | chaos-mesh |
| version | string | The version of Chaos Mesh to install in the remote cluster | None | Yes | 2.6.2 |
| kubeConfig.secretRef.name | string | The name of the secret, which is used to store the kubeconfig of the remote cluster. This kubeconfig is used to install chaos-mesh components and inject faults | None | Yes | `remote-chaos-mesh.kubeconfig` |
| kubeConfig.secretRef.namespace | string | The name of the namespace of the kubeconfig secret. | None | Yes | `default` |
| kubeConfig.secretRef.key | string | The key of the kubeconfig in the secret. | None | Yes | `kubeconfig` |
| configOverride | string | Passing Helm values during install or upgrade | None | No | `{"dashboard":{"create":true}}` |

## Inject faults in the remote cluster

To inject faults into a remote cluster using the registered `RemoteCluster`, you can use the `remoteCluster` field in the `.spec` of every chaos type. For example:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: burn-cpu
spec:
  remoteCluster: cluster-xxx
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

Chaos Mesh will inject faults into the remote cluster using the kubeconfig registered in the `RemoteCluster` named `cluster-xxx`. The corresponding `StressChaos` will be automatically created in the remote cluster and its status is synchronized back to the current cluster, so that you can manage fault injection for multiple different clusters in a single Kubernetes cluster.
