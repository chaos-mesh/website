---
title: Install Chaos Mesh using KubeStellar Console
---

import VerifyInstallation from './common/\_verify-installation.md'

import QuickRun from './common/\_quick-run.md'

This document describes how to install Chaos Mesh using the [KubeStellar Console](https://console.kubestellar.io?utm_source=chaos-mesh-docs&utm_medium=docs&utm_campaign=install-via-kubestellar-console) — a standalone Kubernetes dashboard that provides a guided install mission for Chaos Mesh. The mission is an alternative to the manual [Helm install](./production-installation-using-helm.md) flow: it walks through prerequisites, runs the Helm commands against your configured kubeconfig context, validates the install after each step, and surfaces logs and events when something goes wrong. Everything the console does maps back to the same upstream `chaos-mesh/chaos-mesh` Helm chart — there is no fork or shim.

This approach was added in response to a maintainer request in [chaos-mesh/chaos-mesh#4858](https://github.com/chaos-mesh/chaos-mesh/issues/4858).

:::note

KubeStellar Console is an independent project. It is unrelated to legacy `kubestellar/kubestellar`, `kubeflex`, or OCM and shares no code with them. Source: [github.com/kubestellar/console](https://github.com/kubestellar/console).

:::

## Prerequisites

Before starting, make sure that:

- You have a running Kubernetes cluster (v1.16+ recommended for current Chaos Mesh releases).
- Your `kubeconfig` is configured to point at the cluster where you want to install Chaos Mesh.
- You have [Helm 3.8+](https://helm.sh/docs/intro/install/) and `kubectl` installed locally — the console generates standard Helm commands and, depending on how you run it, can execute them on your behalf or let you copy-paste them.

To verify Helm is installed, run:

```bash
helm version
```

## Install the KubeStellar Console

The console runs locally and connects to your current kubeconfig context. Start it with the one-line installer:

```bash
curl -sSL https://raw.githubusercontent.com/kubestellar/console/main/start.sh | bash
```

If you want GitHub OAuth (for multi-user setups), export credentials first:

```bash
export GITHUB_CLIENT_ID=<your-client-id>
export GITHUB_CLIENT_SECRET=<your-client-secret>
curl -sSL https://raw.githubusercontent.com/kubestellar/console/main/start.sh | bash
```

To deploy the console into a cluster instead of running it locally:

```bash
curl -sSL https://raw.githubusercontent.com/kubestellar/console/main/deploy.sh | bash
```

When the console is running, open its local URL in a browser and sign in.

:::tip

You can also browse the Chaos Mesh install mission as read-only documentation without installing the console: [console.kubestellar.io/missions/install-chaos-mesh](https://console.kubestellar.io/missions/install-chaos-mesh?utm_source=chaos-mesh-docs&utm_medium=docs&utm_campaign=install-via-kubestellar-console).

:::

## Run the Chaos Mesh install mission

In the console, open **AI Mission Explorer** and search for `install-chaos-mesh`, or navigate directly to the mission URL. The mission is structured as a sequence of steps:

### Step 1: Pre-flight

The mission checks prerequisites against your connected cluster — Kubernetes version, Helm availability, kubeconfig context, namespace existence, and required RBAC permissions.

### Step 2: Add the Chaos Mesh Helm repository

```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
```

### Step 3: Create the chaos-mesh namespace

```bash
kubectl create ns chaos-mesh
```

### Step 4: Install Chaos Mesh

The mission runs the install with runtime-specific flags. Pick the runtime that matches your cluster and the mission shows the exact command. For a Docker-runtime cluster, the default command is:

```bash
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-mesh --version latest
```

For containerd, K3s, MicroK8s, or CRI-O, the mission sets the appropriate `chaosDaemon.runtime` and `chaosDaemon.socketPath` values. See [Install Chaos Mesh using Helm](./production-installation-using-helm.md#step-4-install-chaos-mesh-in-different-environments) for the full list of per-runtime commands — the mission uses the same values.

### Step 5: Validate

After install, the mission queries your cluster to confirm:

- All Chaos Mesh pods in the `chaos-mesh` namespace are `Ready`.
- The Chaos Mesh CRDs are registered.
- The `chaos-dashboard` service is reachable.

If a check fails, the mission pulls pod logs and recent events from the namespace and points at likely causes (wrong runtime socket path, CRDs not applied on old Kubernetes, pod security rejection, etc.).

### Step 6: Rollback

Each step has a corresponding rollback. The full uninstall is:

```bash
helm uninstall chaos-mesh -n chaos-mesh
```

## Verify the installation

<VerifyInstallation />

## Run Chaos experiments

<QuickRun />

## Upgrade Chaos Mesh

The mission's upgrade flow wraps the same Helm command as the manual install:

```bash
helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n=chaos-mesh
```

To pin a version, the mission adds `--version x.y.z`. For the CRD upgrade caveat and runtime-specific flags, see [Upgrade Chaos Mesh](./production-installation-using-helm.md#upgrade-chaos-mesh) in the Helm install doc.

## Uninstall Chaos Mesh

```bash
helm uninstall chaos-mesh -n chaos-mesh
```

Followed by namespace cleanup if you no longer need it:

```bash
kubectl delete ns chaos-mesh
```

## Feedback

The Chaos Mesh mission definition is open source. Issues and improvements are welcome at [kubestellar/console-kb/blob/master/fixes/cncf-install/install-chaos-mesh.json](https://github.com/kubestellar/console-kb/blob/master/fixes/cncf-install/install-chaos-mesh.json?utm_source=chaos-mesh-docs&utm_medium=docs&utm_campaign=install-via-kubestellar-console).
