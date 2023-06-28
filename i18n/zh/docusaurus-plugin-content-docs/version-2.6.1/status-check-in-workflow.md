---
title: 在工作流中进行状态检查
---

在工作流中，状态检查可对外部系统（比如业务应用系统、监控系统）执行指定的操作来获得系统的状态，并当检查到系统不健康时可以自动地终止工作流，其概念类似于 Kubernetes 中的 `Container Probes`。本文介绍如何通过 YAML 的方式在工作流中进行状态检查。

:::note 提示

当前 `StatusCheck` 节点还不支持在 Dashboard 上创建，只能通过 YAML 方式进行创建。

:::

## 状态检查类型

目前，只支持 `HTTP` 一种方法来进行状态检查。

### 定义一个 `HTTP` 类型的 `StatusCheck` 节点

`StatusCheck` 节点支持对指定的 URL 执行 HTTP `GET` 或 `POST` 请求，可携带自定义的 HTTP headers 和 body，并通过 `criteria` 中的条件来判断请求是否成功。

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
        statusCode: '200'
```

在这个配置文件中，可以看到定义了一个 `HTTP` 类型的 `StatusCheck` 节点。`deadline` 字段指定了该节点最多执行 20 秒。`mode` 字段指定了该 `StatusCheck` 节点会持续性的执行状态检查。`intervalSeconds` 字段指定了重复间隔为 1 秒。`timeoutSeconds` 字段指定了每次执行的超时时间。

当工作流运行到这个节点时，每隔 1 秒会执行一次指定的状态检查行为：使用 `GET` 方法向 `http://123.123.123.123` 这个 URL 进行 HTTP 请求，如果该请求在 1 秒内响应，且状态码为 `200`，则此次执行成功，反之失败。

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
        statusCode: '200'
```

在这个配置文件中，`StatusCheck` 节点会持续性地执行状态检查：

- 当出现连续 1 次及以上“执行结果”为“成功”时，认为“状态检查结果”为成功
- 当出现连续 3 次及以上“执行结果”为“失败”时，认为“状态检查结果”为失败

:::note 提示

下文中，当提到“状态检查失败”时，都指的是“状态检查结果”为失败，而不是单次的“执行结果”为失败。

:::

### 当状态检查不成功时，终止工作流

:::note 提示

目前，`StatusCheck` 节点只支持当状态检查失败时，自动终止工作流。不支持暂停工作流和恢复工作流的功能。

:::

当执行混沌实验时，应用系统可能会变得“不健康”，如果在某些情况下，想通过快速结束混沌实验来恢复应用系统，则可以使用这个功能。在 `StatusCheck` 节点上将 `abortWithStatusCheck` 字段设置为 `true`，那么当状态检查失败时，就会自动的终止工作流。

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
        statusCode: '200'
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
        statusCode: '200'
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
        statusCode: '200'
```

在这个配置文件中，`StatusCheck` 节点每隔 1 秒会执行一次状态检查，当符合以下任意条件时退出：

- 状态检查成功，即出现连续 1 次及以上成功的“执行结果”
- 状态检查失败，即出现连续 3 次及以上失败的“执行结果”
- 20 秒后触发节点超时

## Status Check vs HTTP Request Task

相同点：

- `StatusCheck` 节点和 `HTTP Request Task` 节点（用来执行 HTTP 请求的 `Task` 节点）都属于工作流的一种节点类型
- `StatusCheck` 节点和 `HTTP Request Task` 节点都可以通过 HTTP 请求来获得外部系统的信息

不同点：

- `HTTP Request Task` 节点只能发送一次请求，而不能持续性的发送请求
- `HTTP Request Task` 节点在请求失败时，无法对工作流的执行状态产生影响（比如终止工作流）

## 字段说明

Workflow 和 Template 字段说明参考[创建 Chaos Mesh 工作流](create-chaos-mesh-workflow.md#字段说明)。

### StatusCheck 字段说明

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| mode | `string` | 状态检查的模式，可选值有：`Synchronous`/`Continuous`。 | 无 | 是 | `Synchronous` |
| type | `string` | 状态检查的类型，可选值有：`HTTP`。 | `HTTP` | 是 | `HTTP` |
| duration | `string` | 当失败的执行次数小于 `failureThreshold` 时状态检查的持续时间。对于 `Synchronous` 和 `Continuous` 模式的状态检查都适用。 | 无 | 否 | `100s` |
| timeoutSeconds | `int` | 状态检查单次执行的超时秒数。 | `1` | 否 | `1` |
| intervalSeconds | `int` | 状态检查的间隔时间（秒）。 | `1` | 否 | `1` |
| failureThreshold | `int` | 决定状态检查失败的最小连续失败次数。 | `3` | 否 | `3` |
| successThreshold | `int` | 决定状态检查成功的最小连续成功次数。 | `1` | 否 | `1` |
| recordsHistoryLimit | `int` | 保存历史执行记录的条数。 | `100` | 否 | `100` |
| http | `HTTPStatusCheck` | 配置执行 HTTP 请求的具体细节。 | 无 | 否 |  |

### HTTPStatusCheck 字段说明

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| url | `string` | HTTP 请求的 URL。 | 无 | 是 | `http://123.123.123.123` |
| method | `string` | HTTP 请求的方法，可选值有：`GET`/`POST`。 | `GET` | 否 | `GET` |
| headers | `map[string][]string` | HTTP 请求的请求头。 | 无 | 否 |  |
| body | `string` | HTTP 请求的请求体。 | 无 | 否 | `{"a":"b"}` |
| criteria | `HTTPCriteria` | 定义如何判断 HTTP StatusCheck 执行的结果。 | 无 | 是 |  |

### HTTPCriteria 字段说明

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| statusCode | `string` | HTTP 请求预期的状态码。取值可以是单一的数字（比如 `200`），或者也可以是一个范围（比如 `200-400`，这里，`200` 和 `400` 都被包括在范围内）。 | 无 | 是 | `200` |
