---
title: 使用 Helm 安装（生产推荐）
---

import PickVersion from '@site/src/components/PickVersion'

import PickHelmVersion from '@site/src/components/PickHelmVersion'

import VerifyInstallation from './common/verify-installation.md'

import QuickRun from './common/quick-run.md'

本篇文档描述如何在生产环境安装 Chaos Mesh。

## 环境准备

在安装之前，请先确保环境中已经安装 [Helm](https://helm.sh/docs/intro/install/)。

如要查看 Helm 是否已经安装，请执行如下命令：

```bash
helm version
```

以下是预期输出：

```bash
version.BuildInfo{Version:"v3.5.4", GitCommit:"1b5edb69df3d3a08df77c9902dc17af864ff05d1", GitTreeState:"dirty", GoVersion:"go1.16.3"}
```

如果你的实际输出与预期输出一致，表示 Helm 已经成功安装。

:::note 注意

本文中的命令将会使用 Helm v3 来操作 Chaos Mesh。如果你的环境中 Helm 的版本为 v2，请参考[将 Helm v2 迁移到 v3](https://helm.sh/docs/topics/v2_v3_migration/)或按照 v2 的格式进行修改。

:::

## 使用 Helm 安装

### 第 1 步：添加 Chaos Mesh 仓库

在 Helm 仓库中添加 Chaos Mesh 仓库：

```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
```

### 第 2 步：查看可以安装的 Chaos Mesh 版本

执行如下命令显示可以安装的 charts：

```bash
helm search repo chaos-mesh
```

:::note 注意

上述命令会输出最新发布的 chart，如需安装历史版本，请执行如下命令查看所有的版本：

```bash
helm search repo chaos-mesh -l
```

:::

在上述命令完成后，接下来开始安装 Chaos Mesh。

### 第 3 步：创建安装 Chaos Mesh 的命名空间

推荐将 Chaos Mesh 安装在 `chaos-testing` 命名空间下，也可以指定任意命名空间安装 Chaos Mesh：

```bash
kubectl create ns chaos-testing
```

### 第 4 步：在不同环境下安装

由于不同容器运行时的守护进程所监听的 socket path 不同，在安装时需要设置不同的值，可以根据不同的环境来运行如下的安装命令。

#### Docker

```bash
# 默认为 /var/run/docker.sock
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing
```

#### containerd

```bash
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
```

#### K3s

```bash
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/k3s/containerd/containerd.sock
```

#### CRI-O

<PickHelmVersion className="language-bash">{`helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --set chaosDaemon.runtime=crio --set chaosDaemon.socketPath=/var/run/crio/crio.sock --version latest`}</PickHelmVersion>

:::note 注意

如要安装特定版本的 Chaos Mesh，请在 `helm install` 后添加 `--version xxx` 参数，如 `--version v2.0.0`。

:::

## 验证安装

<VerifyInstallation />

## 运行 Chaos 实验

<QuickRun />

## 升级 Chaos Mesh

如要升级 Chaos Mesh，请执行如下命令：

```bash
helm upgrade chaos-mesh chaos-mesh/chaos-mesh
```

:::note 注意

如要升级至特定版本的 Chaos Mesh，请在 `helm upgrade` 后添加 `--version xxx` 参数，如 `--version v2.0.0`。

:::

:::note 注意

如在非 Docker 环境下进行升级，需如[在不同环境下安装](#在不同环境下安装)所述添加相应的参数。

:::

如要修改配置，请根据需要设置不同的值。例如，如下命令会升级并卸载 `chaos-dashboard`：

```bash
helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --set dashboard.create=false
```

:::note 注意

如果想了解更多的值及其相关的用法，请参考[所有的值](https://github.com/chaos-mesh/chaos-mesh/blob/master/helm/chaos-mesh/values.yaml)。

:::

:::caution 警告

目前，Helm 在升级时不会应用最新的 CustomResourceDefinition (CRD)，这可能会导致一些错误的发生。为了避免这种情况，请手动应用最新的 CRD：

<PickVersion>
curl -sSL https://mirrors.chaos-mesh.org/latest/crd.yaml | kubectl replace -f -
</PickVersion>

:::

## 卸载 Chaos Mesh

如要卸载 Chaos Mesh，请执行以下命令：

```bash
helm uninstall chaos-mesh -n chaos-testing
```

## 常见问题解答

### 如何安装最新版本的 Chaos Mesh

Chaos Mesh 仓库中的 `helm/chaos-mesh/values.yaml` 定义了最新版本（master 分支）的镜像。若想安装最新版本的 Chaos Mesh，请执行以下命令：

```bash
# 克隆仓库
git clone https://github.com/chaos-mesh/chaos-mesh.git
cd chaos-mesh

helm install chaos-mesh helm/chaos-mesh -n=chaos-testing
```

### 如何关闭安全模式

安全模式是默认启用的。如需关闭，请在安装或升级时指定 `dashboard.securityMode` 为 `false`：

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --set dashboard.securityMode=false --version latest
</PickHelmVersion>
