---
slug: /
title: Chaos Mesh 简介
---

本篇文档描述 Chaos Mesh 的概念、使用场景、核心优势及架构概览。

## 简介

Chaos Mesh 是一个开源的云原生混沌工程平台，提供丰富的故障模拟类型，具有强大的故障场景编排能力，方便用户在开发、测试及生产环境中模拟现实场景中可能出现的各类异常，帮助用户发现系统的潜在问题。为降低混沌工程的使用门槛，Chaos Mesh 提供了完善的可视化操作，用户可以方便地在 Web UI 界面上设计自己的混沌场景，并监控混沌实验的运行状态。

## Chaos Mesh 的核心优势

Chaos Mesh 作为业内领先的混沌测试平台，具备以下核心优势：

- 核心能力稳固：Chaos Mesh 起源于 [TiDB](https://github.com/pingcap/tidb) 的核心测试平台，发布初期即继承了大量 TiDB 已有的测试经验。
- 久经生产验证：Chaos Mesh 被腾讯、美团等众多公司和组织广泛使用，也被纳入 Apache APISIX、RabbitMQ 等众多知名分布式系统的测试体系。
- 系统易用：通过图形化操作和基于 Kubernetes 的使用方式，Chaos Mesh 充分利用了自动化能力。
- 云原生：Chaos Mesh 原生支持 Kubernetes 环境，具备强大的自动化能力。
- 丰富的故障模拟场景：Chaos Mesh 几乎涵盖了分布式测试体系中基础故障模拟的绝大多数场景。
- 灵活的实验编排能力：用户可以通过平台设计自己的混沌实验场景，场景可包含多个混沌实验编排以及应用状态检查。
- 安全性高：Chaos Mesh 设计了多层次的安全控制机制。
- 活跃的社区：Chaos Mesh 是 CNCF 的孵化项目，全球的贡献者和使用者正在不断增长。
- 易于扩展：用户可以轻松地为 Chaos Mesh 添加新的故障测试类型和功能。

## 架构概览

Chaos Mesh 基于 Kubernetes CRD (Custom Resource Definition) 构建，根据不同的故障类型定义多个 CRD 类型，并为不同的 CRD 对象实现单独的 Controller 以管理不同的混沌实验。Chaos Mesh 主要包含以下三个组件:

- **Chaos Dashboard**：Chaos Mesh 的可视化组件，提供了一套用户友好的 Web 界面，用户可通过该界面对混沌实验进行操作和观测。同时，Chaos Dashboard 还提供了 RBAC 权限管理机制。
- **Chaos Controller Manager**：Chaos Mesh 的核心逻辑组件，主要负责混沌实验的调度与管理。该组件包含多个 CRD Controller，例如 Workflow Controller、Schedule Controller 以及各类故障类型的 Controller。
- **Chaos Daemon**：Chaos Mesh 的主要执行组件。Chaos Daemon 以 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 的方式运行，默认拥有 Privileged 权限（可以关闭）。该组件主要通过侵入目标 Pod Namespace 的方式干扰具体的网络设备、文件系统、内核等。

![Architecture](img/architecture.svg)

Chaos Mesh 的整体架构如上图所展示，可以自上而下分为三个部分：

- 用户输入和观测

  用户输入源于 Chaos Dashboard（Web UI 和 HTTP API）或 `kubectl` 等 Kubernetes 客户端，以对 Chaos Mesh 自定义资源的操作（例如 Experiments、Schedule、Workflow、StatusCheck、RemoteCluster）进入 Kubernetes API Server。用户不直接与 Chaos Controller Manager 交互，一切用户操作最终都会反映为某个 Chaos 资源的变更（例如 NetworkChaos 资源的变更）。

- 控制面的监听与调度

  Chaos Controller Manager 从 Kubernetes API Server 监听 Chaos 资源的变更，通过 admission webhook 校验资源并设置默认值，通过 chaos controller 执行故障的注入、监控与恢复，通过 Schedule、Workflow 和 StatusCheck 编排混沌实验，并通过 multi-cluster 控制器向受管理的远端集群派发混沌实验。

- 故障注入与执行

  Chaos Controller Manager 通过 gRPC 控制以特权 DaemonSet 方式运行的 Chaos Daemon，向工作负载和节点资源注入故障，例如运行时、网络、文件系统和内核；同时向云 API（AWS、Azure、GCP）、物理机以及远端集群等外部和远程目标注入故障。
