---
title: 将 Chaos Mesh 集成到 GitHub Actions
---

本文介绍如何使用 chaos-mesh-action 将 Chaos Mesh 集成到 CI 中，帮助你在产品发布前发现在系统开发过程中引入的问题。

chaos-mesh-action 是一个 GitHub action，已发布到 [GitHub Marketplace](https://github.com/marketplace/actions/chaos-mesh)，源代码同样托管在 [GitHub](https://github.com/chaos-mesh/chaos-mesh-action) 上。

## chaos-mesh-action 的设计

[GitHub Actions](https://docs.github.com/en/actions) 是 GitHub 原生支持的 CI/CD 功能，借助它，你可以直接在仓库中自动化和自定义软件开发工作流（workflow）。

借助 GitHub Actions，Chaos Mesh 可以更容易地融入系统的日常开发和测试，确保所有提交到 GitHub 的代码没有 bug（至少能通过测试），且不会影响现有的逻辑。下图显示了集成到 CI workflow 中的 chaos-mesh-action：

![chaos-mesh-action-integrate-in-the-ci-workflow](./img/chaos-mesh-action-integrate-in-the-ci-workflow.png)

## 在 GitHub workflow 中使用 chaos-mesh-action

chaos-mesh-action 用于 GitHub workflow。GitHub workflow 是一个可配置的自动化流程，你可以在仓库中设置它，以构建、测试、打包、发布或部署任何 GitHub 项目。要将 Chaos Mesh 集成到你的 CI 中，请按照以下步骤操作：

- 第 1 步：设计 workflow
- 第 2 步：创建 workflow
- 第 3 步：运行 workflow

### 第 1 步：设计 workflow

在设计 workflow 之前，你需要考虑以下问题：

- 要在此 workflow 中测试哪些功能？
- 要注入哪些类型的故障？
- 如何验证系统的正确性？

例如，让我们设计一个简单的测试 workflow，包括以下步骤：

1. 在 Kubernetes 集群中创建两个 Pod。
2. 从一个 Pod ping 另一个 Pod。
3. 使用 Chaos Mesh 注入网络延迟故障，测试 ping 命令是否受到影响。

### 第 2 步：创建 workflow

在设计好 workflow 之后，请按照以下步骤创建 workflow。

1. 导航到要测试软件的 GitHub 仓库。
2. 开始创建 workflow，点击 `Actions`，然后点击 `New workflow`。

![creating-a-workflow](./img/creating-a-workflow.png)

workflow 本质上是按顺序执行的自动化作业配置。请注意，下面的作业（job）是在单个文件中配置的。为了更好地说明，本文将脚本拆分为不同的作业组，如下所示：

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

  此配置指定操作系统（Ubuntu），并使用 helm/kind-action 创建 Kind 集群，然后输出集群的相关信息，最后检出该 workflow 要访问的 GitHub 仓库。

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

  使用 chaos-mesh-action 后，Chaos Mesh 会被自动安装，并自动注入故障。你只需要准备好混沌实验的配置，并获取其 Base64 值。如果想给 Pod 注入网络延迟，可以使用以下示例配置：

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

  在此 job 中，workflow 会从一个 Pod 向另一个 Pod 发送 ping 请求，并观察网络延迟。

  ```yaml
  - name: Verify
       run: |
         echo "do some verification"
         kubectl exec busybox-0 -n busybox -- ping -c 30 busybox-1.busybox.busybox.svc
  ```

### 第 3 步：运行 workflow

创建好 workflow 后，可以通过向 master 分支提交 pull request 来触发它。workflow 运行完成后，验证 job 的输出结果类似于以下内容：

```log
do some verification
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

输出显示了一系列约 10 毫秒的延迟，持续约 5 秒。这与使用 chaos-mesh-action 注入的混沌实验配置一致。

## 探索更多

目前，chaos-mesh-action 已被应用于 [TiDB Operator](https://github.com/pingcap/tidb-operator)。通过在 workflow 中注入 Pod 故障，可以验证 Operator 实例的重启功能。这可以确保当注入的故障随机删除 TiDB Operator 的某个 Pod 时，TiDB Operator 仍能正常工作。更多详情可以查看 [TiDB Operator 页面](https://github.com/pingcap/tidb-operator/actions?query=workflow%3Achaos)。

未来，chaos-mesh-action 将被应用到更多 TiDB 测试中，以保证 TiDB 及相关组件的稳定性。欢迎使用 chaos-mesh-action 创建自己的 workflow。

如果你发现任何问题，或者发现缺少某些信息，欢迎在 Chaos Mesh 仓库中创建 [GitHub issue](https://github.com/chaos-mesh/chaos-mesh/issues) 或 [pull request (PR)](https://github.com/chaos-mesh/chaos-mesh/pulls)。你也可以加入 [CNCF](https://www.cncf.io/) 工作区中的 Slack 频道 [#project-chaos-mesh](https://slack.cncf.io/)。
