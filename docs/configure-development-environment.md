---
title: Configure the Development Environment
sidebar_label: Configure the Development Environment
---

This document describes how to configure a development environment for Chaos Mesh.

## Configuration requirements

Before configuring, you need to install the development tools for Chaos Mesh.

- [golang](https://golang.org/dl/), v1.15 or later versions
- [docker](https://www.docker.com/)
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/) v2.8.2 or later versions
- [kind](https://github.com/kubernetes-sigs/kind)
- [nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/lang/en/), for developing Chaos Dashboard

## Prepare the toolchain

After installing the above tools, follow the steps below to configure the toolchain for compiling Chaos Mesh.

1. Clone the Chaos Mesh repository to your local server.

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   cd chaos-mesh
   ```

2. Install Kubernetes API frameworks [kubebuilder](https://github.com/kubernetes-sigs/kubebuilder) and [kustomize](https://github.com/kubernetes-sigs/kustomize).

   ```bash
   make ensure-all
   ```

3. Make sure that [Docker](https://docs.docker.com/install/) is installed and running in your environment.

4. Make sure [Docker Registry](https://docs.docker.com/registry/) is running. Set the environment variable `DOCKER_REGISTRY` as the address of Docker Registry:

   ```bash
   echo 'export DOCKER_REGISTRY=localhost:5000' >> ~/.bash_profile
   source ~/.bash_profile
   ```

5. Make sure `${GOPATH}/bin` is in your `PATH`.

   ```bash
   echo 'export PATH=$(go env GOPATH)/bin:${PATH}' >> ~/.bash_profile
   ```

   ```bash
   source ~/.bash_profile
   ```

6. Check the configuration environment related to Node.js.

   ```bash
    node -v
    yarn -v
   ```

7. Compile Chaos Mesh:

   ```bash
   make
   ```

If no error occurs, you have successfully cnofigured the toolchain.

## Prepare the environment for deployment

After configuring the toolchain, you need to launch a local Kubernetes cluster to deploy Chaos Mesh. Because kind is installed in the configuration requirements section, you can directly use the following command to launch a Kubernetes cluster:

```bash
hack/kind-cluster-build.sh
```

When you no longer need this cluster and want to delete it, you can use the following command:

```bash
kind delete cluster --name=kind
```

To start Chaos Dashboard, run the following command:

```bash
cd ui && yarn
# start
yarn start:default # cross-env REACT_APP_API_URL=http://localhost:2333 BROWSER=none react-scripts start
```

## Learn more

After finishing the above preparation, you can try to [Add a New Chaos Experiment type](add-new-chaos-experiment-type.md).
