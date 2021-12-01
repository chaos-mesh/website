---
title: 离线安装
---

import PickVersion from '@site/src/components/PickVersion'

import VerifyInstallation from './common/verify-installation.md'

import QuickRun from './common/quick-run.md'

本篇文档描述如何离线安装 Chaos Mesh。

## 环境准备

在安装前，请先确保离线环境中已经安装 Docker 并部署了 Kubernetes 集群。如果环境尚未准备好，请参考以下链接安装 Docker 并部署 Kubernetes 集群：

- [Docker](https://www.docker.com/get-started)
- [Kubernetes](https://kubernetes.io/docs/setup/)

## 准备安装文件

在离线安装 Chaos Mesh 前，你需要从有外网连接的机器上下载所有 Chaos Mesh 镜像和仓库压缩包，然后将下载的文件拷贝到离线环境中。

### 指定版本号

在有外网连接的机器上，设置 Chaos Mesh 的版本号为环境变量：

<PickVersion>
export CHAOS_MESH_VERSION=latest
</PickVersion>

### 下载 Chaos Mesh 镜像

在有外网连接的机器上，通过已经设置的版本号拉取镜像：

```bash
docker pull ghcr.io/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION}
docker pull ghcr.io/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION}
docker pull ghcr.io/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION}
```

保存镜像为 tar 包：

```bash
docker save ghcr.io/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION} > image-chaos-mesh.tar
docker save ghcr.io/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION} > image-chaos-daemon.tar
docker save ghcr.io/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION} > image-chaos-dashboard.tar
```

:::note 注意

如需模拟 DNS 故障（例如，使 DNS 响应返回随机的错误 IP 地址），请额外拉取 [`pingcap/coredns`](https://hub.docker.com/r/pingcap/coredns) 镜像。

:::

### 下载 Chaos Mesh 仓库压缩包

在有外网连接的机器上，下载 Chaos Mesh 的 zip 包：

```bash
curl -fsSL -o chaos-mesh.zip https://github.com/chaos-mesh/chaos-mesh/archive/refs/heads/master.zip
```

### 拷贝文件

所有安装所需的文件下载完成后，请将这些文件拷贝到离线环境中：

- `image-chaos-mesh.tar`
- `image-chaos-daemon.tar`
- `image-chaos-dashboard.tar`
- `chaos-mesh.zip`

## 安装

将 Chaos Mesh 镜像的 tar 包和仓库的 zip 包拷贝到你的离线环境后，就可以按照以下步骤进行安装。

### 第 1 步：加载 Chaos Mesh 镜像

从 tar 包中加载镜像：

```bash
docker load < image-chaos-mesh.tar
docker load < image-chaos-daemon.tar
docker load < image-chaos-dashboard.tar
```

### 第 2 步：推送镜像至 Registry

:::note 注意

在推送镜像前，请确保离线环境中已经部署 Registry。如果尚未部署，请参考 [Docker Registry](https://docs.docker.com/registry/) 进行部署。

:::

设置 Chaos Mesh 版本和 Registry 地址为环境变量：

<PickVersion className="language-bash">
export CHAOS_MESH_VERSION=latest;
export DOCKER_REGISTRY=localhost:5000
</PickVersion>

标记镜像使其指向 Registry：

```bash
export CHAOS_MESH_IMAGE=$DOCKER_REGISTRY/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION}
export CHAOS_DAEMON_IMAGE=$DOCKER_REGISTRY/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION}
export CHAOS_DASHBOARD_IMAGE=$DOCKER_REGISTRY/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION}
docker image tag ghcr.io/chaos-mesh/chaos-mesh:${CHAOS_MESH_VERSION} $CHAOS_MESH_IMAGE
docker image tag ghcr.io/chaos-mesh/chaos-daemon:${CHAOS_MESH_VERSION} $CHAOS_DAEMON_IMAGE
docker image tag ghcr.io/chaos-mesh/chaos-dashboard:${CHAOS_MESH_VERSION} $CHAOS_DASHBOARD_IMAGE
```

推送镜像至 Registry：

```bash
docker push $CHAOS_MESH_IMAGE
docker push $CHAOS_DAEMON_IMAGE
docker push $CHAOS_DASHBOARD_IMAGE
```

### 第 3 步：使用 Helm 安装

解压 Chaos Mesh 的 zip 包：

```bash
unzip chaos-mesh.zip -d chaos-mesh && cd chaos-mesh
```

创建命名空间：

```bash
kubectl create ns chaos-testing
```

执行 Chaos Mesh 安装命令。在安装命令中，你需要指定 Chaos Mesh 的命名空间和各组件的镜像值：

```bash
helm install chaos-mesh helm/chaos-mesh -n=chaos-testing \
  --set chaosDaemon.image=$CHAOS_DAEMON_IMAGE \
  --set controllerManager.image=$CHAOS_MESH_IMAGE \
  --set dashboard.image=$CHAOS_DASHBOARD_IMAGE
```

## 验证安装

<VerifyInstallation />

## 运行 Chaos 实验

<QuickRun />
