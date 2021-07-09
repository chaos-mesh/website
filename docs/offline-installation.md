---
title: Install Chaos Mesh Offline
sidebar_label: Install Chaos Mesh Offline
---

import PickVersion from '@site/src/components/PickVersion'

import VerifyInstallation from './common/verify-installation.md'
import QuickRun from './common/quick-run.md'

This document describes how to install Chaos Mesh offline.

## Prerequisites

Before installing Chaos Mesh, make sure that Docker is installed and the Kubernetes cluster is deployed in the offline environment. If the environment is not prepared, refer to the following documents to install Docker and deploy the Kubernetes cluster:

- [Docker](https://www.docker.com/get-started)
- [Kubernetes](https://kubernetes.io/docs/setup/)

## Prepare installation files

Before you install Chaos Mosh offline, you need to download all Chaos Mesh images and repository compressed packages from machines with external network connections, and then copy the downloaded files into your offline environment.

### Specify version number

Set the version number of Chaos Mesh as the environment variable on the machine with external network connection:

<PickVersion className="language-bash">
export CHAOS_MESH_VERSION=latest
</PickVersion>

### Download Chaos Mesh images

On the machine connected to the external network, pull images using the version number that has been set:

```bash
docker pull pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
docker pull pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
docker pull pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
```

Save images as the tar packages:

```bash
docker save pingcap/chaos-mesh:${CHAOS_MESH_VERSION} > image-chaos-mesh.tar
docker save pingcap/chaos-daemon:${CHAOS_MESH_VERSION} > image-chaos-daemon.tar
docker save pingcap/chaos-dashboard:${CHAOS_MESH_VERSION} > image-chaos-dashboard.tar
```

:::note

To simulate a DNS fault (for example, make the DNS responses return a random wrong IP address), you need to pull the additional [`pingcap/coredns`](https://hub.docker.com/r/pingcap/coredns) images.

:::

### Download the repository compression package of Chaos Mesh

On the machine connected to the external network, download the zip package of Chaos Mesh:

```bash
curl https://github.com/chaos-mesh/chaos-mesh/archive/refs/heads/${CHAOS_MESH_VERSION}.zip -o chaos-mesh.zip
```

:::note

The `latest` version corresponds to the `master` branch of the Chaos Mesh repository. The download link of the latest zip package is as follows:

<https://github.com/chaos-mesh/chaos-mesh/archive/refs/heads/master.zip>

:::

### Copy files

After downloading all the files required for installation, you need to copy these files to the offline environment:

- `image-chaos-mesh.tar`
- `image-chaos-daemon.tar`
- `image-chaos-dashboard.tar`
- `chaos-mesh.zip`

## Install Chaos Mesh

After copying the tar package of the Chaos Mesh images and the zip package of the repository to the offline environment, take the following steps to install Chaos Mesh.

### Step 1: Load Chaos Mesh images

Load images from the tar package:

```bash
docker load < image-chaos-mesh.tar
docker load < image-chaos-daemon.tar
docker load < image-chaos-dashboard.tar
```

### Step 2: Push images to Registry

:::note

Before pushing images to Registry, make sure that Registry has been deployed in the offline environment. If Registry is not deployed, refer to [Docker Registry](https://docs.docker.com/registry/) for the deployment method.

:::

Set the Chaos Mesh version and the Registry address as the environment variable:

<PickVersion className="language-bash">
export CHAOS_MESH_VERSION=; export DOCKER_REGISTRY=localhost:5000
</PickVersion>

Mark the images so that the images point to the Registry:

```bash
export CHAOS_MESH_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
export CHAOS_DAEMON_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
export CHAOS_DASHBOARD_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
docker image tag pingcap/chaos-mesh:${CHAOS_MESH_VERSION} $CHAOS_MESH_IMAGE
docker image tag pingcap/chaos-daemon:${CHAOS_MESH_VERSION} $CHAOS_DAEMON_IMAGE
docker image tag pingcap/chaos-dashboard:${CHAOS_MESH_VERSION} $CHAOS_DASHBOARD_IMAGE
```

Push images to Registry:

```bash
docker push $CHAOS_MESH_IMAGE
docker push $CHAOS_DAEMON_IMAGE
docker push $CHAOS_DASHBOARD_IMAGE
```

### Step 3: Install Chaos Mesh using Helm

Unpack the zip package of Chaos Mesh:

```bash
unzip chaos-mesh.zip -d chaos-mesh && cd chaos-mesh
```

Create the namespace:

```bash
kubectl create ns chaos-testing
```

Execute the installation command.  When executing the installation command, you need to specify the namespace of Chaos Mesh and the image value of each component:

```bash
helm install chaos-mesh helm/chaos-mesh -n=chaos-testing \
  --set chaosDaemon.image=$CHAOS_DAEMON_IMAGE
  --set controllerManager.image=$CHAOS_MESH_IMAGE \
  --set dashboard.image=$CHAOS_DASHBOARD_IMAGE
```

## Verify the installation

<VerifyInstallation />

## Run Chaos experiments

<QuickRun />