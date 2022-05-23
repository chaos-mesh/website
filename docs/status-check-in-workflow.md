---
title: Status Check in Workflow
---



## Step 1: 

## Step 2: 


:::note

Chaos Mesh does *NOT* have the workflow node of the type `HTTPRequest`. This feature is based on `Task` node, and you can send HTTP requests more conveniently by using the feature.

:::

## Status Check vs HTTP Request Task

- Workflow HTTP Request Task is an instant request, not a continuous request
- Workflow HTTP Request Task can not stop the workflow

## Field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| Name | string | Name of the workflow node |  | Yes | `send-slack-message` |
