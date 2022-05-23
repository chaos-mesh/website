---
title: Status Check in Workflow
---

In `Workflow`, status check could execute specified operations to external systems (such as application systems, monitoring systems) to obtain the status of the external system, and can automatically abort the `Workflow` when it is detected that the system is unhealthy. The concept is similar to `Container Probes` in Kubernetes. This article describes how to execute status checks in `Workflow` using yaml.

:::note

Chaos Mesh does not yet support to create `StatusCheck` nodes on Chaos Dashboard, so you could only create `StatusCheck` nodes using yaml for now. 

:::

## Status Check Type

Chaos Mesh only support `HTTP` type to execute status check.

### Define a `HTTP` StatusCheck node

// TODO

## Status Check Result

## Status Check Mode


## Status Check vs HTTP Request Task


## Field description

The describe about Workflow and Template could refer to [Create Chaos Mesh Workflow](create-chaos-mesh-workflow.md#field-description)。

### StatusCheck field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| mode | string | The execution mode of the status check. Support value: `Synchronous` / `Continuous`. | None | Yes | `Synchronous` |
| type | string | The type of the status check. Support value: `HTTP`. | `HTTP` | Yes | `HTTP` |
| duration | string | The duration of the whole status check if the number of failed execution does not exceed the failure threshold. Duration is available to both `Synchronous` and `Continuous` mode. | None | No | `100s` |
| timeoutSeconds | int | The number of seconds after which an execution of status check times out. | `1` | No | `1` |
| intervalSeconds | int | Defines how often (in seconds) to perform an execution of status check. | `1` | No | `1` |
| failureThreshold | int | The minimum consecutive failure for the status check to be considered failed. | `3` | No | `3` |
| successThreshold | int | The minimum consecutive successes for the status check to be considered successful. | `1` | No | `1` |
| recordsHistoryLimit | int | The number of record to retain. | 100 | No | `100` |
| http | HTTPStatusCheck | Configure the detail of HTTP request to execute. | None | No |  |

### HTTPStatusCheck field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| url | string | The URL of the HTTP request. | None | Yes | `http://123.123.123.123` |
| method | string | The method of the HTTP request. Support value: `GET` / `POST`. | `GET` | No | `GET` |
| headers | map[string][]string | The headers of the HTTP request. | None | No | |
| body | string | The body of the HTTP request. | None | No | `{"a":"b"}` |
| criteria | HTTPCriteria | Defines how to determine the result of the HTTP StatusCheck. | None | Yes |  |

### HTTPCriteria field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| statusCode | string | The expected http status code for the request. A statusCode string could be a single code (e.g. `200`), or an inclusive range (e.g. `200-400`, both `200` and `400` are included). | None | Yes | `200` |