---
title: Configure the Development Environment
---

This document describes how to configure a local development environment for Chaos Mesh.

Most components of Chaos Mesh are designed only for Linux, so we suggest that you also configure your development environment to run on Linux. For example, using a virtual machine or WSL 2, and using VSCode Remote as your editor.

This document assumes that you use Linux, without the restriction on specific Linux distributions. If you persist to use Windows/MacOS, you might need some tricks to make it work by yourself.

## Configuration Requirements

Before configuring, we suggest to install the development tools for Chaos Mesh.

- [make](https://www.gnu.org/software/make/)
- [docker](https://docs.docker.com/install/)
- [golang](https://go.dev/doc/install), v1.18 or later versions
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/), v3.9.0 or later versions
- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/lang/en/), for developing Chaos Dashboard

## Compiling Chaos Mesh

After installing the above tools, follow the steps below to configure the toolchain for compiling Chaos Mesh.

1. Clone the Chaos Mesh repository to your local server.

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   cd chaos-mesh
   ```

2. Make sure that [Docker](https://docs.docker.com/install/) is installed and running in your environment.

3. Compile Chaos Mesh:

   ```bash
   UI=1 make
   ```

   You should get these container images:

   - `ghcr.io/chaos-mesh/chaos-dashboard:latest`
   - `ghcr.io/chaos-mesh/chaos-mesh:latest`
   - `ghcr.io/chaos-mesh/chaos-daemon:latest`

## Run Chaos Mesh in Local minkube Kubernetes Cluster

After compiling Chaos Mesh, you can run Chaos Mesh in a local Kubernetes cluster.

1. Start a local Kubernetes cluster with minkube.

   ```bash
   minikube start
   ```

2. Load container images into minikube

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   ```

3. Install Chaos Mesh by Helm

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh --namespace=chaos-mesh-debug --create-namespace
   ```

:::note

`minikube image load` would cost lots of time, so here is a trick to avoid load images again and again. Using docker from minikube node instead of host's docker.

```bash
minikube start --mount --mount-string "$(pwd):$(pwd)"
eval $(minikube -p minikube docker-env)
UI=1 make
```

:::

## Debug Chaos Mesh in local environment

We could use [delve](https://github.com/go-delve/delve) with remote debugging to debug the Chaos Mesh in local environment.

1. Compile Chaos Mesh with Debug Info

   ```bash
   UI=1 DEBUGGER=1 make
   ```

2. Load container images into minikube

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   ```

3. Install Chaos Mesh by Helm with Enabling Remote Debugging

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh --namespace=chaos-mesh-debug --create-namespace --set chaosDlv.enable=true --set controllerManager.replicaCount=1
   ```

   :::note

   We would set 3 replicas for `chaos-controller-manager` for HA purpose, `--set controllerManager.replicaCount=1` would create 1 instance of `chaos-controller-manager` for easier debugging.

   :::

4. Setup Port-Forwarding and Configure IDE To Connect the Remote Debugger

   We could use `kubectl port-forward` for port-forwarding the delve debugging server on a local port.

   For example, if we want to debug `chaos-controller-manger`, we could execute the following command:

   ```bash
   kubectl -n chaos-mesh-debug port-forward chaos-controller-manager-766dc8488d-7n5bq 58000:8000
   ```

   Then we could access the remote delve debugger server with `127.0.0.1:58000`.

   :::note

   We always use `8000` in the pod for serving the delve debug server, that's a convention. You could find that in helm templates files.

   :::

   Then we could configure our favorite IDE to connect to the remote debugger:

   For Goland, see [Attach to running Go processes with the debugger#Attach to a process on a remote machine](https://www.jetbrains.com/help/go/attach-to-running-go-processes-with-debugger.html#attach-to-a-process-on-a-remote-machine).

   For VSCode, see [vscode-go - Debugging#Remote Debugging](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#remote-debugging).

For more detailed information, see [README.md for container image chaos-dlv](https://github.com/chaos-mesh/chaos-mesh/blob/master/images/chaos-dlv/README.md).

## Learn more

After finishing the above preparation, you can try to [Add a New Chaos Experiment type](add-new-chaos-experiment-type.md).
