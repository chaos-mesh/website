---
title: Install Chaos Mesh Offline
---

import PickVersion from '@site/src/components/PickVersion'

import PickHelmVersion from '@site/src/components/PickHelmVersion'

import VerifyInstallation from './common/verify-installation.md'

import QuickRun from './common/quick-run.md'

This document describes how to install Chaos Mesh offline.

## Prerequisites

Before installing Chaos Mesh, make sure that Docker is installed and the Kubernetes cluster is deployed in the offline environment. If the environment is not prepared, refer to the following documents to install Docker and deploy the Kubernetes cluster:

- [Docker](https://www.docker.com/get-started)
- [Kubernetes](https://kubernetes.io/docs/setup/)

## Prepare installation files

Before you install Chaos Mesh offline, you need to download all Chaos Mesh images and repository compression packages from the machines with external network connection, and then copy the downloaded files into your offline environment.

### Specify version number

Set the version number of Chaos Mesh as the environment variable on the machine with external network connection:

<PickVersion content="export CHAOS_MESH_VERSION=latest" />

### Download Chaos Mesh images

On the machine connected to external network, pull images using the version number that has been set:

```bash
docker pull ghcr.io/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION}
docker pull ghcr.io/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION}
docker pull ghcr.io/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION}
```

Save images as the tar packages:

```bash
docker save ghcr.io/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION} > image-chaos-mesh.tar
docker save ghcr.io/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION} > image-chaos-daemon.tar
docker save ghcr.io/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION} > image-chaos-dashboard.tar
```

:::note

To simulate a DNS fault (for example, make the DNS responses return a random wrong IP address), you need to pull the additional [`pingcap/coredns`](https://hub.docker.com/r/pingcap/coredns) images.

:::

### Download the repository compression package of Chaos Mesh

On the machine connected to the external network, download the zip package of Chaos Mesh:

<PickVersion isArchive replaced="refs/heads/master">
curl -fsSL -o chaos-mesh.zip https://github.com/chaos-mesh/chaos-mesh/archive/refs/heads/master.zip
</PickVersion>

### Copy files

After downloading all the files required for installation, you need to copy these files to the offline environment:

- `image-chaos-mesh.tar`
- `image-chaos-daemon.tar`
- `image-chaos-dashboard.tar`
- `chaos-mesh.zip`

## Install Chaos Mesh

After copying the tar package of the Chaos Mesh images and the zip package of the repository to the offline environment, take the following steps to install Chaos Mesh.

### Step 1. Load Chaos Mesh images

Load images from the tar package:

```bash
docker load < image-chaos-mesh.tar
docker load < image-chaos-daemon.tar
docker load < image-chaos-dashboard.tar
```

### Step 2. Push images to Registry

:::note

Before pushing images to Registry, make sure that Registry has been deployed in the offline environment. If Registry is not deployed, refer to [Docker Registry](https://docs.docker.com/registry/) for the deployment method.

:::

Set the Chaos Mesh version and the Registry address as the environment variable:

<PickVersion content="export CHAOS_MESH_VERSION=latest; export DOCKER_REGISTRY=localhost:5000" />

Mark the images so that the images point to the Registry:

```bash
export CHAOS_MESH_IMAGE=$DOCKER_REGISTRY/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION}
export CHAOS_DAEMON_IMAGE=$DOCKER_REGISTRY/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION}
export CHAOS_DASHBOARD_IMAGE=$DOCKER_REGISTRY/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION}
docker image tag ghcr.io/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION} $CHAOS_MESH_IMAGE
docker image tag ghcr.io/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION} $CHAOS_DAEMON_IMAGE
docker image tag ghcr.io/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION} $CHAOS_DASHBOARD_IMAGE
```

Push images to Registry:

```bash
docker push $CHAOS_MESH_IMAGE
docker push $CHAOS_DAEMON_IMAGE
docker push $CHAOS_DASHBOARD_IMAGE
```

### Step 3. Install Chaos Mesh using Helm

Unpack the zip package of Chaos Mesh:

```bash
unzip chaos-mesh.zip -d chaos-mesh && cd chaos-mesh
```

:::note

When installing Chaos Mesh on Kubernetes v1.15(or an earlier version), you need to manually install CRD first by using `kubectl create -f manifests/crd-v1beta1.yaml`. For more information, see [FAQ](./faqs.md#q-failed-to-install-chaos-mesh-with-message-no-matches-for-kind-customresourcedefinition-in-version-apiextensionsk8siov1).

:::

Create the namespace:

```bash
kubectl create ns chaos-mesh
```

Execute the installation command. When executing the installation command, you need to specify the namespace of Chaos Mesh and the image value of each component:

```bash
helm install chaos-mesh helm/chaos-mesh -n=chaos-mesh --set images.registry=$DOCKER_REGISTRY
```

## Verify the installation

<VerifyInstallation />

## Run Chaos experiments

<QuickRun />
