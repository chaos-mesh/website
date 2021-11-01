---
title: 支持的版本
---

此页面列出了当前支持的版本的状态、时间表和策略。

每个版本的支持期限为六个月，我们每三个月发布一个新版本。

Our naming scheme mostly follows [Semantic Versioning 2.0.0](https://semver.org/) with `v` prepended to git tags and docker images:
我们的命名方案遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/), 并在 git 标签和 docker 镜像中加入 `v` 前缀:

```plain
v<major>.<minor>.<patch>
```

其中 `<minor>` 表示当前的 `<minor>` 版本，`<patch>` 表示当前的 `<minor>` 版本的补丁数。一个补丁通常是相对于 `<minor>` 版本的小更改。

## Chaos Mesh 的支持状态

| 版本   | 当前支持状态   | 发布日期           | 终止日期*          | 支持的 Kubernetes 版本                           |
| :----- | :------------- | :----------------- | :----------------- | :----------------------------------------------- |
| master | 否，只支持开发 | -                  | -                  | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22   |
| 2.0    | 是             | 2021 年 7 月 23 日 | -                  | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22** |
| 1.2    | 是             | 2021 年 4 月 23 日 | -                  | 1.12, 1.13, 1.14, 1.15                           |
| 1.1    | 否             | 2021 年 1 月 08 日 | 2021 年 7 月 23 日 | 1.12, 1.13, 1.14, 1.15                           |
| 1.0    | 否             | 2021 年 9 月 25 日 | 2021 年 4 月 23 日 | 1.12, 1.13, 1.14, 1.15                           |

*注意，未来的日期是不确定的，可能会发生变化。

**对kubernetes 1.22的支持已（将）在2.0.4版本中提供。

## 即将发布的版本

你可以在[Github Milestones](https://github.com/chaos-mesh/chaos-mesh/milestones)上跟踪我们即将发布的版本。

## 支持策略

我们对每个发布分支的支持窗口是六个月。鉴于我们每三个月就会发布一个新的版本，该支持窗口与最新的两个版本相对应。

我们提供两种类型的支持：

- 社区技术支持
- 安全和错误修复

### 社区技术支持

你可以在 Kubernetes Slack（频道 [#project-chaos-mesh](https://cloud-native.slack.com/archives/C0193VAV272)）或者使用 [GitHub Discussion](https://github.com/chaos-mesh/chaos-mesh/discussions) 向社区请求支持。

### 安全和错误修复

安全问题会尽快修复。它们会被修复到最后两个版本，并会立即为它们创建一个新的补丁版本。

对于增强功能或错误修复，我们会根据需要制作新的补丁版本。

## 我们如何确定支持的 Kubernetes 版本

在 [Chaos Mesh 的支持状态](#chaos-mesh-的支持状态) 部分显示的支持的 Kubernetes 版本列表，取决于 Chaos Mesh 维护者认为支持和测试是合理的。

我们使用 e2e 测试来测试各个版本的 kubernetes 集群的兼容性，我们的测试范围是：

TODO: e2e测试覆盖率表