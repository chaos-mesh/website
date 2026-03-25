---
title: Configure namespace for Chaos experiments
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

This chapter walks you through how to configure Chaos experiments to only take effect in the specified namespace, and protect other unspecified namespaces against fault injection.

## Control the scope where the Chaos experiment takes effect

Chaos Mesh offers two ways to control the scope of the Chaos experiment to take effect:

- To configure Chaos experiments to only take effect in the specified namespace, you need to enable the FilterNamespace feature (which is off by default). This feature takes effect on a global scope. After this feature is enabled, you can add annotations to the namespace in which Chaos experiments are allowed to take effect. Other namespaces without annotations are protected against fault injection.
- To specify the scope for a single Chaos experiment to take effect, refer to [Define the scope of a Chaos experiment](define-chaos-experiment-scope.md).

## Enable FilterNamespace

If you have not installed Chaos Mesh yet, you can enable this feature during installation by adding `--set controllerManager.enableFilterNamespace=true` to the command when installing using Helm. The following is a command example in the Docker container:

<PickHelmVersion>{`helm install chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --set controllerManager.enableFilterNamespace=true --version latest`}</PickHelmVersion>

:::note

When you use Helm for installation, commands and parameters differ for different containers. Refer to [Install Chaos Mesh using Helm](production-installation-using-helm.md) for more information.

:::

If you have installed Chaos Mesh using Helm, you can enable this feature by upgrading the configuration with the `helm upgrade` command. For example:

<PickHelmVersion>{`helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --version latest --set controllerManager.enableFilterNamespace=true`}</PickHelmVersion>

For `helm upgrade`, you can set multiple parameters by adding multiple `--set` in the command. Later settings override previous settings. For example, if you add `--set controllerManager.enableFilterNamespace=false -set controllerManager.enableFilterNamespace=true` in the command, it still enables this feature.

You can also specify a YAML file using the `-f` parameter to describe the configuration. Refer to [Helm upgrade](https://helm.sh/zh/docs/helm/helm_upgrade/#%E7%AE%80%E4%BB%8B) for more information.

## Add annotations to namespaces for Chaos experiments

When FilterNamespace is enabled, Chaos Mesh only injects faults to namespaces containing the annotation `chaos-mesh.org/inject=enabled`. Therefore, before starting Chaos experiments, you need to add this annotation to the namespace in which Chaos experiments can take effect, while other namespaces are protected against fault injection.

You can add the annotation for a `namespace` using the following `kubectl` command:

```bash
kubectl annotate ns $NAMESPACE chaos-mesh.org/inject=enabled
```

In the above command, `$NAMESPACE` refers to the name of the namespace, for example, `default`. If the annotation is successfully added, the output is as follows:

```bash
namespace/$NAMESPACE annotated
```

If you want to delete this annotation, you can use the following command:

```bash
kubectl annotate ns $NAMESPACE chaos-mesh.org/inject-
```

If the annotation is successfully deleted, the output is as follows:

```bash
namespace/$NAMESPACE annotated
```

## Check all namespaces where Chaos experiments take effect

You can list all the namespaces that allows Chaos experiments using the following command:

```bash
kubectl get ns -o jsonpath='{.items[?(@.metadata.annotations.chaos-mesh\.org/inject=="enabled")].metadata.name}'
```

This command outputs all the namespaces with the `chaos-mesh.org/inject=enabled` annotation. For example:

```bash
default
```
