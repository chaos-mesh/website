---
title: 在工作流中发送 HTTP 请求
---

Chaos Mesh Workflow 提供了 `Task` 节点以支持任意工作负载，其功能类似于 Kubernetes 中的 `Job`。 为了提供更好的产品体验，Chaos Dashboard 提供了一个基于 `Task` 的模板。通过此模板，你可以方便地在 WebUI 中创建 HTTP 请求。本文介绍如何通过 Chaos Dashboard 创建 HTTP 请求。

:::note 注意

Chaos Mesh 中不存在属于 `HTTPRequest` 类型的工作流节点。本特性基于 `Task` 节点，用于更方便地发送 HTTP 请求。

:::

:::note 注意

当前该功能为实验特性，不建议在生产环境中使用，其配置与行为可能会在未来的版本中发生变化。

:::

## 通过 Chaos Dashboard 创建 HTTP 请求

你可以通过以下步骤在 Chaos Dashboard 中创建 HTTP 请求，具体操作以通过 Slack Webhook 发送消息为例。

### 第 1 步：创建类型为 HTTP 请求的工作流节点

任务类型选为"HTTP 请求" :

![create-http-request-workflow-node](img/create-http-request-workflow-node_zh.png)

### 第 2 步：配置 HTTP 请求

完成对以下配置的设置：

- 节点名称：`send-slack-message`
- 请求地址：`https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
- 请求方法：`POST`
- 请求体： `{"text": "Hello, world."}`，并勾选 "为 JSON 内容"

![configure-http-request-workflow-node](img/configure-http-request-workflow-node_zh.png)

### 第 3 步：提交工作流节点

点击“提交”按钮，即可在预览窗口查看创建的任务。

![http-request-task-node-preview](img/http-request-task-node-preview.png)

## 表单字段

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 名称 | string | 节点名称 |  | 是 | `send-slack-message` |
| URL | string | 请求地址 |  | 是 | `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX` |
| 方法 | string | 请求方法 |  | 是 | `POST` |
| 请求体 | string | 请求体 |  | 否 | `{"text": "Hello, world."}` |
| 跟随 301/302 跳转 | boolean | 该参数的值对应 `curl` 的 `-L` 参数 | `false` | 否 | `false` |
| 为 JSON 内容 | boolean | 该参数会将`Content-Type: application/json` 添加至 HTTP 请求头 | `false` | 否 | `false` |

生成的任务节点的 `name` 字段的值会把 `http-request` 后缀加到"名称"的后面。
