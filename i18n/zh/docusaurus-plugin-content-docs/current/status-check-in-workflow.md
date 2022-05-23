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

在这个配置文件中，

:::note

下文中，当提到“状态检查失败”时，都指的是“状态检查结果”为失败，而不是单次的“执行结果”为失败。

:::

### 当状态检查失败时，终止 Workflow

当执行混沌实验时，应用系统可能会变得“不健康”，如果在某些情况下，想通过快速结束混沌实验来恢复应用系统，则可以使用这个功能。通过在 `StatusCheck` 节点上设置 `abortWithStatusCheck` 为 `true`，那么，当状态检查失败时，就会自动的终止 Workflow。

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

## 执行模式

### 持续性的状态检查

当 `mode` 为 `Continuous` 时，代表这个 `StatusCheck` 会持续性执行状态检查，直到节点超时退出或者状态检查失败。



### 一次性的状态检查




## Status Check vs HTTP Request Task


## Field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| Name | string | Name of the workflow node |  | Yes | `send-slack-message` |
