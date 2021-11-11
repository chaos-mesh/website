---
title: Install Chaos Mesh using Helm (Recommended for Production Environments)
---

import PickVersion from '@site/src/components/PickVersion'
import PickHelmVersion from '@site/src/components/PickHelmVersion'

import VerifyInstallation from './common/verify-installation.md'
import QuickRun from './common/quick-run.md'

This document describes how to install Chaos Mesh in the production environment.

## Prerequisites

Before installing Chaos Mesh, make sure that you have installed [Helm](https://helm.sh/docs/intro/install/) in your environment.

To check whether Helm is installed or not, execute the following command:

```bash
helm version
```

The expected output is as follows:

```bash
version.BuildInfo{Version:"v3.5.4", GitCommit:"1b5edb69df3d3a08df77c9902dc17af864ff05d1", GitTreeState:"dirty", GoVersion: "go1.16.3"}
```

If your actual output is similar to the expected output with `Version`, `GitCommit`, `GitTreeState`, and `GoVersion`, it means that Helm is installed successfully.

:::note

In this document, Helm v3 is used in commands to make operations on Chaos Mesh. If Helm v2 is used in your environment, refer to [Migrate Helm v2 to v3](https://helm.sh/docs/topics/v2_v3_migration/) or modify the Helm version to the v2 format.

:::

## Install Chaos Mesh using Helm

### Step 1: Add Chaos Mesh repository

Add the Chaos Mesh repository to the Helm repository:

```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
```

### Step 2: View the installable versions of Chaos Mesh

To see charts that can be installed, execute the following command:

```bash
helm search repo chaos-mesh
```

:::note

The above command will output the latest release of chart. If you want to install a historical version, execute the following command to view all released versions:

```bash
helm search repo chaos-mesh -l
```

:::

After the above command is completed, you can start installing Chaos Mesh.

### Step 3: Create the namespace to install Chaos Mesh

It is recommended to install Chaos Mesh under the `chaos-testing` namespace, or you can specify any namespace to install Chaos Mesh:

```bash
kubectl create ns chaos-testing
```

### Step 4: Install Chaos Mesh in different environments

Because socket paths are listened to by the daemons of different running containers, you need to set different values for socket paths during installation. You can execute the following installation commands according to different environments.

#### Docker

<!-- prettier-ignore -->
<PickHelmVersion className="language-bash">{`\# Default to /var/run/docker.sock
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest`}
</PickHelmVersion>

#### Containerd

<PickHelmVersion className="language-bash">{`helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock --version latest`}</PickHelmVersion>

#### K3s

<PickHelmVersion className="language-bash">{`helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/k3s/containerd/containerd.sock --version latest`}</PickHelmVersion>

:::note

To install Chaos Mesh of a specific version, add the `--version xxx` parameter after `helm upgrade`, for example, `--version 2.0.0`.

:::

:::note

To ensure high availability, Chaos Mesh turns on `leader-election` feature by default. If you do not need to use this feature, you can manually turn it off through `--set controllerManager.leaderElection.enabled=false`.

:::

## Verify the installation

<VerifyInstallation />

## Run Chaos experiments

<QuickRun />

## Upgrade Chaos Mesh

To upgrade Chaos Mesh, execute the following command:

```bash
helm upgrade chaos-mesh chaos-mesh/chaos-mesh
```

:::note

To upgrade Chaos Mesh to a specific version, add the `--version xxx` parameter after `helm upgrade`, for example, `--version 2.0.0`.

:::

:::note

If you have upgraded Chaos Mesh in a non-Docker environment, you need to add the corresponding parameters as described in [Step 4: Install Chaos Mesh in different environments](#step-4-install-chaos-mesh-in-different-environments).

:::

To modify the configuration, set different values according to your need. For example, execute the following command to upgrade and uninstall `chaos-dashboard`:

<PickHelmVersion className="language-bash">{`helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.create=false`}</PickHelmVersion>

:::note

For more values and their usages, refer to [all values](https://github.com/chaos-mesh/chaos-mesh/blob/master/helm/chaos-mesh/values.yaml).

:::

:::caution

Currently, the latest CustomResourceDefinition (CRD) is not applied during the Helm upgrading, which might cause errors. To avoid this situation, you can apply the latest CRD manually:

<PickVersion>
curl -sSL https://mirrors.chaos-mesh.org/latest/crd.yaml | kubectl create -f -
</PickVersion>

:::

## Uninstall Chaos Mesh

To uninstall Chaos Mesh, execute the following command:

```bash
helm uninstall chaos-mesh -n chaos-testing
```

## FAQs

### How can I install the latest version of Chaos Mesh?

The `helm/chaos-mesh/values.yaml` file defines the image of the latest version (the master branch). To install the latest version of Chaos Mesh, execute the following command:

```bash
# Clone repository
git clone https://github.com/chaos-mesh/chaos-mesh.git
cd chaos-mesh

helm install chaos-mesh helm/chaos-mesh -n=chaos-testing
```

### How can I disable the safe mode?

The safe mode is enabled by default. To disable the safe mode, specify `dashboard.securityMode` as `false` during the installation or upgrade:

<PickHelmVersion className="language-bash">{`helm install chaos-mesh helm/chaos-mesh -n=chaos-testing --set dashboard.securityMode=false --version latest`}</PickHelmVersion>
