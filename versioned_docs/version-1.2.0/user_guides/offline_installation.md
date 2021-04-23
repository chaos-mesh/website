---
id: offline_installation
title: Offline Installation
---

This document describes how to install Chaos Mesh in an offline environment.

## Prerequisites

Before deploying Chaos Mesh, make sure the following items have been installed:

- Kubernetes version >= 1.12
- [RBAC](https://kubernetes.io/docs/admin/authorization/rbac) enabled (optional)
- Docker

## Prepare the installation file

To install Chaos Mesh offline, you need to get the installation images via an internet connection. Take the steps below:

1. Specify the version you want to install:

   ```bash
   export CHAOS_MESH_VERSION="v1.1.0"
   ```

   > **Note:**
   >
   > It is recommended that you use a stable release, or you can set the version to `latest` if you want to experience the latest features that are under development.

2. Archive the docker images of Chaos Mesh:

   ```bash #pull images of Chaos Mesh
   docker pull pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
   docker pull pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
   docker pull pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
   docker pull pingcap/coredns:v0.2.0
   ```

   ```bash #save images of Chaos Mesh to files
   docker save -o ./image-chaos-mesh pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
   docker save -o ./image-chaos-daemon pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
   docker save -o ./image-chaos-dashboard pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
   docker save -o ./image-chaos-coredns pingcap/coredns:v0.2.0
   ```

3. Download the Chaos Mesh repository to your local:

   ```bash
   wget "https://github.com/chaos-mesh/chaos-mesh/archive/${CHAOS_MESH_VERSION}.zip"
   ```

   Or you can download the latest unstable version:

   ```bash
   wget https://github.com/chaos-mesh/chaos-mesh/archive/master.zip
   ```

4. Copy the `./image-chaos-mesh`, `./image-chaos-daemon`, `./image-chaos-dashboard`, and `{CHAOS_MESH_VERSION}.zip` into the offline environment.

## Install Chaos Mesh offline

Now that you already have the image and repo archive files in the offline environment, start installing Chaos Mesh.

1. Specify the version you are going to install in the offline environment:

   ```bash
   export CHAOS_MESH_VERSION="v1.1.0"
   ```

2. Load the image from the archive files:

   ```bash
   docker load -i ./image-chaos-mesh
   docker load -i ./image-chaos-daemon
   docker load -i ./image-chaos-dashboard
   docker load -i ./image-chaos-coredns
   ```

3. Push the Chaos Mesh images. You can choose to push them to Docker Registry or Docker Hub.

   - Push images to Docker Registry

     a. Set the Docker Registry variable, for example:

     ```bash
     export DOCKER_REGISTRY=localhost:5000
     ```

     b. Tag these images with `$DOCKER_REGISTRY`:

     ```bash
     export CHAOS_MESH_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-mesh:${CHAOS_MESH_VERSION}
     export CHAOS_DAEMON_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-daemon:${CHAOS_MESH_VERSION}
     export CHAOS_DASHBOARD_IMAGE=$DOCKER_REGISTRY/pingcap/chaos-dashboard:${CHAOS_MESH_VERSION}
     export CHAOS_COREDNS_IMAGE=$DOCKER_REGISTRY/pingcap/coredns:v0.2.0
     docker image tag pingcap/chaos-mesh:${CHAOS_MESH_VERSION} $CHAOS_MESH_IMAGE
     docker image tag pingcap/chaos-daemon:${CHAOS_MESH_VERSION} $CHAOS_DAEMON_IMAGE
     docker image tag pingcap/chaos-dashboard:${CHAOS_MESH_VERSION} $CHAOS_DASHBOARD_IMAGE
     docker image tag pingcap/coredns:v0.2.0 $CHAOS_COREDNS_IMAGE
     ```

     c. Push these images to Docker Registry:

     ```bash
     docker push $CHAOS_MESH_IMAGE
     docker push $CHAOS_DAEMON_IMAGE
     docker push $CHAOS_DASHBOARD_IMAGE
     docker push $CHAOS_COREDNS_IMAGE
     ```

     > **Note:**
     >
     > If the Docker Registry can only work locally, you need to load and push these images on each K8s node.

   - Push images to Docker Hub

     a. Set the Docker Hub variable, for example:

     ```bash
     export DOCKER_HUB=hub
     ```

     b. Tag these images with `$DOCKER_REGISTRY`:

     ```bash
     export CHAOS_MESH_IMAGE=$DOCKER_HUB/chaos-mesh:${CHAOS_MESH_VERSION}
     export CHAOS_DAEMON_IMAGE=$DOCKER_HUB/chaos-daemon:${CHAOS_MESH_VERSION}
     export CHAOS_DASHBOARD_IMAGE=$DOCKER_HUB/chaos-dashboard:${CHAOS_MESH_VERSION}
     export CHAOS_COREDNS_IMAGE=$DOCKER_HUB/coredns:v0.2.0
     docker image tag pingcap/chaos-mesh:${CHAOS_MESH_VERSION} $CHAOS_MESH_IMAGE
     docker image tag pingcap/chaos-daemon:${CHAOS_MESH_VERSION} $CHAOS_DAEMON_IMAGE
     docker image tag pingcap/chaos-dashboard:${CHAOS_MESH_VERSION} $CHAOS_DASHBOARD_IMAGE
     docker image tag pingcap/coredns:v0.2.0 $CHAOS_COREDNS_IMAGE
     ```

     c. Push these images to Docker Registry:

     ```bash
     docker push $CHAOS_MESH_IMAGE
     docker push $CHAOS_DAEMON_IMAGE
     docker push $CHAOS_DASHBOARD_IMAGE
     docker push $CHAOS_COREDNS_IMAGE
     ```

4. Install Chaos Mesh offline with the following steps:

   a. Unzip the repo archive files to a path:

   ```bash
   unzip ${CHAOS_MESH_VERSION}.zip -d chaos-mesh && cd chaos-mesh/*/
   ```

   b. Create a namespace for installing Chaos Mesh:

   ```bash
   kubectl create namespace chaos-testing
   ```

   c. Install Chaos Mesh by helm:

   ```bash
   helm install chaos-mesh helm/chaos-mesh  --namespace=chaos-testing \
      --set dashboard.create=true \
      --set dnsServer.create=true \
      --set chaosDaemon.image=$CHAOS_DAEMON_IMAGE \
      --set controllerManager.image=$CHAOS_MESH_IMAGE \
      --set dashboard.image=$CHAOS_DASHBOARD_IMAGE \
      --set dnsServer.image=${CHAOS_COREDNS_IMAGE}
   ```

   d. Check whether Chaos Mesh pods are installed:

   ```bash #get pods of Chaos Mesh
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
