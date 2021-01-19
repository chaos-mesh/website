---
id: offline_installation
title: Offline Installation
---

This document describes how to install Chaos Mesh under an offline environment, which means can not connect to the internet.

## Prerequisites

Before deploying Chaos Mesh, make sure the following items have been installed:

- Kubernetes version >= 1.12
- [RBAC](https://kubernetes.io/docs/admin/authorization/rbac) enabled (optional)
- Docker

## Prepare the installation file

You need to prepare the installation file with a computer connected to the internet. Make sure Docker is installed on this computer.

You can specify which version you want to install:

```bash
export CHAOS_MESH_VERSION="v1.1.0"
```

It is recommended to use the release version, or you can set it to `latest` if you want to experience the latest unstable version.

### Archive docker images

First, you need to pull images of Chaos Mesh:

```bash
docker pull pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
docker pull pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
docker pull pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
```

Then save these images to tar archives:

```bash
docker save -o ./image-chaos-mesh pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
docker save -o ./image-chaos-daemon pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
docker save -o ./image-chaos-dashboard pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
```

### Download Chaos Mesh repo

Download Chaos Mesh repo with release version:

```bash
wget "https://github.com/chaos-mesh/chaos-mesh/archive/${CHAOS_MESH_VERSION}.zip"
```

Or you can download the latest unstable version:

```bash
wget https://github.com/chaos-mesh/chaos-mesh/archive/master.zip
```

### Copy image and repo archive files

Copy the file `./image-chaos-mesh`, `./image-chaos-daemon`, `./image-chaos-dashboard` and `{CHAOS_MESH_VERSION}.zip` into the offline environment.

## Install Chaos Mesh

Now you already have the image and repo archive files in the offline environment, you can use them to install Chaos Mesh.

Specify the version you are going to install in the offline environment:
```bash
export CHAOS_MESH_VERSION="v1.1.0"
```

### Load and push images

Load the image from archive files:

```bash
docker load -i ./image-chaos-mesh
docker load -i ./image-chaos-daemon
docker load -i ./image-chaos-dashboard
```

You can choose to push these images to Docker Registry or Docker Hub.

- Push images to Docker Registry

   Set the Docker Registry variable, for example:

   ```bash
   export DOCKER_REGISTRY=localhost:5000
   ```

   Tag these images with `$DOCKER_REGISTRY`:

   ```bash
   export CHAOS_MESH_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
   export CHAOS_DAEMON_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
   export CHAOS_DASHBOARD_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
   docker image tag pingcap/chaos-mesh:${CHAOS_MESH_VERSION} $CHAOS_MESH_IMAGE
   docker image tag pingcap/chaos-daemon:${CHAOS_MESH_VERSION} $CHAOS_DAEMON_IMAGE
   docker image tag pingcap/chaos-dashboard:${CHAOS_MESH_VERSION} $CHAOS_DASHBOARD_IMAGE
   ```

   Then push these images to Docker Registry:

   ```bash
   docker push $CHAOS_MESH_IMAGE
   docker push $CHAOS_DAEMON_IMAGE
   docker push $CHAOS_DASHBOARD_IMAGE
   ```

   > **Note:**
   >
   > If the Docker Registry can only work locally, you need to load and push these images on each K8s node.

- Push images to Docker Hub

   Set the Docker Hub variable, for example:

   ```bash
   export DOCKER_HUB=hub
   ```

   Tag these images with `$DOCKER_REGISTRY`:

   ```bash
   export CHAOS_MESH_IMAGE=$DOCKER_HUB/chaos-mesh:${CHAOS_MESH_VERSION}
   export CHAOS_DAEMON_IMAGE=$DOCKER_HUB/chaos-daemon:${CHAOS_MESH_VERSION}
   export CHAOS_DASHBOARD_IMAGE=$DOCKER_HUB/chaos-dashboard:${CHAOS_MESH_VERSION}
   docker image tag pingcap/chaos-mesh:${CHAOS_MESH_VERSION} $CHAOS_MESH_IMAGE
   docker image tag pingcap/chaos-daemon:${CHAOS_MESH_VERSION} $CHAOS_DAEMON_IMAGE
   docker image tag pingcap/chaos-dashboard:${CHAOS_MESH_VERSION} $CHAOS_DASHBOARD_IMAGE
   ```

   Then push these images to Docker Registry:

   ```bash
   docker push $CHAOS_MESH_IMAGE
   docker push $CHAOS_DAEMON_IMAGE
   docker push $CHAOS_DASHBOARD_IMAGE
   ```

### Installation

   1. Unzip the repo archive files:

   ```bash
   unzip {CHAOS_MESH_VERSION}.zip chaos-mesh
   ```

   And then enter the directory.

   2. Create a namespace for install Chaos Mesh:

   ```bash
   kubectl create namespace chaos-testing
   ```

   3. Install Chaos Mesh by helm:

   ```bash
   helm install chaos-mesh helm/chaos-mesh --namespace=chaos-testing \
      --set dashboard.create=true \
      --set chaosDaemon.image=$CHAOS_DAEMON_IMAGE \
      --set controllerManager.image=$CHAOS_MESH_IMAGE \
      --set dashboard.image=$CHAOS_DASHBOARD_IMAGE
   ```

   4. Check whether Chaos Mesh pods are installed:

     ```bash
     kubectl get pods --namespace chaos-testing -l app.kubernetes.io/instance=chaos-mesh
     ```

     Expected output:

     ```bash
     NAME                                        READY   STATUS    RESTARTS   AGE
     chaos-controller-manager-6d6d95cd94-kl8gs   1/1     Running   0          3m40s
     chaos-daemon-5shkv                          1/1     Running   0          3m40s
     chaos-dashboard-d998856f6-vgrjs             1/1     Running   0          3m40s
     ```

After executing the above commands, you should be able to see the output indicating that all Chaos Mesh pods are up and running. Otherwise, check the current environment according to the prompt message or create an [issue](https://github.com/chaos-mesh/chaos-mesh/issues) for help.
