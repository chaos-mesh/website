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

## 使用场景

如果你希望提交关于 Chaos Mesh 的问题，在问题中附上相关的日志与 chaos 信息很有帮助。你可以将 `chaosctl logs` 的输出附在 issue 尾部以供开发人员参考。如果你希望提交的问题与 iochaos, networkchaos, stresschaos 有关，那么 `chaosctl debug` 的相关信息也会很有用。

## 开发与改进

chaosctl 的代码目前托管于 Chaos Mesh 项目中，你可以在 [chaos-mesh/pkg/chaosctl](https://github.com/chaos-mesh/chaos-mesh/tree/master/pkg/chaosctl) 找到相关实现。如果你有兴趣帮助我们改进这一工具，可以通过 [Slack](https://cloud-native.slack.com/archives/C0193VAV272) 联系我们，或是在 Chaos Mesh 项目中提出相关 issue 。
