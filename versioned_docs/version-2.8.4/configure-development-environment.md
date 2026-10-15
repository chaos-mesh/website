---
title: Configure the Development Environment
---

This document describes how to configure a local development environment for Chaos Mesh.

Most components of Chaos Mesh are **only designed for Linux**, so we suggest that you also configure your development environment to run on Linux. For example, use a virtual machine or WSL 2 and use VS Code Remote as your editor.

This document assumes that you are using Linux, without the limitations of specific Linux distributions. If you insist on using Windows/macOS, you may need some workarounds to make it work for you (for example, some make targets may fail depending on the environment).

## Configuration Requirements

Before configuring, it is recommended that you install the development tools listed below; most of them may already be installed in your environment:

- [make](https://www.gnu.org/software/make/)
- [docker](https://docs.docker.com/install/)
- [golang](https://go.dev/doc/install), `v1.18` or later
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/), `v3.9.0` or later
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

   Chaos Mesh relies on Docker to build container images; this keeps the build consistent with the production environment.

   :::

3. Compile Chaos Mesh:

   ```bash
   UI=1 make image
   ```

   :::tip

   `UI=1` means that you will also compile the Chaos Dashboard user interface. If you don't need it, you can omit this environment variable.

   :::

   :::tip

   If you want to specify the tag of the image, you can use `UI=1 make IMAGE_TAG=dev image`.

   :::

   After compiling, you should get the following container images:
   - `ghcr.io/chaos-mesh/chaos-dashboard:latest`
   - `ghcr.io/chaos-mesh/chaos-mesh:latest`
   - `ghcr.io/chaos-mesh/chaos-daemon:latest`

## Run Chaos Mesh in a local minikube Kubernetes cluster

Now you can run Chaos Mesh in a local Kubernetes cluster after compiling.

1. Start a local Kubernetes cluster with minikube:

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
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh -n=chaos-mesh-debug --create-namespace
   ```

:::tip

`minikube image load` takes a lot of time. Here is a trick to avoid loading images again and again during development: use Docker from the minikube node instead of the host's Docker.

```bash
minikube start --mount --mount-string "$(pwd):$(pwd)"
eval $(minikube -p minikube docker-env)
UI=1 make image
```

:::

## Debug Chaos Mesh in local environment

We could use [delve](https://github.com/go-delve/delve) with remote debugging to debug the Chaos Mesh in local environment.

1. Compile Chaos Mesh with `DEBUGGER=1`:

   ```bash
   UI=1 DEBUGGER=1 make image
   ```

2. Load container images into minikube:

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   ```

3. Install Chaos Mesh and enable Remote Debugging:

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh -n=chaos-mesh-debug --create-namespace --set chaosDlv.enable=true --set controllerManager.leaderElection.enabled=false
   ```

   :::note

   To ensure high availability, Chaos Mesh enables leader election by default and creates three replicas of `chaos-controller-manager`. Setting `controllerManager.leaderElection.enabled=false` makes Chaos Mesh create only one replica of `chaos-controller-manager`, which is easier to debug.

   For more details, see [Install Chaos Mesh in different environments](production-installation-using-helm.mdx#step-4-install-chaos-mesh-in-different-environments).

   :::

4. Set up port forwarding and configure the IDE to connect to the remote debugger:

   We could use `kubectl port-forward` to forward the delve debugging server to a local port.

   For example, if we want to debug `chaos-controller-manager`, we could execute the following command:

   ```bash
   kubectl -n chaos-mesh-debug port-forward chaos-controller-manager-766dc8488d-7n5bq 58000:8000
   ```

   Then we could access the remote delve debugger server with `127.0.0.1:58000`.

   :::info

   The debug server in the pod always listens on port `8000`; this is a convention you can find in the Helm chart templates.

   :::

   Then we could configure our favorite IDE to connect to the remote debugger, below are some examples:
   - For GoLand, see [Attach to running Go processes with the debugger#Attach to a process on a remote machine](https://www.jetbrains.com/help/go/attach-to-running-go-processes-with-debugger.html#attach-to-a-process-on-a-remote-machine).

   - For VS Code, see [vscode-go - Debugging#Remote Debugging](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#remote-debugging).

For more detailed information, see [README.md for container image chaos-dlv](https://github.com/chaos-mesh/chaos-mesh/blob/master/images/chaos-dlv/README.md).

## What's Next

After finishing the above preparation, you can try to [Add a New Chaos Experiment Type](add-new-chaos-experiment-type.md).

## FAQ

### `make` fails with `error obtaining VCS status: exit status 128` on macOS

The reason is related to https://github.blog/2022-04-12-git-security-vulnerability-announced/. We recommend that you read it first.

Chaos Mesh will start the container (`dev-env` or `build-env`) with the current user (when you call `make`). You can find the appropriate `--user` flag in [get_env_shell.py#L81C10-L81C10](https://github.com/chaos-mesh/chaos-mesh/blob/813b650c02e0b065ae5c4707725c346929ab1847/build/get_env_shell.py#L81C10-L81C10). So when Git is looking for a top-level `.git` directory, it will stop if its directory traversal changes ownership from the current user.

A temporary solution is to comment out the `--user` line.
