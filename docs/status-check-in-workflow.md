---
title: Status Check in Workflow
---

In Workflow, the status check could execute specified operations on external systems, such as application systems and monitoring systems, to obtain their statuses, and automatically abort the Workflow when it finds the system is unhealthy. The concept is similar to `Container Probes` in Kubernetes. This article describes how to execute status checks in Workflow using YAML files.

:::note

Chaos Mesh does not yet support creating `StatusCheck` nodes on Chaos Dashboard, so you could only create `StatusCheck` nodes using YAML for now.

:::

## Status Check type

Chaos Mesh only support the `HTTP` type to execute a status check.

### Define a `HTTP` `StatusCheck` node

A `StatusCheck` node sends `GET` or `POST` HTTP requests to the specific URL, with custom headers and body, and then determines the result of the request by the conditions in the `criteria` field.

```yaml
- name: workflow-status-check
  templateType: StatusCheck
  deadline: 20s
  statusCheck:
    mode: Continuous
    type: HTTP
    intervalSeconds: 1
    timeoutSeconds: 1
    http:
      url: http://123.123.123.123
      method: GET
      criteria:
        statusCode: "200"
```

In the configuration, you can see a `StatusCheck` node with `HTTP` type. The `deadline` field specifies that this node could be executed for a maximum of 20 seconds. The `mode` field specifies that this node will execute status checks continuously. The `intervalSeconds` field specifies a repetition interval of 1 second. The `timeoutSeconds` field specifies the timeout for each execution.

When Workflow runs to this `StatusCheck` node, the specified status check would be executed every second. The status check uses the `GET` method to send an HTTP request to the URL `http://123.123.123.123`. If the response is returned within 1 second and the status code is `200`, this execution succeeds, otherwise it fails.

## Status Check results

Each execution of the status check will get an `execution result`, either `Success` or `Failure`. Because a single `execution result` may not reflect the real situation of the system, due to fluctuations in certain conditions, the final `status check result` is not determined based on a single `execution result`.

The `StatusCheck` node has `failureThreshold` and `successThreshold` two fields:

- When the number of consecutive failed `execution results` exceeds the `failureThreshold`, the `status check result` is considered to be a `Failure`.
- When the number of consecutive successful `execution results` exceeds the `successThreshold`, the `status check result` is considered to be a `Success`.

```yaml
- name: workflow-status-check
  templateType: StatusCheck
  deadline: 20s
  statusCheck:
    mode: Continuous
    type: HTTP
    successThreshold: 1
    failureThreshold: 3
    http:
      url: http://123.123.123.123
      method: GET
      criteria:
        statusCode: "200"
```

In the configuration, the `StatusCheck` node will execute status checks continuously:

- When the `execution result` is `Success` for 1 or more consecutive times, the `status check result` is considered to be a `Success`.
- When the `execution result` is `Failure` for 3 or more consecutive times, the `status check result` is considered to be a `Failure`.

:::note

In the following sections, `status check fails` refers to that `status check result` is `Failure`, rather than a single `execution result` is `Failure`.

:::

### When the Status Check is unsuccessful, abort the Workflow

:::note

The `StatusCheck` node only supports aborting the workflow automatically when the status check is unsuccessful. It could not pause or resume the workflow.

:::

When executing chaos experiments, the application system might become `unhealthy`, this function can be used to restore the application system by quickly ending chaos experiments. To enable the workflow to abort automatically when the status check fails, you can set the `abortWithStatusCheck` field to `true` on the `StatusCheck` node.

```yaml
- name: workflow-status-check
  templateType: StatusCheck
  deadline: 20s
  abortWithStatusCheck: true
  statusCheck:
    mode: Continuous
    type: HTTP
    http:
      url: http://123.123.123.123
      method: GET
      criteria:
        statusCode: "200"
```

The status check is considered unsuccessful when any of the following conditions are met:

- The status check fails.
- When the `StatusCheck` node timeout is exceeded, and the `status check result` is not successful. For example, `successThreshold` is 1, `failureThreshold` is 3, and when the timeout is exceeded, there are 2 consecutive failures and 0 successes. Although it does not meet the condition for "status check fails", it is also considered to be unsuccessful in this case.

