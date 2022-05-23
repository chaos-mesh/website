---
title: Status Check in Workflow
---



## Status Check vs HTTP Request Task


## Field description

Workflow 和 Template 字段说明参考[这个文档](./create-chaos-mesh-workflow.md#field-description)。

### StatusCheck field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| mode | string | Defines the execution mode of the status check. Support type: `Synchronous` / `Continuous`. | None | Yes | `Synchronous` |
| type | string | Defines the specific status check type. Support type: `HTTP`. | `HTTP` | Yes | `HTTP` |
| duration | string | The duration of the whole status check if the number of failed execution does not exceed the failure threshold. Duration is available to both `Synchronous` and `Continuous` mode. A duration string is a possibly signed sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms", "-1.5h" or "2h45m". | None | No | `100s` |
| timeoutSeconds | int | The number of seconds after which an execution of status check times out. | `1` | No | `1` |
| intervalSeconds | int | Defines how often (in seconds) to perform an execution of status check. | `1` | No | `1` |
| failureThreshold | int | The minimum consecutive failure for the status check to be considered failed. | `3` | No | `3` |
| successThreshold | int | The minimum consecutive successes for the status check to be considered successful. | `1` | No | `1` |
| recordsHistoryLimit | int | The number of record to retain. | 100 | No | `100` |
| http | HTTPStatusCheck | Defines the execution mode of the status check. Support type: Synchronous / Continuous. | None | No |  |

### HTTPStatusCheck field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| url | string | The URL of the HTTP request. | None | Yes | `http://123.123.123.123` |
| method | string | The method of the HTTP request. | `GET` | No | `GET` |
| headers | map[string][]string | The headers of the HTTP request. | None | No | |
| body | string | The body of the HTTP request. | None | No | `{"a":"b"}` |
| criteria | HTTPCriteria | Defines how to determine the result of the HTTP StatusCheck. | None | Yes |  |

### HTTPCriteria field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| statusCode | string | The expected http status code for the request. A statusCode string could be a single code (e.g. `200`), or an inclusive range (e.g. `200-400`, both `200` and `400` are included). | None | Yes | `200` |