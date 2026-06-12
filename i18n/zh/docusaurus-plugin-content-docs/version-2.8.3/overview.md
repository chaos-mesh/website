---
slug: /
title: Chaos Mesh 简介
---

本篇文档描述 Chaos Mesh 的概念、使用场景、核心优势、以及架构概览。

## 简介

Chaos Mesh 是一个开源的云原生混沌工程平台，提供丰富的故障模拟类型，具有强大的故障场景编排能力，方便用户在开发测试中以及生产环境中模拟现实世界中可能出现的各类异常，帮助用户发现系统潜在的问题。Chaos Mesh 提供完善的可视化操作，旨在降低用户进行混沌工程的门槛。用户可以方便地在 Web UI 界面上设计自己的混沌场景，以及监控混沌实验的运行状态。

## Chaos Mesh 的核心优势

Chaos Mesh 作为业内领先的混沌测试平台，具备以下核心优势：

- 核心能力稳固：Chaos Mesh 起源于 [TiDB](https://github.com/pingcap/tidb) 的核心测试平台，发布初期即继承了大量 TiDB 已有的测试经验。
- 被充分验证：Chaos Mesh 被众多公司以及组织所使用，例如腾讯和美团等；同时被用于众多知名分布式系统的测试体系中，例如 Apache APISIX 和 RabbitMQ 等。
- 系统易用性强：图形化操作和基于 Kubernetes 的使用方式，充分利用了自动化能力。
- 云原生：Chaos Mesh 原生支持 Kubernetes 环境，提供了强悍的自动化能力。
- 丰富的故障模拟场景：Chaos Mesh 几乎涵盖了分布式测试体系中基础故障模拟的绝大多数场景。
- 灵活的实验编排能力：用户可以通过平台设计自己的混沌实验场景，场景可包含多个混沌实验编排，以及应用状态检查等。
- 安全性高：Chaos Mesh 具有多层次安全控制设计，提供高安全性。
- 活跃的社区：Chaos Mesh 为全球知名开源混沌测试平台，CNCF 开源基金会孵化项目。
- 强大的扩展能力：Chaos Mesh 为故障测试类型扩展和功能扩展提供了充分的扩展能力。

## 架构概览

Chaos Mesh 基于 Kubernetes CRD (Custom Resource Definition) 构建，根据不同的故障类型定义多个 CRD 类型，并为不同的 CRD 对象实现单独的 Controller 以管理不同的混沌实验。Chaos Mesh 主要包含以下三个组件:

- **Chaos Dashboard**：Chaos Mesh 的可视化组件，提供了一套用户友好的 Web 界面，用户可通过该界面对混沌实验进行操作和观测。同时，Chaos Dashboard 还提供了 RBAC 权限管理机制。
- **Chaos Controller Manager**：Chaos Mesh 的核心逻辑组件，主要负责混沌实验的调度与管理。该组件包含多个 CRD Controller，例如 Workflow Controller、Scheduler Controller 以及各类故障类型的 Controller。
- **Chaos Daemon**：Chaos Mesh 的主要执行组件。Chaos Daemon 以 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 的方式运行，默认拥有 Privileged 权限（可以关闭）。该组件主要通过侵入目标 Pod Namespace 的方式干扰具体的网络设备、文件系统、内核等。

![Architecture](img/architecture.png)

Chaos Mesh 的整体架构如上图所展示，可以自上而下分为三个部分：

- 用户输入和观测的部分。用户输入以用户操作 (User) 为起点到达 Kubernetes API Server。用户不直接和 Chaos Mesh 的 Controller 交互，一切用户操作最终都将反映为某个 Chaos 资源的变更（比如 NetworkChaos 资源的变更）。
- 监听资源变化、调度工作流和开展混沌实验的部分。Chaos Mesh 的 Controller 只接受来自 Kubernetes API Server 的事件，这种事件描述某个 Chaos 资源的变更，例如新的工作流对象或者 Chaos 对象被创建。
- 具体节点故障的注入部分。该部分主要由 Chaos Daemon 组件负责，接受来自 Chaos Controller Manager 组件的指令，侵入到目标 Pod 的 Namespace 下，执行具体的故障注入。例如设置 TC 网络规则，启动 stress-ng 进程抢占 CPU 或内存资源等。
