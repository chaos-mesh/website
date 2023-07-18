---
title: Configure the Development Environment
---

This document describes how to configure a local development environment for Chaos Mesh.

Most components of Chaos Mesh are **only designed for Linux**, so we suggest that you also configure your development environment to run on Linux. For example, use a virtual machine or WSL 2 and use VSCode Remote as your editor.

This document assumes that you are using Linux, without the limitations of specific Linux distributions. If you insist on using Windows/MacOS, you may need some tricks to make it work for you (For example, some make targets may fail depending on the environment).

## Configuration Requirements

Before configuring, it is recommended that you install the development tools listed below, most of them may already be installed in your environment:

- [make](https://www.gnu.org/software/make/)
- [docker](https://docs.docker.com/install/)
- [golang](https://go.dev/doc/install), `v1.18` or later versions
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/), `v3.9.0` or later versions
- [minikube](https://minikube.sigs.k8s.io/docs/start/)

Optional:

- [nodejs](https://nodejs.org/en/) and [pnpm](https://pnpm.io/), for developing Chaos Dashboard

## Compiling Chaos Mesh

After installing, follow the steps below to compile Chaos Mesh.

1. Clone the Chaos Mesh repository to your local server:

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   cd chaos-mesh
   ```

2. Make sure that [Docker](https://docs.docker.com/install/) is installed and running.

   :::info

   Chaos Mesh relies on Docker to build container images, this is for consistency with the production environment.

   :::

3. Compile Chaos Mesh:

   ```bash
   UI=1 make image
   ```

   :::tip

   `UI=1` means that we will compile the user interface of Chaos Dashboard, if you don't need it, you can omit this env.

   :::

   :::tip

   If you want to specify the tag of the image, you can use `UI=1 make IMAGE_TAG=dev image`.

   :::

   After compiling, you should get the following container images:

   - `ghcr.io/chaos-mesh/chaos-dashboard:latest`
   - `ghcr.io/chaos-mesh/chaos-mesh:latest`
   - `ghcr.io/chaos-mesh/chaos-daemon:latest`

## Run Chaos Mesh in local minkube Kubernetes cluster

Now you can run Chaos Mesh in a local Kubernetes cluster after compiling.

1. Start a local Kubernetes cluster with minkube:

   ```bash
   minikube start
   ```

2. Load container images into minikube:

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   ```

3. Install Chaos Mesh by Helm:

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh --namespace=chaos-mesh-debug --create-namespace
   ```

:::tip

`minikube image load` would cost lots of time, so here is a trick to avoid load images again and again during development. Using docker from minikube node instead of host's docker:

```bash
minikube start --mount --mount-string "$(pwd):$(pwd)"
eval $(minikube -p minikube docker-env)
UI=1 make image
```

:::

## Debug Chaos Mesh in local environment

We could use [delve](https://github.com/go-delve/delve) with remote debugging to debug the Chaos Mesh in local environment.

1. Compile Chaos Mesh with `DEBUG=1`:

   ```bash
   UI=1 DEBUG=1 make image
   ```

2. Load container images into minikube:

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   ```

3. Install Chaos Mesh and enable Remote Debugging:

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh --namespace=chaos-mesh-debug --create-namespace --set chaosDlv.enable=true --set controllerManager.leaderElection.enabled=false
   ```

   :::note

   To ensure high availability, Chaos Mesh turns on `leader-election` feature by default and will create 3 replicas for `chaos-controller-manager`. We will use `controllerManager.leaderElection.enabled=false` to ensure that Chaos Mesh only creates 1 instance of `chaos-controller-manager` for easier debugging.

   For more details, see [Install Chaos Mesh in different environments](production-installation-using-helm.md#step-4-install-chaos-mesh-in-different-environments).

   :::

4. Setup Port-Forwarding and Configure IDE To Connect the Remote Debugger:

   We could use `kubectl port-forward` to forward the delve debugging server to a local port.

   For example, if we want to debug `chaos-controller-manger`, we could execute the following command:

   ```bash
   kubectl -n chaos-mesh-debug port-forward chaos-controller-manager-766dc8488d-7n5bq 58000:8000
   ```

   Then we could access the remote delve debugger server with `127.0.0.1:58000`.

   :::info

   We always use `8000` in the pod for serving the delve debug server, that's a convention. You could find that in helm templates files.

   :::

   Then we could configure our favorite IDE to connect to the remote debugger, below are some examples:

   - For Goland, see [Attach to running Go processes with the debugger#Attach to a process on a remote machine](https://www.jetbrains.com/help/go/attach-to-running-go-processes-with-debugger.html#attach-to-a-process-on-a-remote-machine).

   - For VSCode, see [vscode-go - Debugging#Remote Debugging](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#remote-debugging).

For more detailed information, see [README.md for container image chaos-dlv](https://github.com/chaos-mesh/chaos-mesh/blob/master/images/chaos-dlv/README.md).

## What's Next

After finishing the above preparation, you can try to [Add a New Chaos Experiment Type](add-new-chaos-experiment-type.md).

## FAQ

### Run make fail with `error obtaining VCS status: exit status 128` in MacOS

The reason is related to <https://github.blog/2022-04-12-git-security-vulnerability-announced/>. It's recommended you to read it first.

Chaos Mesh will start the container (`dev-env` or `build-env`) with the current user (when you call `make`). You can find the appropriate `--user` flag in [get_env_shell.py#L81C10-L81C10](https://github.com/chaos-mesh/chaos-mesh/blob/813b650c02e0b065ae5c4707725c346929ab1847/build/get_env_shell.py#L81C10-L81C10). So when Git is looking for a top-level `.git` directory, it will stop if its directory traversal changes ownership from the current user.

A temporary solution for now is to comment out the line of `--user`.
