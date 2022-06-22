---
title: Upgrade from 2.1 to 2.2
---

There are several changes in Helm Charts 2.2.0 release. This documentation introduces how to migrate from 2.1.x to 2.2.0.

## Upgrade with Helm

### Step 1: Add/Update Chaos Mesh Helm repository

Add the Chaos Mesh repository to the Helm repository and update it:

```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm repo update
```

### Step 2: Migrate the `values.yaml` file

If you installed Chaos Mesh with a certain `values.yaml`, it is recommended to apply your customized configuration to the `values.yaml` of Chaos Mesh 2.2.0.

You can fetch the default `values.yaml` by the following command:

```bash
helm show values chaos-mesh/chaos-mesh --version 2.2.0 > values.yaml
```

If you do not recognize the changed configurations, you might not rely on that specific feature, it is usually safe to ignore them.

Here is a list of Helm Chart changes:

- new configuration: `chaosDaemon.mtls.enabled` represents using mtls bwteen chaos-controller-manager and chaos-daemon.
- new configuration: `webhook.caBundlePEM` represents the CA bundle used to serve the webhook server.
- value changed: `dashboard.serviceAccount` changed from `chaos-controller-manager` to `chaos-dashboard`
- value changed: `webhook.FailurePolicy` changed from `Ignore` to `Fail`

:::note
For more information about the detailed description, see [README](https://github.com/chaos-mesh/chaos-mesh/blob/v2.2.0/helm/chaos-mesh/README.md).
:::

### Step 3: Update the CRD

For Kubernetes version >= 1.16, you can apply the latest CRD by executing the following command:

```bash
kubectl replace -f https://mirrors.chaos-mesh.org/v2.2.0/crd.yaml
```

For Kubernetes version <= 1.15, you can apply the latest CRD by executing the following command:

```bash
kubectl replace -f https://mirrors.chaos-mesh.org/v2.2.0/crd-v1beta1.yaml
```

:::note Chaos Mesh 2.2.x would be the last series of releases that support Kubernetes < 1.19. :::

### Step 4: Upgrade Chaos Mesh by `helm upgrade`

Then you can execute the following command to upgrade Chaos Mesh to the 2.2.0:

```bash
helm upgrade <release-name> chaos-mesh/chaos-mesh --namespace=<namespace> --version=2.2.0 <--other-required-flags>
```

## Ask the Community

If you have any questions about upgrading Chaos Mesh, feel free to contact us at [Slack Channel](https://cloud-native.slack.com/archives/C0193VAV272), GitHub [Issues](https://github.com/chaos-mesh/chaos-mesh/issues/new?assignees=&labels=&template=question.md) and [Discussions](https://github.com/chaos-mesh/chaos-mesh/discussions/new).
