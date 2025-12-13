---
title: Chaosctl
---

Chaosctl 是一个用于辅助调试 Chaos Mesh 的工具。我们希望利用 Chaosctl 简化开发调试新 chaos 类型，以及提交 issue 相关日志的流程。

:::info 注意

在 Chaos Mesh 2.7.3 版本中，您需要手动启用 ctrlserver 才能使用 Chaosctl，默认情况下它是禁用的。

如果您使用 Helm 部署 Chaos Mesh，可以通过将 `enableCtrlServer` 参数设置为 `true` 来启用 ctrlserver。

:::

## 获取 Chaosctl

我们为 Linux 提供了可执行文件。你可以直接下载 Chaosctl：

```bash
curl -sSL https://mirrors.chaos-mesh.org/latest/chaosctl -O
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

Chaosctl 有两类功能，分别是查看日志及调试 Chaos。

### 日志查看

使用 `chaosctl logs` 可以查看所有 Chaos Mesh 组件的日志。`chaosctl logs -h` 会提供关于此功能的帮助和例子。命令示例如下：

```bash
chaosctl logs -t 100 # 输出所有组件的最后100行日志
```

### 调试 Chaos

使用 `chaosctl debug` 可以查看 Chaos 的调试信息。`chaosctl debug -h` 会提供关于此功能的帮助和例子。使用这一功能时，Chaosctl 需要与相应的 chaos-daemon 建立连接，如果你在部署 Chaos Mesh 时关闭了 TLS （默认打开），需要使用 `-i` 选项来告知 Chaosctl 不使用 TLS。命令示例如下：

```bash
./chaosctl debug -i networkchaos web-show-network-delay
```

目前，Chaosctl 只支持 iochaos, networkchaos, stresschaos 三类 Chaos 的调试。

### 为 Chaosd 生成 TLS 证书

当在 Chaosd 和 Chaos Mesh 之间发起请求时，为了保障 Chaosd 和 Chaos-controller-manager 服务之间的通信安全，Chaos Mesh 推荐开启 mTLS (Mutual Transport Layer Security) 模式。

如需开启 mTLS 模式，Chaosd 和 Chaos mesh 的参数中需要配置好 TLS 证书参数。因此，你需要确定 Chaosd 和 Chaos Mesh 已经生成了 TLS 证书后，再把 TLS 证书作为参数启动 Chaosd 和 Chaos Mesh。

- Chaosd：该工具支持在配置 TLS 证书参数前和配置 TLS 证书参数后开始启动。为了保障集群安全，推荐配置 TLS 证书参数**后**，再启动工具。具体信息，请参阅[运行 Chaosd Server](simulate-physical-machine-chaos.md#运行-chaosd-server)。
- Chaos Mesh：当使用 Helm 部署 Chaos Mesh 时，默认配置 TLS 证书参数。

如果你的 Chaosd 没有生成 TLS 证书，可以使用 Chaosctl，通过命令行方便地生成该证书。在以下场景下，Chaosctl 可以通过不同的方案执行命令。

**场景一**：开启 Chaosctl 的运行中的节点可以访问 Kubernetes 集群，并且可以使用 SSH 工具连接到物理机。

在该场景下，仅需通过执行以下命令来完成下列操作：

- 命令：使用 `chaosctl pm init` 命令：

  ```bash
  ./chaosctl pm init pm-name --ip=123.123.123.123 -l arch=amd64,anotherkey=value
  ```

- 操作：上述命令会执行下列操作：

  - 一键生成 Chaosd 所需要的证书，并把证书保存到对应的物理机上；
  - 在 Kubernetes 集群中创建对应的 `PhysicalMachine` 资源。

如需了解更多关于此功能的介绍和例子，请通过 `chaosctl pm init -h` 查阅。

**场景二**：开启 Chaosctl 的运行中的节点可以访问 Kubernetes 集群，但无法使用 SSH 工具连接到物理机。

在该场景下，操作步骤如下：

1. 在执行命令前，先从 Kubernetes 集群中手动获取 CA 证书。命令示例如下：

   ```bash
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-mesh -o "jsonpath={.data['ca\.crt']}" | base64 -d > ca.crt
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-mesh -o "jsonpath={.data['ca\.key']}" | base64 -d> ca.key
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

## 问题反馈

Chaosctl 的代码目前托管于 Chaos Mesh 项目中。更多信息，请参阅 [chaos-mesh/pkg/chaosctl](https://github.com/chaos-mesh/chaos-mesh/tree/release-2.7/pkg/chaosctl) 。

如果在操作的过程中遇到了问题，或有兴趣帮助我们改进这一工具，欢迎在 [CNCF Slack](https://cloud-native.slack.com/archives/C0193VAV272) 向 Chaos Mesh 团队反馈，或者直接在 GitHub 创建一个 [issue](https://github.com/chaos-mesh/chaos-mesh/issues)。

反馈问题时，在问题中附上相关的日志和 Chaos 信息会有助于诊断问题。你可以将 `chaosctl logs` 的输出附在 issue 尾部，以供开发人员参考。如果你的问题与 iochaos, networkchaos, stresschaos 相关，也请附上 `chaosctl debug` 相关信息。
