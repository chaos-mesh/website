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
- [helm](https://helm.sh/) v3.9.0 or later versions
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

- ghcr.io/chaos-mesh/chaos-dashboard:latest
- ghcr.io/chaos-mesh/chaos-mesh:latest
- ghcr.io/chaos-mesh/chaos-daemon:latest

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

3. Install Chaos Mesh with Helm

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh --namespace=chaos-mesh-debug --create-namespace
   ```

:::note

`minikube image load` would cost lots of time, so here is a trick to avoid load images again and again. Using docker from minikube node instead of host's docker.

```bash
minikube start --mount --mount-string "$(pwd):$(pwd)"
eval $(minikube -p minikube docker-env)
```

:::

## Debug Chaos Mesh in local environment

## Learn more

After finishing the above preparation, you can try to [Add a New Chaos Experiment type](add-new-chaos-experiment-type.md).
