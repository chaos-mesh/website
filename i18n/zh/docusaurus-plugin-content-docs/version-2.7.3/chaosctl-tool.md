---
title: Chaosctl
---

Chaosctl 是一个用于辅助调试 Chaos Mesh 的工具。借助 Chaosctl，你可以简化开发和调试新 chaos 类型的流程，并在提交 issue 时为其他开发者提供参考。

:::info

在 Chaos Mesh 2.7.3 版本中，你需要手动启用 ctrlserver 才能使用 Chaosctl，默认情况下它是禁用的。

如果你使用 Helm 部署 Chaos Mesh，可以通过将 `enableCtrlServer` 参数设置为 `true` 来启用 ctrlserver。

:::

## 获取 Chaosctl

如果你使用 Linux，可以直接下载 Chaosctl 的可执行文件：

```bash
curl -sSL https://mirrors.chaos-mesh.org/latest/chaosctl -O
```

如果你使用 Windows 或 macOS，可以自行从源代码编译。建议使用 Go v1.15 或以上版本进行编译。具体步骤如下：

1. 将 Chaos Mesh 克隆至本地

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   ```

2. 切换至 Chaos Mesh 目录下

3. 执行以下命令：

   ```bash
   make chaosctl
   ```

   编译得到的可执行文件位于 `bin/chaosctl`。

## 功能介绍

Chaosctl 有两类功能，分别是查看日志及调试 Chaos。

### 日志查看

使用 `chaosctl logs` 命令可以打印所有 Chaos Mesh 组件的日志。`chaosctl logs -h` 可以查看该功能的帮助信息和示例。命令示例如下：

```bash
chaosctl logs -t 100 # 打印所有组件的最后 100 行日志
```

### 调试 Chaos

使用 `chaosctl debug` 命令可以查看调试信息。`chaosctl debug -h` 可以查看该功能的帮助信息和示例。使用此功能时，Chaosctl 需要与相应的 `chaos-daemon` 建立连接。如果你在部署 Chaos Mesh 时禁用了 TLS（默认启用），需要使用 `-i` 选项告知 Chaosctl 未使用 TLS。命令示例如下：

```bash
./chaosctl debug -i networkchaos web-show-network-delay
```

目前，Chaosctl 只支持对 IOChaos、NetworkChaos 和 StressChaos 三类 Chaos 的调试。

### 为 Chaosd 生成 TLS 证书

当在 Chaosd 和 Chaos Mesh 之间发起请求时，为了保障 Chaosd 和 Chaos-controller-manager 服务之间的通信安全，Chaos Mesh 推荐开启 mTLS（Mutual Transport Layer Security）模式。

要启用 mTLS 模式，需要在 Chaosd 和 Chaos Mesh 中配置 TLS 证书参数。因此，请确保 Chaosd 和 Chaos Mesh 都已生成 TLS 证书，然后再将 TLS 证书作为参数启动 Chaosd 和 Chaos Mesh。

- Chaosd：你可以在配置 TLS 证书参数之前**或**之后启动 Chaosd。为了保障集群安全，建议先配置 TLS 证书参数，再启动 Chaosd。具体信息，请参阅[运行 Chaosd Server](simulate-physical-machine-chaos.md#运行-chaosd-server)。
- Chaos Mesh：当使用 Helm 部署 Chaos Mesh 时，默认配置 TLS 证书参数。

如果你的 Chaosd 没有生成 TLS 证书，可以使用 Chaosctl 通过命令行方便地生成该证书。在以下使用场景中，Chaosctl 会通过不同的方式执行命令。

**场景一**：运行 Chaosctl 的节点可以访问 Kubernetes 集群，并且可以通过 SSH 工具连接到物理机。

在该场景下，仅需通过执行以下命令来完成下列操作：

- 命令：使用 `chaosctl pm init` 命令：

  ```bash
  ./chaosctl pm init pm-name --ip=123.123.123.123 -l arch=amd64,anotherkey=value
  ```

- 操作：上述命令会执行下列操作：

  - 生成 Chaosd 所需的证书，并将其保存到对应的物理机上；
  - 在 Kubernetes 集群中创建对应的 `PhysicalMachine` 资源。

如需了解更多关于此功能的介绍和例子，请通过 `chaosctl pm init -h` 查阅。

**场景二**：运行 Chaosctl 的节点可以访问 Kubernetes 集群，但无法通过 SSH 工具连接到物理机。

在该场景下，操作步骤如下：

1. 在执行命令前，先从 Kubernetes 集群中手动获取 CA 证书。命令示例如下：

   ```bash
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-mesh -o "jsonpath={.data['ca\.crt']}" | base64 -d > ca.crt
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-mesh -o "jsonpath={.data['ca\.key']}" | base64 -d > ca.key
   ```

2. 将 `ca.crt` 和 `ca.key` 文件复制到**对应的物理机**上。下文以保存到 `/etc/chaosd/pki` 目录下为例。
3. 然后，在**物理机**上，使用 `chaosctl pm generate` 命令，生成 TLS 证书（证书的默认保存路径为 `/etc/chaosd/pki`）。命令示例如下：

   ```bash
   ./chaosctl pm generate --cacert=/etc/chaosd/pki/ca.crt --cakey=/etc/chaosd/pki/ca.key
   ```

   如需了解更多关于此功能的介绍和例子，请通过 `chaosctl pm generate -h` 查阅。

4. 最后，在可以访问 Kubernetes 集群的机器上，使用 `chaosctl pm create` 命令在 Kubernetes 集群中创建 `PhysicalMachine` 资源。命令示例如下：

   ```bash
   ./chaosctl pm create pm-name --ip=123.123.123.123 -l arch=amd64
   ```

   如需了解更多关于此功能的介绍和例子，请通过 `chaosctl pm create -h` 查阅。

## 问题反馈

Chaosctl 的代码目前托管于 Chaos Mesh 项目中。更多信息，请参阅 [chaos-mesh/pkg/chaosctl](https://github.com/chaos-mesh/chaos-mesh/tree/release-2.7/pkg/chaosctl)。

如果在操作的过程中遇到了问题，或有兴趣帮助我们改进这一工具，欢迎在 [CNCF Slack](https://cloud-native.slack.com/archives/C0193VAV272) 向 Chaos Mesh 团队反馈，或者直接在 GitHub 创建一个 [issue](https://github.com/chaos-mesh/chaos-mesh/issues)。

反馈问题时，附上相关的日志和 Chaos 信息会有助于诊断问题。建议你在提问时附上 `chaosctl logs` 的输出结果，以供开发者参考。如果你的问题与 IOChaos、NetworkChaos 或 StressChaos 相关，附上 `chaosctl debug` 的输出也有助于诊断问题。
