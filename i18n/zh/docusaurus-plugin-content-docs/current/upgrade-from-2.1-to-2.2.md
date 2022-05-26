---
title: 从 2.1 升级到 2.2
---

在 2.2.0 版本中，Helm Charts 做了一些改变。这个文档将帮助你从 2.1.x 升级到 2.2.0。

## 使用 Helm 升级

### 第 1 步：添加/更新 Chaos Mesh Helm 仓库

添加 Chaos Mesh 到 Helm 仓库并更新：

```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm repo update
```

### 第 2 步：迁移 `values.yaml` 文件

如果你在安装 Chaos Mesh 的时候使用了一个特定的 `values.yaml`，我们建议你应用你的自定义配置到 Chaos Mesh 2.2.0 的 `values.yaml`。

你可以通过这个命令获取默认的 `values.yaml`：

```bash
helm show values chaos-mesh/chaos-mesh --version 2.2.0 > values.yaml
```

如果你不熟悉这些改变过的配置，你可能不会依赖这些特定的功能，忽略他们通常是安全的。

这里是 Helm Chart 改变的列表：

- 新配置: `chaosDaemon.mtls.enabled` 表示在 chaos-controller-manager 和 chaos-daemon 之间使用 mtls.
- 新配置: `webhook.caBundlePEM` 表示用于 webhook 服务的 CA bundle.
- 改变的值: `dashboard.serviceAccount` 从 `chaos-controller-manager` 改为 `chaos-dashboard`.
- 改变的值: `webhook.FailurePolicy` 从 `Ignore` 改为 `Fail`.

:::note 
你可以在 [README](https://github.com/chaos-mesh/chaos-mesh/blob/v2.2.0/helm/chaos-mesh/README.md) 查看 Helm Chart 配置的详细描述。
:::

### 第 3 步：更新 CRD

如果你的 Kubernetes 版本 >= 1.16，你可以使用以下命令更新 Chaos Mesh CRD：

```bash
kubectl replace -f https://mirrors.chaos-mesh.org/v2.2.0/crd.yaml
```

如果你的 Kubernetes 版本 <= 1.15，你可以使用以下命令更新 Chaos Mesh CRD：

```bash
kubectl replace -f https://mirrors.chaos-mesh.org/v2.2.0/crd-v1beta1.yaml
```

:::note 
Chaos Mesh 2.2.x 将会是支持 Kubernetes < 1.19 的最后一系列版本。
:::

### 第 4 步：使用 `helm upgrade` 升级 Chaos Mesh

你可以使用以下命令来升级 Chaos Mesh 到 2.2.0：

```bash
helm upgrade <release-name> chaos-mesh/chaos-mesh --namespace=<namespace> --version=2.2.0 <--other-required-flags>
```

## 询问社区

如果你对升级 Chaos Mesh 有任何问题，请在 [Slack Channel](https://cloud-native.slack.com/archives/C0193VAV272)，GitHub [Issues](https://github.com/chaos-mesh/chaos-mesh/issues/new?assignees=&labels=&template=question.md) 和 [Discussions](https://github.com/chaos-mesh/chaos-mesh/discussions/new) 联系我们。
