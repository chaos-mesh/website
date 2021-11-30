---
title: Send HTTP Requests on Workflow
---

Chaos Mesh Workflow provides a `Task` node to support any workload, similar to Kubernetes `Job`. To make the user experience more convenient, Chaos Dashboard provides a template based on `Task` to create HTTP requests in WebUI.

Chaos Mesh Workflow provides a `Task` node to support any workload, which function is similar to the `Job` in Kubernetes. To provide a better user experience, Chaos Dashboard provides a template based on `Task`. With this template, you can easily create HTTP requests in WebUI. This document describes how to create an HTTP request through Chaos Dashboard.

:::note

Chaos Mesh does *NOT* have the workflow node of the type `HTTPRequest`. This feature is based on `Task` node, and you can send HTTP requests more conveniently by using the feature.

:::

:::note

This feature is currently an experimental feature, so it is not recommended to use this feature in the production environment. The configuration and behavior of the feature might change in the future.

:::

## Create an HTTP request through Chaos Dashboard

You can create an HTTP request in Chaos Dashboard as the following steps that take sending a message through Slack Webhook as an example.

### Step 1. Create a workflow node with the type `HTTPRequest`

Select "HTTP Request" as the task type:

![create-http-request-workflow-node](img/create-http-request-workflow-node.png)

### Step 2. Configure an HTTP request

Configure the followings:
  - node name: `send-slack-message`
  - request URL: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
  - request method: `POST`
  - request body: `{"text": "Hello, world."}` , then check "For JSON content".

![configure-http-request-workflow-node](img/configure-http-request-workflow-node.png)

### Step 3. Submit the workflow node

Click the "Submit" button to see the task in the preview window:

![http-request-task-node-preview](img/http-request-task-node-preview.png)

## Field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| Name | string | Name of the workflow node |  | Yes | `send-slack-message` |
| URL | string | URL of an HTTP request |  | Yes | `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX` |
| Method | string | Method of an HTTP request |  | Yes | `POST` |
| Body | string | Body of an HTTP request |  | No | `{"text": "Hello, world."}` |
| Follow 301/302 Location | boolean | The value of this parameter corresponds to the `-L` parameter of `curl`. | `false` | No | `false` |
| Json Content | boolean | The parameter appends `Content-Type: application/json` to the header of an HTTP request. | `false` | No | `false` |

The value of the `name` field of the generated task node adds the suffix `http-request` to the end of "name".
