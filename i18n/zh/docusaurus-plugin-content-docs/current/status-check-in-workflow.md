---
title: 在工作流中进行状态检查
---

在 Workflow 中，状态检查可对外部系统（比如业务应用系统、监控系统）执行指定的操作来获得系统的状态，并当检查到系统不健康时可以自动地终止 Workflow，其概念类似于 Kubernetes 中的 `Container Probes`。本文介绍如果通过 yaml 的方式在 Workflow 中进行状态检查。

:::note

当前“状态检查”节点还不支持在 Dashboard 上创建，只能通过 yaml 方式进行创建。

:::

## 状态检查类型

目前，只支持 `HTTP` 一种方法来进行状态检查。

### 定义一个 `HTTP` 类型的 `StatusCheck` 节点

`StatusCheck` 节点支持对指定的 URL 执行 HTTP GET 或 POST 请求，可携带自定义的 HTTP Headers 和 Body，并通过 `criteria` 中的条件来判断请求是否成功。

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

在这个配置文件中，可以看到定义了一个 `HTTP` 类型的 `StatusCheck` 节点。`deadline` 字段指定了该节点最多执行 20 秒。`mode` 字段指定了该 `StatusCheck` 节点会持续性的执行状态检查。`intervalSeconds` 字段指定了重复间隔为 1 秒。`timeoutSeconds` 字段指定了每次执行的超时时间。

当 Workflow 运行到这个节点时，每隔 1 秒会执行一次指定的状态检查行为：使用 GET 方法向 `http://123.123.123.123` 这个 URL 进行 HTTP 请求，如果该请求在 1s 内响应，且 StatusCode 为 200，则此次执行成功，反之失败。

## 检查结果

每次执行状态检查都将获得一个“执行结果”，Success（成功）或 Failure（失败）。因为单次“执行结果”可能会因为某些条件的波动，并不能反映系统的真实情况，所以最终的“状态检查结果”并不根据单次的“执行结果”来决定。

`StatusCheck` 节点中有 `failureThreshold`（失败阈值） 和 `successThreshold`（成功阈值） 两个字段：

- 当出现连续的失败“执行结果”次数超过失败阈值时，则认为“状态检查结果”为失败。当“状态检查结果”为失败时，会直接结束当前 `StatusCheck` 节点的执行。
- 当出现连续的成功“执行结果”次数超过成功阈值时，则认为“状态检查结果”为成功。

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

在这个配置文件中，`StatusCheck` 节点会持续性地执行状态检查：

- 当出现连续 1 次及以上“执行结果”为“成功”时，认为“状态检查结果”为成功
- 当出现连续 3 次及以上“执行结果”为“失败”时，认为“状态检查结果”为失败

:::note

下文中，当提到“状态检查失败”时，都指的是“状态检查结果”为失败，而不是单次的“执行结果”为失败。

:::

### 当状态检查不成功时，终止 Workflow

:::note

目前，`StatusCheck` 节点只支持当状态检查失败时，自动终止 Workflow。不支持暂停 Workflow 和恢复 Workflow 的功能。

:::

当执行混沌实验时，应用系统可能会变得“不健康”，如果在某些情况下，想通过快速结束混沌实验来恢复应用系统，则可以使用这个功能。在 `StatusCheck` 节点上将 `abortWithStatusCheck` 字段设置为 `true`，那么当状态检查失败时，就会自动的终止 Workflow。

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

当符合以下任意条件时，就认为是状态检查不成功：

- 状态检查失败
- 当达到 `StatusCheck`节点超时时间时，状态检查结果不是“成功”。比如 `successThreshold` 为 1，`failureThreshold` 为 3，而当达到超时时间时，当前连续出现 2 次失败，0 次成功，虽然不符合状态检查失败的条件，但在这种情况下也被认为状态检查不成功。

## 执行模式

### 持续性的状态检查

当 `mode` 字段为 `Continuous` 时，代表这个 `StatusCheck` 节点会持续性地执行状态检查，直到节点超时退出或者状态检查失败。

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

在这个配置文件中，`StatusCheck` 节点每隔 1 秒会执行一次状态检查，当符合以下任意条件时退出：

- 状态检查失败，即出现连续 3 次及以上失败的“执行结果”
- 20 秒后触发节点超时

### 一次性的状态检查

当 `mode` 字段为 `Synchronous` 时，代表这个 `StatusCheck` 节点会在明确状态检查结果时立即退出，或当节点超时时退出。

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

在这个配置文件中，`StatusCheck` 节点每隔 1 秒会执行一次状态检查，当符合以下任意条件时退出：

- 状态检查成功，即出现连续 1 次及以上成功的“执行结果”
- 状态检查失败，即出现连续 3 次及以上失败的“执行结果”
- 20 秒后触发节点超时

## Status Check vs HTTP Request Task

相同点：

- `StatusCheck` 节点和 `HTTP Request Task` 节点（用来执行 HTTP 请求的 `Task` 节点）都属于 Workflow 的一种节点类型
- `StatusCheck` 节点和 `HTTP Request Task` 节点都可以通过 HTTP 请求来获得外部系统的信息

不同点：

- `HTTP Request Task` 节点只能发送一次请求，而不能持续性的发送请求
- `HTTP Request Task` 节点在请求失败时，无法对 Workflow 的执行状态产生影响（比如终止 Workflow）

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