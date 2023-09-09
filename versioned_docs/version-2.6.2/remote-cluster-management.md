---
title: Remote Cluster Management
---

## Remote Cluster Introduction

Chaos Mesh provides the cluster scoped `RemoteCluster` resource to help you manage and inject faults into remote Kubernetes clusters. This document describes how to create a `RemoteCluster` object and use it to inject faults.

:::note

`RemoteCluster` is in an early stage. The configuration and function of it (for example, configuration migration, version management and authentication) will continue to improve. If you faced any problem, please open an issue in [chaos-mesh/chaos-mesh](https://github.com/chaos-mesh/chaos-mesh) to report.

:::

## Register a remote cluster

To register a remote cluster into the Chaos Mesh installed on the current cluster, you'll need to create a `RemoteCluster` resource. After creating such a resource, necessary components will be installed automatically in the remote cluster. The following is an example of a `RemoteCluster` resource:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: RemoteCluster
metadata:
  name: cluster-xxxxxxx
spec:
  namespace: 'chaos-mesh'
  version: '2.6.2'
  kubeConfig:
    secretRef:
      name: remote-chaos-mesh.kubeconfig
      namespace: default
      key: kubeconfig
  # configOverride:
  #   dashboard:
  #     create: true
```

It will install the `chaos-mesh` helm chart with the `KUBECONFIG` provided in the `.spec.kubeConfig` field in the specified namespace.

### Field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| namespace | string | Represent the namespace to install Chaos Mesh components in the remote cluster | None | Yes | chaos-mesh |
| version | string | The version of Chaos Mesh to install in the remote cluster | None | Yes | 2.6.1 |
| kubeConfig.secretRef.name | string | The name of the secret, which is used to store the kubeconfig of remote cluster. This kubeconfig will be used to install chaos-mesh components and inject errors | None | Yes | `remote-chaos-mesh.kubeconfig` |
| kubeConfig.secretRef.namespace | string | The name of the kubeconfig secret. | None | Yes | `default` |
| kubeConfig.secretRef.key | string | The key of the kubeconfig in the secret. | None | Yes | `kubeconfig` |
| configOverride | string | Passing helm values during install or upgrade | None | No | `{"dashboard":{"create":true}}` |

## Inject errors in the remote cluster

To inject the errors to a remote cluster using the registered `RemoteCluster`, you could use the `remoteCluster` field in the `.spec` of every chaos types. For example:

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

The Chaos Mesh will inject the errors to the remote cluster using the kubeconfig registered with the `RemoteCluster` named `cluster-xxxxxxx`. The corresponding `StressChaos` will be automatically created in the remote cluster, and the status is synchronized back to the current cluster, so that you can manage the chaos injection for multiple different clusters in a single kubernetes.
