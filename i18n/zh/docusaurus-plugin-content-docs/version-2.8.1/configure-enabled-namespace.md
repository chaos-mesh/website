---
title: 配置允许混沌实验的命名空间
---

本篇文章描述如何配置混沌实验只在指定的命名空间内生效，其他未配置的命令空间则会受到保护不会被故障注入。

## 控制混沌实验生效的范围

Chaos Mesh 提供了以下两种方式用于控制混沌实验生效的范围：

- 要配置混沌实验只在指定的命名空间内生效，你需要开启 FilterNamespace 功能（默认关闭），此功能将在全局范围内生效。开启此功能后，你可以为允许混沌实验的命名空间添加注解，其他未添加注解的命名空间则会受到保护不会被注入故障。
- 要为单个混沌实验指定实验生效的范围，请参考[定义实验范围](define-chaos-experiment-scope.md)。

## 开启 FilterNamespace 功能

如果你尚未安装 Chaos Mesh，在使用 Helm 进行安装时，可以在安装命令中添加 `--set controllerManager.enableFilterNamespace=true` 来开启这项功能。Docker 容器的命令示例如下：

```bash
helm install chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --set controllerManager.enableFilterNamespace=true
```

:::note 注意

当使用 Helm 进行安装时，不同容器运行时的命令和参数有所区别，详情请参阅[使用 Helm 安装](production-installation-using-helm.md)。

:::

如果已经通过 Helm 安装了 Chaos Mesh ，可以通过 `helm upgrade` 命令来更新配置。示例如下：

```bash
helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --set controllerManager.enableFilterNamespace=true
```

`helm upgrade` 中可以通过设置多个 `--set` 参数来设置多个参数，覆盖规则是后设置的覆盖前设置的。比如 `--set controllerManager.enableFilterNamespace=false --set controllerManager.enableFilterNamespace=true` 仍将开启这项功能。

也可以通过 `-f` 参数来指定一个 YAML 文件用于描述配置，详细请参考 [Helm 升级文档](https://helm.sh/zh/docs/helm/helm_upgrade/#%E7%AE%80%E4%BB%8B)。

## 为允许混沌实验的命名空间添加注解

在开启 FilterNamespace 功能后，Chaos Mesh 将只会向包含有 `chaos-mesh.org/inject=enabled` 注解的命名空间注入故障。因此，在进行混沌实验之前，你需要为允许混沌实验的命名空间添加该注解，其他命名空间则受到保护不会被注入故障。

可以通过如下 `kubectl` 命令为一个 `namespace` 添加注解：

```bash
kubectl annotate ns $NAMESPACE chaos-mesh.org/inject=enabled
```

其中 `$NAMESPACE` 为命名空间的名字，比如 `default`。如果成功，得到输出如下：

```bash
namespace/$NAMESPACE annotated
```

如果希望删除这一注解，则可以通过以下命令：

```bash
kubectl annotate ns $NAMESPACE chaos-mesh.org/inject-
```

如果成功，得到输出如下：

```bash
namespace/$NAMESPACE annotated
```

## 查看所有允许混沌实验的命名空间

你可以使用以下命令列出所有允许混沌实验的命名空间：

```bash
kubectl get ns -o jsonpath='{.items[?(@.metadata.annotations.chaos-mesh\.org/inject=="enabled")].metadata.name}'
```

此命令将会输出所有包含 `chaos-mesh.org/inject=enabled` 注解的命名空间。示例输出如下：

```bash
default
```