## Status Check mode

### Continuous Status Check

When the `mode` field is `Continuous`, it means this `StatusCheck` node will execute status checks continuously until the node times out or the status check fails.

```yaml
- name: workflow-status-check
  templateType: StatusCheck
  deadline: 20s
  statusCheck:
    mode: Continuous
    type: HTTP
    intervalSeconds: 1
    successThreshold: 1
    failureThreshold: 3
    http:
      url: http://123.123.123.123
      method: GET
      criteria:
        statusCode: "200"
```

In the configuration, the `StatusCheck` node will execute status checks every second, and exit when any of the following conditions are met:

- The status check fails, i.e. 3 or more consecutive failed `execution results`
- Trigger the node timeout after 20 seconds

### One time Status Check

When the `mode` field is `Synchronous`, it means that this `StatusCheck` node will exit immediately when the `status check result` is clear, or when the node times out.

```yaml
- name: workflow-status-check
  templateType: StatusCheck
  deadline: 20s
  statusCheck:
    mode: Synchronous
    type: HTTP
    intervalSeconds: 1
    successThreshold: 1
    failureThreshold: 3
    http:
      url: http://123.123.123.123
      method: GET
      criteria:
        statusCode: "200"
```

In the configuration, the `StatusCheck` node will execute status checks every second, and exit when any of the following conditions are met:

- The status check succeeds, i.e. 1 or more consecutive successful `execution results`
- The status check fails, i.e. 3 or more consecutive failed `execution results`
- Trigger the node timeout after 20 seconds

## StatusCheck vs HTTP Request Task

Similarities:

- The `StatusCheck` node and the `HTTP Request Task` node (the `Task` node that executes HTTP requests) are a node type of Workflow.
- The `StatusCheck` node and the `HTTP Request Task` node can obtain information about external systems through HTTP requests.

Differences:

- The `HTTP Request Task` node could only send an HTTP once, and cannot send HTTP requests continuously.
- The `HTTP Request Task` node cannot affect the status of the workflow when the request fails, such as aborting the workflow.

## Field description

For more information about Workflow and Template, refer to [Create Chaos Mesh Workflow](create-chaos-mesh-workflow.md#field-description).

### StatusCheck field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| mode | string | The execution mode of the status check. Support value: `Synchronous`/`Continuous`. | None | Yes | `Synchronous` |
| type | string | The type of the status check. Support value: `HTTP`. | `HTTP` | Yes | `HTTP` |
| duration | string | The duration of the whole status check if the number of failed execution does not exceed the `failureThreshold`. It is available in both `Synchronous` and `Continuous` modes. | None | No | `100s` |
| timeoutSeconds | int | The timeout seconds when the status check fails. | `1` | No | `1` |
| intervalSeconds | int | Defines how often (in seconds) to perform an execution of status check. | `1` | No | `1` |
| failureThreshold | int | The minimum consecutive failure for the status check to be considered failed. | `3` | No | `3` |
| successThreshold | int | The minimum consecutive successes for the status check to be considered successful. | `1` | No | `1` |
| recordsHistoryLimit | int | The number of records to retain. | `100` | No | `100` |
| http | HTTPStatusCheck | Configure the detail of the HTTP request to execute. | None | No |  |

### HTTPStatusCheck field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| url | string | The URL of the HTTP request. | None | Yes | `http://123.123.123.123` |
| method | string | The method of the HTTP request. Support value: `GET`/`POST`. | `GET` | No | `GET` |
| headers | map[string][]string | The headers of the HTTP request. | None | No | |
| body | string | The body of the HTTP request. | None | No | `{"a":"b"}` |
| criteria | HTTPCriteria | Defines how to determine the result of the HTTP StatusCheck. | None | Yes |  |

### HTTPCriteria field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| statusCode | string | The expected http status code for the request. A statusCode string could be a single code (e.g. `200`), or an inclusive range (e.g. `200-400`, both `200` and `400` are included). | None | Yes | `200` |