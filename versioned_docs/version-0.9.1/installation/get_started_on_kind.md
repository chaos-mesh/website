---
title: Get started on kind
---

import PickVersion from '@site/src/components/PickVersion'

This document describes how to deploy Chaos Mesh in Kubernetes on your laptop (Linux or macOS) using kind.

## Prerequisites

Before deployment, make sure [Docker](https://docs.docker.com/install/) is installed and running on your local machine.

## Install Chaos Mesh

<PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --local kind
</PickVersion>

`install.sh` is an automation shell script that helps you install dependencies such as `kubectl`, `helm`, `kind`, and `kubernetes`, and deploy Chaos Mesh itself.

After executing the above command, you need to verify if the Chaos Mesh is installed correctly.

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

<PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --template | kubectl delete -f -
</PickVersion>

In addition, you also can uninstall Chaos Mesh by deleting the namespace directly.

```bash
kubectl delete ns chaos-testing
```

## Clean kind cluster

```bash
kind delete cluster --name=kind
```
