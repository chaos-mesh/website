---
title: chaosctl
---

chaosctl 是一个用于辅助调试 Chaos Mesh 的工具。我们希望利用 chaosctl 简化开发调试新 chaos 类型，以及提交 issue 相关日志的流程。

## 获取 chaosctl

我们为 Linux 提供了可执行文件。你可以直接下载 chaosctl：

```bash
curl -sSL https://mirrors.chaos-mesh.org/latest/chaosctl
```

如果你使用 Windows 或 macOS，可以自行从源代码编译。推荐使用 Go 1.15 以上版本进行编译。具体步骤如下：

1. 将 Chaos Mesh 克隆至本地

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   ```

2. 切换至 Chaos Mesh 目录下

3. 执行

   ```bash
   make chaosctl
   ```

   编译得到的可执行文件位于 `bin/chaosctl`

## 功能介绍

chaosctl 有两类功能，分别是查看日志及调试 Chaos。

### 日志查看

使用 `chaosctl logs` 可以查看所有 Chaos Mesh 组件的日志。`chaosctl logs -h` 会提供关于此功能的帮助和例子。命令示例如下：

```bash
chaosctl logs -t 100 # 输出所有组件的最后100行日志
```

### 调试 Chaos

使用 `chaosctl debug` 可以查看 Chaos 的调试信息。`chaosctl debug -h` 会提供关于此功能的帮助和例子。使用这一功能时，chaosctl 需要与相应的 chaos-daemon 建立连接，如果你在部署 Chaos Mesh 时关闭了 TLS （默认打开），需要使用 `-i` 选项来告知 chaosctl 不使用 TLS。命令示例如下：

```bash
./chaosctl debug -i networkchaos web-show-network-delay
```

目前，chaosctl 只支持 iochaos, networkchaos, stresschaos 三类 Chaos 的调试。

### 为 Chaosd 生成 TLS 证书

为了保障 Chaosd 和 Chaos-controller-manager 服务之间的通信安全，Chaos Mesh 推荐开启 mTLS 模式。Chaosctl 可以通过命令行方便地生成 TLS 证书。在不同的场景下，Chaosctl 可以通过以下两种方案执行命令。

**场景一**：通过执行 chaosctl 的节点，可以访问 Kubernetes 集群，且可以使用 SSH 工具连接到物理机

在该场景下，操作步骤如下：

1. 使用 `chaosctl pm init` 命令：

   ```bash
   ./chaosctl pm init pm-name --ip=123.123.123.123 -l arch=amd64,anotherkey=value
   ```
   
   这条命令会执行以下操作：

   + 一键生成 Chaosd 所需要的证书，并把证书保存到对应的物理机上；
   + 在 Kubernetes 集群中创建对应的 `PhysicalMachine` 资源。

   如需了解更多关于此功能的介绍和例子，请通过 `chaosctl pm init -h` 查阅。

**场景二**：通过执行 chaosctl 的节点，可以访问 Kubernetes 集群，且无法使用 SSH 工具连接到物理机

在该场景下，操作步骤如下：

1. 在执行命令前，先从 Kubernetes 集群中手动获取 CA 证书。命令示例如下：

   ```bash
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-testing -o "jsonpath={.data['ca\.crt']}" | base64 -d > ca.crt
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-testing -o "jsonpath={.data['ca\.key']}" | base64 -d> ca.key
   ```
   
2. 执行命令后，把 `ca.crt` 文件和 `ca.key` 文件拷贝到**对应的物理机**上。下文以保存到 `/etc/chaosd/pki` 目录下为例。
   
3. 然后，在**物理机**上，使用 `chaosctl pm generate` 命令，生成 TLS 证书（证书的默认保存路径为 `/etc/chaosd/pki`）。命令示例如下：

   ```bash
   ./chaosctl pm generate --cacert=/etc/chaosd/pki/ca.crt --cakey=/etc/chaosd/pki/ca.key
   ```
   
   如需了解更多关于此功能的介绍和例子，请通过 `chaosctl pm generate -h` 查阅。

4. 最后，在可访问到 Kubernetes 集群的机器上，使用 `chaosctl pm create` 命令，在 Kubernetes 集群中创建 `PhysicalMachine` 资源。命令示例如下：

   ```bash
   ./chaosctl pm create pm-name --ip=123.123.123.123 -l arch=amd64
   ```

   如需了解更多关于此功能的介绍和例子，请通过 `chaosctl pm create -h` 查阅。

## 使用场景

如果你希望提交关于 Chaos Mesh 的问题，在问题中附上相关的日志与 chaos 信息很有帮助。你可以将 `chaosctl logs` 的输出附在 issue 尾部以供开发人员参考。如果你希望提交的问题与 iochaos, networkchaos, stresschaos 有关，那么 `chaosctl debug` 的相关信息也会很有用。

## 开发与改进

chaosctl 的代码目前托管于 Chaos Mesh 项目中，你可以在 [chaos-mesh/pkg/chaosctl](https://github.com/chaos-mesh/chaos-mesh/tree/master/pkg/chaosctl) 找到相关实现。如果你有兴趣帮助我们改进这一工具，可以通过 [Slack](https://cloud-native.slack.com/archives/C0193VAV272) 联系我们，或是在 Chaos Mesh 项目中提出相关 issue 。
