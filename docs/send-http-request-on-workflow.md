---
title: Send HTTP Request on Workflow
---

Chaos Mesh Workflow provides a `Task` node to support any workload, similar to Kubernetes `Job`. To make the user experience more convenient, Chaos Dashboard provides a template based on `Task` to create HTTP requests in WebUI.

:::note

There is no workflow node with type `HTTPRequest` in Chaos Mesh Workflow. This feature is based on `Task` node, so that the user can send HTTP requests more easily.

:::

:::note

This is an experimental feature, the configuration and behavior may change in the future.

:::

## Create HTTP request through Chaos Dashboard

Take sending a message through Slack Webhook as an example, in Chaos Dashboard, you can create an HTTP request through the following steps:

### 1. Create a workflow node with type `HTTPRequest`

Select "HTTP Request" as the task type:

![create-http-request-workflow-node](img/create-http-request-workflow-node.png)

### 2. Configure HTTP request

Configure the node name as `send-slack-message`, the request URL as `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`, the request method as `POST`, and the request body as `{"text": "Hello, world."}` and check "For JSON content".

![configure-http-request-workflow-node](img/configure-http-request-workflow-node.png)

### 3. Submit the workflow node

Click "Submit" button to view the task in preview window:

![http-request-task-node-preview](img/http-request-task-node-preview.png)

## Field Introduction

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| Name | string | Name of Workflow Node |  | Yes | `send-slack-message` |
| URL | string | HTTP Request URL |  | Yes | `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX` |
| Method | string | HTTP Request Method |  | Yes | `POST` |
| Body | string | HTTP Request Body |  | No | `{"text": "Hello, world."}` |
| Follow 301/302 Location | boolean | "Follow 301/302 Location" corresponds to `curl`'s `-L` parameter. | `false` | No | `false` |
| Json Content | boolean | "Json Content" would append HTTP request header with `Content-Type: application/json`. | `false` | No | `false` |

:::note

The generated task node's `name` field value is "name" with a `http-request` suffix.
