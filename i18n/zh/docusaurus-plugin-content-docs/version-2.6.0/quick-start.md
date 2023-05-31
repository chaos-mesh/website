---
title: 快速试用
---

import PickVersion from '@site/src/components/PickVersion'

import VerifyInstallation from './common/verify-installation.md'

import QuickRun from './common/quick-run.md'

本篇文档描述如何在测试环境或本机环境快速试用 Chaos Mesh。

:::caution 注意

**在本文档中，Chaos Mesh 是通过脚本安装的，仅供快速试用。**

如果需要在生产环境或者是其他严格的非测试场景下安装，推荐使用 [Helm](https://helm.sh/)。详情请参考[使用 Helm 安装](production-installation-using-helm.md)。

:::

## 环境准备

在试用之前，请先确保环境中已经部署 Kubernetes 集群。如果尚未部署 Kubernetes 集群，可以参考以下链接完成部署：

- [Kubernetes](https://kubernetes.io/docs/setup/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
- [K3s](https://rancher.com/docs/k3s/latest/en/quick-start/)
- [Microk8s](https://microk8s.io/)

## 快速安装

要在试用环境中安装 Chaos Mesh，请运行以下脚本：

<PickVersion className="language-bash">
curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash
</PickVersion>

:::note 注意

- 如果当前环境为 [kind](https://kind.sigs.k8s.io/)，请在脚本后添加 `--local kind` 参数。

  <PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --local kind
  </PickVersion>

  若需要指定 kind 版本，请在脚本后添加 `--kind-version xxx` 参数，如：

  <PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --local kind --kind-version v0.10.0
  </PickVersion>

- 如果当前环境为 [K3s](https://k3s.io/)，请在脚本后添加 `--k3s` 参数。

  <PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --k3s
  </PickVersion>

- 如果当前环境为 [Microk8s](https://microk8s.io/)，请在脚本后添加 `--microk8s` 参数。

  <PickVersion className="language-bash">
  curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --microk8s
  </PickVersion>

:::

运行此安装脚本后，Chaos Mesh 将会自动安装与版本相符的 CustomResourceDefinition (CRD)、所有需要的组件、及相关的 Service Account 配置。

如果想了解更多的安装细节，请参考 [`install.sh` 的源代码](https://github.com/chaos-mesh/chaos-mesh/blob/master/install.sh)。

## 验证安装

<VerifyInstallation />

## 运行 Chaos 实验

<QuickRun />

## 卸载 Chaos Mesh

如要卸载 Chaos Mesh，请执行以下命令：

<PickVersion className="language-bash">
curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash -s -- --template | kubectl delete -f -
</PickVersion>

也可以通过删除 `chaos-mesh` 命名空间直接卸载 Chaos Mesh：

```sh
kubectl delete ns chaos-mesh
```

## 常见问题解答

### 为什么安装后根目录会出现 `local` 目录

如果当前环境并没有安装 kind 但你在安装命令中使用了 `--local kind` 参数，`install.sh` 安装脚本将会自动安装 kind 到根目录下的 `local` 目录中。
