---
title: 配置开发环境
---

本文档介绍如何搭建 Chaos Mesh 的开发环境。

## 环境要求

安装 Chaos Mesh 所需的开发工具。

- [golang](https://golang.org/dl/) 版本不低于 v1.15
- [docker](https://www.docker.com/)
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/) 版本不低于 v2.8.2
- [kind](https://github.com/kubernetes-sigs/kind)
- [nodejs](https://nodejs.org/en/) 和 [yarn](https://yarnpkg.com/lang/en/) (以开发 Chaos Dashboard)

## 准备工具链

准备好上述环境后，请按照以下步骤配置用于编译 Chaos Mesh 的工具链。

1. 将 Chaos Mesh 项目克隆至本地。

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   cd chaos-mesh
   ```

2. 确保你的环境中已经安装 [Docker](https://docs.docker.com/install/) 并且正在运行 Docker。

3. 确保 [Docker Registry](https://docs.docker.com/registry/) 正在运行。将环境变量 `DOCKER_REGISTRY` 设置为其地址:

   ```bash
   echo 'export DOCKER_REGISTRY=localhost:5000' >> ~/.bash_profile
   source ~/.bash_profile
   ```

4. 确保 `${GOPATH}/bin` 在你的 `PATH` 环境变量中。

   ```bash
   echo 'export PATH=$(go env GOPATH)/bin:${PATH}' >> ~/.bash_profile
   ```

   ```bash
   source ~/.bash_profile
   ```

5. 检查 Nodejs 相关环境。

   ```bash
    node -v
    yarn -v
   ```

6. 尝试编译 Chaos Mesh：

   ```bash
   make
   ```

   如果没有报错，那么工具链已经配置完毕。

## 准备部署环境

在工具链准备完之后，你还需要启动一个本地的 Kubernetes 集群用于部署 Chaos Mesh。由于 kind 已经安装好了，你可以直接使用以下脚本启动一个 Kubernetes 集群：

```bash
hack/kind-cluster-build.sh
```

当你不再需要此集群，希望删除它时，可以使用：

```bash
kind delete cluster --name=kind
```

如需启动 Chaos Dashboard，请运行以下命令：

```bash
cd ui && yarn
# 启动
yarn workspace @ui/app start:default # cross-env REACT_APP_API_URL=http://localhost:2333 BROWSER=none react-scripts start
```

## 下一步

在完成上述 Chaos Mesh 开发的准备工作后，请尝试[新增混沌实验类型](add-new-chaos-experiment-type.md)。
