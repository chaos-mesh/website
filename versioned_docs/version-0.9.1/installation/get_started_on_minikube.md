---
title: Get started on Minikube
---

import PickVersion from '@site/src/components/PickVersion'

This document describes how to deploy Chaos Mesh in Kubernetes on your laptop (Linux or macOS) using Minikube.

## Prerequisites

Before deployment, make sure [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) is installed on your local machine.

## Step 1: Set up the Kubernetes environment

Perform the following steps to set up the local Kubernetes environment:

1. Start a Kubernetes cluster:

   ```bash
   minikube start --kubernetes-version v1.15.0 --cpus 4 --memory "8192mb"
   ```

   > **Note:**
   >
   > It is recommended to allocate enough RAM (more than 8192 MiB) to the Virtual Machine (VM) using the `--cpus` and `--memory` flag.

2. Install helm:

   ```bash
   curl https://raw.githubusercontent.com/helm/helm/master/scripts/get | bash
   helm init
   ```

3. Check whether the helm tiller pod is running:

   ```bash
   kubectl -n kube-system get pods -l app=helm
   ```

## Step 2: Install Chaos Mesh

<PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash
</PickVersion>

The above command installs all the CRDs, required service account configuration, and all components.
Before you start running a chaos experiment, verify if Chaos Mesh is installed correctly.

You also can use [helm](https://helm.sh/) to [install Chaos Mesh manually](installation.md#install-by-helm).

### Verify your installation

Verify if Chaos Mesh is running

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

## Limitations

There are some known restrictions for Chaos Operator deployed in the Minikube cluster:

- `netem chaos` is only supported for Minikube clusters >= version 1.6.

In Minikube, the default virtual machine driver's image does not contain the `sch_netem` kernel module in earlier versions. You can use `none` driver (if your host is Linux with the `sch_netem` kernel module loaded) to try these chaos actions using Minikube or [build an image with sch_netem by yourself](https://minikube.sigs.k8s.io/docs/contrib/building/iso/).
