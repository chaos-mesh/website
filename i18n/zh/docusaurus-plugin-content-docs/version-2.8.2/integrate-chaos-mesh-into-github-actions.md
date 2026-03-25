---
title: 集成 Chaos Mesh 到 GitHub Actions
---

本文介绍如何使用 chaos-mesh-action 将 Chaos Mesh 集成到 CI 中，帮助你在产品发布前发现在系统开发过程中引入的问题。

chaos-mesh-action 是一个 GitHub action，已经在 [GitHub 市场](https://github.com/marketplace/actions/chaos-mesh)上发布，源代码也在 [GitHub](https://github.com/chaos-mesh/chaos-mesh-action) 上。

## chaos-mesh-action 的设计

[GitHub Action](https://docs.github.com/en/actions) 是 GitHub 原生支持的 CI/CD 功能，通过它你可以轻松地在 GitHub 仓库中构建自动化和自定义的软件开发工作流 (workflow)。

结合 GitHub Action，Chaos Mesh 可以更容易地融入到系统的日常开发和测试中，从而保证每次在 GitHub 上提交的代码没有 bug（至少可以通过测试），不会破坏现有的逻辑。 下图显示了集成到 CI workflow 中的 chaos-mesh-action：

![chaos-mesh-action-integrate-in-the-ci-workflow](./img/chaos-mesh-action-integrate-in-the-ci-workflow.png)

## 在 GitHub workflow 中使用 chaos-mesh-action

chaos-mesh-action 用于 Github workflow。 GitHub workflow 是一个可配置的自动化流程，你可以在你的仓库中设置它，以构建、测试、打包、发布或部署任何 GitHub 项目。 要将 Chaos Mesh 集成到你的 CI 中，请执行以下操作：

- 第 1 步：设计 workflow
- 第 2 步：创建 workflow
- 第 3 步：运行 workflow

### 第 1 步：设计 workflow

在设计 workflow 之前，你必须考虑以下问题：

- 要在此 workflow 中测试哪些功能？
- 要注入哪些类型的故障？
- 如何验证系统的正确性？

例如，让我们设计一个简单的测试 workflow，包括以下步骤：

1. 在 Kubernetes 集群中创建两个 Pod。
2. 从一个 Pod ping 另一个 Pod。
3. 使用 Chaos Mesh 注入网络延迟故障，测试 ping 命令是否收到影响。

### 第 2 步：创建 workflow

在设计好 workflow 之后，请按照以下步骤创建 workflow。

1. 导航到要测试软件的 GitHub 仓库。
2. 开始创建 workflow，点击 `Actions`，然后点击 `New workflow`。

![creating-a-workflow](./img/creating-a-workflow.png)

workflow 本质上是按顺序自动进行的作业配置。 请注意，以下的作业（job）是在单个文件中配置的。 为了更好地说明，本文将脚本拆分为不同的作业组，如下所示：

- 设置 workflow 名称和触发规则

  将 workflow 命名为 “Chaos”。 当代码推送到 master 分支或向 master 分支提交 pull request 时，会触发此 workflow。

  ```yaml
  name: Chaos

  on:
    push:
      branches:
        - master
    pull_request:
      branches:
        - master
  ```

- 安装 CI 相关的环境

  此配置指定操作系统 (Ubuntu)，并使用 helm/kind-action 创建 Kind 集群。 然后，它输出集群的相关信息。最后，它会检出该 workflow 要访问的 GitHub 仓库。

  ```yaml
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - name: Creating kind cluster
          uses: helm/kind-action@v1.0.0-rc.1

        - name: Print cluster information
          run: |
            kubectl config view
            kubectl cluster-info
            kubectl get nodes
            kubectl get pods -n kube-system
            helm version
            kubectl version

        - uses: actions/checkout@v2
  ```

- 部署应用程序

  在以下示例中，此 job 部署了一个应用程序，它会创建两个 Kubernetes Pod。

  ```yaml
  - name: Deploy an application
       run: |
         kubectl apply -f https://raw.githubusercontent.com/chaos-mesh/apps/master/ping/busybox-statefulset.yaml
  ```

- 用 Chaos Mesh 注入故障

  ```yaml
  - name: Run chaos mesh action
      uses: chaos-mesh/chaos-mesh-action@v0.5
      env:
        CHAOS_MESH_VERSION: v1.0.0
        CFG_BASE64: YXBpVmVyc2lvbjogY2hhb3MtbWVzaC5vcmcvdjFhbHBoYTEKa2luZDogTmV0d29ya0NoYW9zCm1ldGFkYXRhOgogIG5hbWU6IG5ldHdvcmstZGVsYXkKICBuYW1lc3BhY2U6IGJ1c3lib3gKc3BlYzoKICBhY3Rpb246IGRlbGF5ICMgdGhlIHNwZWNpZmljIGNoYW9zIGFjdGlvbiB0byBpbmplY3QKICBtb2RlOiBhbGwKICBzZWxlY3RvcjoKICAgIHBvZHM6CiAgICAgIGJ1c3lib3g6CiAgICAgICAgLSBidXN5Ym94LTAKICBkZWxheToKICAgIGxhdGVuY3k6ICIxMG1zIgogIGR1cmF0aW9uOiAiNXMiCiAgc2NoZWR1bGVyOgogICAgY3JvbjogIkBldmVyeSAxMHMiCiAgZGlyZWN0aW9uOiB0bwogIHRhcmdldDoKICAgIHNlbGVjdG9yOgogICAgICBwb2RzOgogICAgICAgIGJ1c3lib3g6CiAgICAgICAgICAtIGJ1c3lib3gtMQogICAgbW9kZTogYWxsCg==
  ```

  通过 chaos-mesh-action，Chaos Mesh 的安装和故障的注入会自动完成。你只需要准备好混沌实验的配置，并获取它的 Base64 值。如果想给 Pod 注入网络延迟，可以使用以下示例配置：

  ```yaml
  apiVersion: chaos-mesh.org/v1alpha1
  kind: NetworkChaos
  metadata:
    name: network-delay
    namespace: busybox
  spec:
    action: delay # the specific chaos action to inject
    mode: all
    selector:
      pods:
        busybox:
          - busybox-0
    delay:
      latency: '10ms'
    duration: '5s'
    scheduler:
      cron: '@every 10s'
    direction: to
    target:
      selector:
        pods:
          busybox:
            - busybox-1
      mode: all
  ```

  使用以下命令获取上述混沌实验配置文件的 Base64 值：

  ```bash
  base64 chaos.yaml
  ```

- 验证系统正确性

  在此 job 中，workflow 从一个 Pod 中 ping 另一个 Pod。请观察网络延迟的变化。

  ```yaml
  - name: Verify
       run: |
         echo "do some verification"
         kubectl exec busybox-0 -it -n busybox -- ping -c 30 busybox-1.busybox.busybox.svc
  ```

### 第 3 步：运行 workflow

创建好 workflow 后，可以通过向 master 分支提交 pull request 来触发它。workflow 运行完成后，验证 job 中输出的结果类似于以下内容：

```log
do some verification
Unable to use a TTY - input is not a terminal or the right kind of file
PING busybox-1.busybox.busybox.svc (10.244.0.6): 56 data bytes
64 bytes from 10.244.0.6: seq=0 ttl=63 time=0.069 ms
64 bytes from 10.244.0.6: seq=1 ttl=63 time=10.136 ms
64 bytes from 10.244.0.6: seq=2 ttl=63 time=10.192 ms
64 bytes from 10.244.0.6: seq=3 ttl=63 time=10.129 ms
64 bytes from 10.244.0.6: seq=4 ttl=63 time=10.120 ms
64 bytes from 10.244.0.6: seq=5 ttl=63 time=0.070 ms
64 bytes from 10.244.0.6: seq=6 ttl=63 time=0.073 ms
64 bytes from 10.244.0.6: seq=7 ttl=63 time=0.111 ms
64 bytes from 10.244.0.6: seq=8 ttl=63 time=0.070 ms
64 bytes from 10.244.0.6: seq=9 ttl=63 time=0.077 ms
……
```

输出显示了一连串的 10 毫秒延迟，每次延迟大约 5 秒（也就是 5 次）。 这与我们使用 chaos-mesh-action 注入的的混沌实验配置一致。

## 探索更多

目前 chaos-mesh-action 已经应用于 [TiDB Operator](https://github.com/pingcap/tidb-operator) 项目，可以在 workflow 中注入 Pod 故障用于验证 Operator 实例的重启功能。 目的是为了保证在注入的故障随机删除 Operator 的 Pod 时，TiDB Operator 能够正常工作。 更多详情可以查看 [TiDB Operator 页面](https://github.com/pingcap/tidb-operator/actions?query=workflow%3Achaos)。

未来，chaos-mesh-action 将被应用到 TiDB 更多的测试中，以保证 TiDB 及相关组件的稳定性。 欢迎使用 chaos-mesh-action 创建自己的 workflow。

如果你发现错误，或者认为缺少某些内容，请随时提交 [issue](https://github.com/pingcap/chaos-mesh/issues)、[pull request(PR)](https://github.com/chaos-mesh/chaos-mesh/pulls)，或加入我们的 [CNCF](https://www.cncf.io/) slack 工作区中的 [#project-chaos-mesh](https://slack.cncf.io/) 频道。
