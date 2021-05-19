---
id: installation
title: Installation
---

import PickVersion from '@site/src/components/PickVersion'

This document describes how to install Chaos Mesh to perform chaos experiments against your application in Kubernetes.

If you want to try Chaos Mesh on your laptop (Linux or macOS), you can refer the following two documents:

- [Get started on kind](../get_started/get_started_on_kind.md)
- [Get started on minikube](../get_started/get_started_on_minikube.md)

## Prerequisites

Before deploying Chaos Mesh, make sure the following items have been installed:

- Kubernetes version >= 1.12
- [RBAC](https://kubernetes.io/docs/admin/authorization/rbac) enabled (optional)

## Install Chaos Mesh

<PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash
</PickVersion>

The above command installs all the CRDs, required service account configuration, and all components.
Before you start running a chaos experiment, verify if Chaos Mesh is installed correctly.

If you are using k3s or k3d, please also specify `--k3s` flag.

<PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --k3s
</PickVersion>

> **Note:**
>
> `install.sh` is suitable for trying Chaos Mesh out. If you want to use Chaos Mesh in production or other serious scenarios, Helm is the recommended deployment method.

### Verify your installation

Verify if Chaos Mesh is running (For the use of _kubectl_, you can refer to the [documentation](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands).)

```bash
kubectl get pod -n chaos-testing
```

Expected output:

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-6d6d95cd94-kl8gs   1/1     Running   0          3m40s
chaos-daemon-5shkv                          1/1     Running   0          3m40s
chaos-dashboard-d998856f6-vgrjs             1/1     Running   0          3m40s
```

## Uninstallation

You can uninstall Chaos Mesh by deleting the namespace.

<PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --template | kubectl delete -f -
</PickVersion>

## Install by helm

You also can install Chaos Mesh by [helm](https://helm.sh).
Before you start installing, make sure that helm v2 or helm v3 is installed correctly.

### Step 1: Add Chaos Mesh repository to Helm repos

```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
```

After adding the repository successfully, you can search available version by the following command:

```bash
helm search repo chaos-mesh
```

### Step 2: Install Chaos Mesh

Depending on your environment, there are two methods of installing Chaos Mesh:

- Install in Docker environment

  1. Create namespace `chaos-testing`:

     ```bash
     kubectl create ns chaos-testing
     ```

  2. Install Chaos Mesh using helm:

     - For helm 2.X

     ```bash
     helm install chaos-mesh/chaos-mesh --name=chaos-mesh --namespace=chaos-testing
     ```

     - For helm 3.X

     ```bash
     helm install chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing
     ```

     > **Note:**
     >
     > Sometimes we might need to change the default values based on Kubernetes editions.
     > Example, Docker socket path is different in PKS Kubernetes clusters (VMware K8s Enterprise editions).
     > helm install chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing --set chaosDaemon.socketPath=/var/vcap/sys/run/docker/docker.sock

  3. Check whether Chaos Mesh pods are installed:

     ```bash
     kubectl get pods --namespace chaos-testing -l app.kubernetes.io/instance=chaos-mesh
     ```

     Expected output:

     ```bash
     NAME                                        READY   STATUS    RESTARTS   AGE
     chaos-controller-manager-6d6d95cd94-kl8gs   1/1     Running   0          3m40s
     chaos-daemon-5shkv                          1/1     Running   0          3m40s
     chaos-daemon-jpqhd                          1/1     Running   0          3m40s
     chaos-daemon-n6mfq                          1/1     Running   0          3m40s
     chaos-dashboard-d998856f6-vgrjs             1/1     Running   0          3m40s
     ```

- Install in containerd environment (kind)

  1. Create namespace `chaos-testing`:

     ```bash
     kubectl create ns chaos-testing
     ```

  2. Install Chaos Mesh using helm:

     - for helm 2.X

     ```bash
     helm install chaos-mesh/chaos-mesh --name=chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
     ```

     - for helm 3.X

     ```bash
     helm install chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
     ```

  3. Check whether Chaos Mesh pods are installed:

     ```bash
     kubectl get pods --namespace chaos-testing -l app.kubernetes.io/instance=chaos-mesh
     ```

     Expected output:

     ```bash
     NAME                                        READY   STATUS    RESTARTS   AGE
     chaos-controller-manager-6d6d95cd94-kl8gs   1/1     Running   0          3m40s
     chaos-daemon-5shkv                          1/1     Running   0          3m40s
     chaos-daemon-jpqhd                          1/1     Running   0          3m40s
     chaos-daemon-n6mfq                          1/1     Running   0          3m40s
     chaos-dashboard-d998856f6-vgrjs             1/1     Running   0          3m40s
     ```

- Install in containerd environment (k3s)

  1. Create namespace `chaos-testing`:

     ```bash
     kubectl create ns chaos-testing
     ```

  2. Install Chaos Mesh using helm:

     - for helm 2.X

     ```bash
     helm install chaos-mesh/chaos-mesh --name=chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/k3s/containerd/containerd.sock
     ```

     - for helm 3.X

     ```bash
     helm install chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/k3s/containerd/containerd.sock
     ```

  3. Check whether Chaos Mesh pods are installed:

     ```bash
     kubectl get pods --namespace chaos-testing -l app.kubernetes.io/instance=chaos-mesh
     ```

     Expected output:

     ```bash
     NAME                                        READY   STATUS    RESTARTS   AGE
     chaos-controller-manager-6d6d95cd94-kl8gs   1/1     Running   0          3m40s
     chaos-daemon-5shkv                          1/1     Running   0          3m40s
     chaos-daemon-jpqhd                          1/1     Running   0          3m40s
     chaos-daemon-n6mfq                          1/1     Running   0          3m40s
     chaos-dashboard-d998856f6-vgrjs             1/1     Running   0          3m40s
     ```

After executing the above commands, you should be able to see the output indicating that all Chaos Mesh pods are up and running. Otherwise, check the current environment according to the prompt message or create an [issue](https://github.com/chaos-mesh/chaos-mesh/issues) for help.
