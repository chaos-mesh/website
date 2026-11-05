---
title: 配置开发环境
---

本文档介绍如何搭建 Chaos Mesh 的本地开发环境。

Chaos Mesh 的大多数组件**仅面向 Linux 设计**，因此我们建议你也在 Linux 上配置开发环境。例如，可以使用虚拟机或 WSL 2，并使用 VS Code Remote 作为编辑器。

本文档假定你使用 Linux，且不针对特定 Linux 发行版。如果你坚持使用 Windows/macOS，可能需要一些额外的技巧才能让环境正常工作（例如，某些 make 目标可能会因环境不同而执行失败）。

## 环境要求

开始配置之前，建议你先安装以下开发工具，其中大多数可能已经安装在你的环境中：

- [make](https://www.gnu.org/software/make/)
- [docker](https://docs.docker.com/install/)
- [golang](https://go.dev/doc/install)，`v1.18` 或更高版本
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/)，`v3.9.0` 或更高版本
- [minikube](https://minikube.sigs.k8s.io/docs/start/)

可选：

- [nodejs](https://nodejs.org/en/) 和 [pnpm](https://pnpm.io/)，用于开发 Chaos Dashboard

## 编译 Chaos Mesh

安装完成后，按照以下步骤编译 Chaos Mesh。

1. 将 Chaos Mesh 代码仓库克隆到本地：

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   cd chaos-mesh
   ```

2. 确保 [Docker](https://docs.docker.com/install/) 已安装并正在运行。

   :::info

   Chaos Mesh 依赖 Docker 来构建容器镜像，这是为了与生产环境保持一致。

   :::

3. 编译 Chaos Mesh：

   ```bash
   UI=1 make image
   ```

   :::tip

   `UI=1` 表示还会同时编译 Chaos Dashboard 的用户界面。如果你不需要它，可以省略这个环境变量。

   :::

   :::tip

   如果你想指定镜像的 tag，可以使用 `UI=1 make IMAGE_TAG=dev image`。

   :::

   编译完成后，你应该会得到以下容器镜像：
   - `ghcr.io/chaos-mesh/chaos-dashboard:latest`
   - `ghcr.io/chaos-mesh/chaos-mesh:latest`
   - `ghcr.io/chaos-mesh/chaos-daemon:latest`

## 在本地 minikube Kubernetes 集群中运行 Chaos Mesh

编译完成后，你现在可以在本地 Kubernetes 集群中运行 Chaos Mesh。

1. 使用 minikube 启动一个本地 Kubernetes 集群：

   ```bash
   minikube start
   ```

2. 将容器镜像加载进 minikube：

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   ```

3. 使用 Helm 安装 Chaos Mesh：

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh -n=chaos-mesh-debug --create-namespace
   ```

:::tip

`minikube image load` 会花费较长时间。这里有一个小技巧，可以避免在开发过程中反复加载镜像：使用 minikube 节点中的 Docker，而不是宿主机上的 Docker。

```bash
minikube start --mount --mount-string "$(pwd):$(pwd)"
eval $(minikube -p minikube docker-env)
UI=1 make image
```

:::

## 在本地环境中调试 Chaos Mesh

我们可以使用 [delve](https://github.com/go-delve/delve) 配合远程调试，在本地环境中调试 Chaos Mesh。

1. 使用 `DEBUGGER=1` 编译 Chaos Mesh：

   ```bash
   UI=1 DEBUGGER=1 make image
   ```

2. 将容器镜像加载进 minikube：

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   ```

3. 安装 Chaos Mesh 并启用远程调试：

   ```bash
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh -n=chaos-mesh-debug --create-namespace --set chaosDlv.enable=true --set controllerManager.leaderElection.enabled=false
   ```

   :::note

   为保证高可用，Chaos Mesh 默认启用 leader election，并会创建三个 `chaos-controller-manager` 副本。设置 `controllerManager.leaderElection.enabled=false` 会让 Chaos Mesh 只创建一个 `chaos-controller-manager` 副本，从而更易于调试。

   更多细节请参见 [在不同环境中安装 Chaos Mesh](production-installation-using-helm.mdx#step-4-install-chaos-mesh-in-different-environments)。

   :::

4. 设置端口转发并配置 IDE 连接远程调试器：

   我们可以使用 `kubectl port-forward` 将 delve 调试服务转发到本地端口。

   例如，如果我们要调试 `chaos-controller-manager`，可以运行以下命令：

   ```bash
   kubectl -n chaos-mesh-debug port-forward chaos-controller-manager-766dc8488d-7n5bq 58000:8000
   ```

   然后就可以通过 `127.0.0.1:58000` 访问远程的 delve 调试服务。

   :::info

   Pod 中的调试服务总是监听 `8000` 端口，这是一个约定，你可以在 Helm chart 模板中找到它。

   :::

   然后我们可以配置自己常用的 IDE 连接远程调试器，下面是一些示例：
   - 对于 GoLand，参见 [Attach to running Go processes with the debugger#Attach to a process on a remote machine](https://www.jetbrains.com/help/go/attach-to-running-go-processes-with-debugger.html#attach-to-a-process-on-a-remote-machine)。

   - 对于 VS Code，参见 [vscode-go - Debugging#Remote Debugging](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#remote-debugging)。

更多详细信息请参见 [README.md for container image chaos-dlv](https://github.com/chaos-mesh/chaos-mesh/blob/master/images/chaos-dlv/README.md)。

## 下一步

完成上述准备工作后，你可以尝试[新增混沌实验类型](add-new-chaos-experiment-type.md)。

## FAQ

### 在 macOS 上运行 `make` 时报错 `error obtaining VCS status: exit status 128`

原因与 https://github.blog/2022-04-12-git-security-vulnerability-announced/ 有关。建议你先阅读该文章。

Chaos Mesh 会以当前用户身份启动容器（`dev-env` 或 `build-env`）（当你调用 `make` 时）。你可以在 [get_env_shell.py#L81C10-L81C10](https://github.com/chaos-mesh/chaos-mesh/blob/813b650c02e0b065ae5c4707725c346929ab1847/build/get_env_shell.py#L81C10-L81C10) 中找到相应的 `--user` 参数。因此，当 Git 查找顶层的 `.git` 目录时，如果目录遍历过程中所有权从当前用户发生变化，它就会停止。

目前一个临时解决方案是注释掉 `--user` 这一行。
