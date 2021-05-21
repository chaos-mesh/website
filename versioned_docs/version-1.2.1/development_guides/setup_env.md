---
id: set_up_the_development_environment
title: Set up the development environment
sidebar_label: Set up the development environment
---

This document walks you through the environment setup process for Chaos Mesh development.

## Prerequisites

- [golang](https://golang.org/dl/) version >= v1.13
- [docker](https://www.docker.com/)
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/) version >= v2.8.2
- [kind](https://github.com/kubernetes-sigs/kind)
- [nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/lang/en/) (for Chaos Dashboard)

## Prepare the toolchain

Make sure you have the above prerequisites met. Now follow the steps below to prepare the toolchain for compiling Chaos Mesh:

1. Clone the Chaos Mesh repo to your local machine.

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   cd chaos-mesh
   ```

2. Install the Kubernetes API development framework - [kubebuilder](https://github.com/kubernetes-sigs/kubebuilder) and [kustomize](https://github.com/kubernetes-sigs/kustomize).

   ```bash
   make ensure-all
   ```

3. Make sure [Docker](https://docs.docker.com/install/) is installed and running on your local machine.

4. Make sure [Docker Registry](https://docs.docker.com/registry/) is running. Set the environment variable `DOCKER_REGISTRY` with the registry address:

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

6. Check nodejs related environment.

   ```bash
    node -v
    yarn -v
   ```

Now you can test the toolchain by running:

```bash
make
```

If there is no error in the output, the compiling toolchain is successfully configured.

## Prepare the deployment environment

With the toolchain ready, you still need a local Kubernetes cluster as the deployment environment. Because kind is already installed, you can now set up the Kubernetes cluster directly:

```bash
hack/kind-cluster-build.sh
```

The above script creates a Kubernetes cluster via Kind. When you are done with it, run the following command to delete it:

```bash
kind delete cluster --name=kind
```

> Bootstrap Chaos Dashboard. (Optional)
>
> ```bash
> cd ui && yarn
> # Run it
> yarn start:default # cross-env REACT_APP_API_URL=http://localhost:2333 BROWSER=none react-scripts start
> ```

## Next step

Congratulations! You are now all set up for Chaos Mesh development. Try the following tasks:

- [Develop a New Chaos Type](dev_hello_world.md)
- [Add facilities to chaos daemon](add_chaos_daemon.md)
