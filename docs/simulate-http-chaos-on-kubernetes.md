---
title: Simulate HTTP faults
sidebar_label: Simulate HTTP faults
---

This document describes how to simulate HTTP faults by creating HTTPChaos experiments in Chaos Mesh.

## HTTPChaos introduction

HTTPChaos is a fault type provided by Chaos Mesh. By creating HTTPChaos experiments, you can simulate the fault scenarios of the HTTP server during the HTTP request and response processing. Currently, HTTPChaos supports simulating the following fault types:

- `abort`：interrupts server connection.
- `delay`：injects latency into the target process.
- `replace`： replaces part of content in HTTP request or response messages.
- `Patch`：adds additional content to HTTP request or response messages.

HTTPChaos supports combinations of different fault types.  If you have configured multiple HTTP fault types at the same time when creating HTTPChaos experiments, the order set to inject the faults when the experiments start running is `abort` -> `delay` -> `replace` -> `patch`. When the `abort` fault cause short circuits, the connection will be directly interrupted.

For the detailed description of HTTPChaos configuration, see [ Field description](#Field description) below.

## Notes

Before injecting the faults supported by HTTPChaos, note the followings:

- There is no control manager of Chaos Mesh running on the target Pod.
- For HTTPChaos injection to take effect, try to avoid reusing TCP socket client. This is because HTTPChaos does not affect the HTTP requests that are sent via TCP socket before the fault injection.
- Use non-idempotent requests (such as most of the POST requests) with caution in production environments. If such requests are used, the target service may not return to normal status by repeating requests after the fault injection.

## Create experiments

Currently, Chaos Mesh only supports using YAML configuration files to create HTTPChaos experiments. In the YAML files, you can simulate either one HTTP fault type or a comination of different HTTP fault types.

### Example of `abort`

1. Write the experimental configuration to the `http-abort-failure.yaml` file as the example below：

  ```yaml
  apiVersion: chaos-mesh.org/v1alpha1
  kind: HTTPChaos
  metadata:
    name: test-http-chaos
  spec:
    mode: all
    selector:
      labelSelectors:
        app: nginx
    target: Request
    port: 80
    method: GET
    path: /api
    abort: true
    duration: 5m
    scheduler:
      cron: '@every 10m'
  ```

  Based on this configuration example, every 10 minutes, Chaos Mesh will inject the `abort` fault into the specified pod for 5 minutes. During the fault injection, the GET requests sent through port 80 in the `/api` path of the target Pod will be interrupted.

2. After the configuration file is prepared, use `kubectl` to create the experiment:

  ```bash
  kubectl apply -f ./http-abort-failure.yaml
  ```

### Example of fault combinations

1. Write the experimental configuration to `http-failure.yaml` file as the example below：

  ```yaml
  apiVersion: chaos-mesh.org/v1alpha1
  kind: HTTPChaos
  metadata:
    name: test-http-chaos
  spec:
    mode: all
    selector:
      labelSelectors:
        app: nginx
    target: Request
    port: 80
    method: GET
    path: /api/*
    delay: 10s
    replace:
      path: /api/v2/
      method: DELETE
    patch:
      headers:
        - ['Token', '<one token>']
        - ['Token', '<another token>']
      body:
        type: JSON
        value: '{"foo": "bar"}'
    duration: 5m
    scheduler:
      cron: '@every 10m'
  ```

  Based on this configuration example, Chaos Mesh will inject the `delay` fault, `replace` fault, and `patch` fault consecutively.

2. After the configuration file is prepared, use `kubectl` to create the experiment:

  ```bash
  kubtl apply -f ./http-failure.yaml
  ```

## Field description

### Description for common fields

Common fields are meaningful when the `target` of fault injuection is `Request` or `Response`.

Specifies whether the target of fault injuection is `Request` or `Response`. The [target-related fields ](#Description for target-related fields) should be configured at the same time.</td> 

</tr> 

</tbody> </table> 



### Description for `target`-related fields



### `Request`-related fields

The `Request` field is a meaningful when the `target` set to `Request` during the fault injection.

| Parameter         | Type              | Description                                                              | Default value | Required | Example      |
| ----------------- | ----------------- | ------------------------------------------------------------------------ | ------------- | -------- | ------------ |
| replace.path      | string            | Specifies the URI path used to replace content.                          |               | no       | /api/v2/     |
| replace.method`  | string            | Specifies the replaced content of the HTTP request method.               |               | no       | DELETE       |
| replace.queries` | map[string]string | Specifies the replaced key pair of the URI query.                        |               | no       | foo: bar     |
| patch.queries`   | [][]string        | Specifies the attached key pair of the URI query with additional faults. |               | no       | - [foo, bar] |




### `Respond`-related fields

The `Response` is a meaningful when the `target` set to `Response` during the fault injection.

| Parameter      | Type              | Description                                                 | Default value                                 | Required | Example                        |
| -------------- | ----------------- | ----------------------------------------------------------- | --------------------------------------------- | -------- | ------------------------------ |
| code           | int32             | Specifies the status code responded by `target`.            | Takes effect for all status codes by default. | no       | 200                            |
| response_heads | map[string]string | Matches request headers to `target`.                        | Takes effect for all responses by default.    | no       | Content-Type: application/json |
| replace.code   | int32             | Specifies the replaced content of the response status code. |                                               | no       | 404                            |




## Local debugging

If you are not sure of the effects of certain fault injections, you can also test the corresponding features locally using [rs-tproxy](https://github.com/chaos-mesh/rs-tproxy). Chaos Mesh also provides HTTPChaos by using rs-tproxy.
