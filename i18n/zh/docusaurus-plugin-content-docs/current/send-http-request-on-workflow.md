---
title: 在工作流中发送 HTTP 请求
---

Chaos Mesh Workflow 提供了 `Task` 节点以支持任意工作负载，类似于 Kubernetes 中的 `Job`。 为了更方便的用户体验， Chaos Dashboard 提供了一个基于 `Task` 的模板， 可以方便的在 WebUI 中创建 HTTP 请求。

:::note 并不存在类型为 `HTTPRequest` 类型的工作流节点，该特性基于 `Task` 节点，便于用户更方便的发送 HTTP 请求。 :::

:::note 这是一个实验中的特性，其配置与行为可能会在未来的版本中发生变化。 :::

## 通过 Chaos Dashboard 创建 HTTP 请求

以通过 Slack Webhook 发送消息为例，在 Chaos Dashboard 中可以通过以下步骤创建 HTTP 请求：

### 1. 创建类型为 HTTP 请求的工作流节点

在下拉栏中选择 "HTTP 请求" 作为任务类型:

![create-http-request-workflow-node](img/create-http-request-workflow-node_zh.png)

### 2. 配置 HTTP 请求

配置节点名称为`send-slack-message`, 请求地址为 `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX` ，请求方法为 `POST`。填写请求体 `{"text": "Hello, world."}`，并勾选 "为 JSON 内容".

![configure-http-request-workflow-node](img/configure-http-request-workflow-node_zh.png)

### 3. 提交工作流节点

点击“提交”按钮，即可在预览窗口查看创建的任务：

![http-request-task-node-preview](img/http-request-task-node-preview.png)

## 表单字段介绍

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 名称 | string | 节点名称 |  | 是 | `send-slack-message` |
| URL | string | 请求地址 |  | 是 | `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX` |
| 方法 | string | 请求方法 |  | 是 | `POST` |
| 请求体 | string | 请求体 |  | 否 | `{"text": "Hello, world."}` |
| 跟随 301/302 跳转 | boolean | 是否跟随 301/302 跳转 | `false` | 否 | `false` |
| 为 JSON 内容 | boolean | 是否为 JSON 内容 | `false` | 否 | `false` |

:::note 生成的任务节点的 `name` 字段的值为"名称"后加 `http-request` 后缀。 :::

:::note "跟随 301/302 跳转" 对应 `curl` 的 `-L` 参数。 :::

:::note "为 JSON 内容" 会为 HTTP 请求头中加入 `Content-Type: application/json` 。 :::
