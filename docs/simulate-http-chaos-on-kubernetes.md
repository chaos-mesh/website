---
title: Simulate HTTP faults
sidebar_label: Simulate HTTP faults
---

This document describes how to simulate HTTP faults by creating HTTPChaos experiments in Chaos Mesh.

## HTTPChaos introduction

HTTPChaos is a fault type provided by Chaos Mesh. By creating HTTPChaos experiments, you can simulate the fault scenarios of the HTTP server during the HTTP request and response processing. Currently, HTTPChaos supports simulating the following fault types:

- `abort`: interrupts server connection
- `delay`: injects latency into the target process
- `replace`: replaces part of content in HTTP request or response messages
- `patch`: adds additional content to HTTP request or response messages

HTTPChaos supports combinations of different fault types. If you have configured multiple HTTP fault types at the same time when creating HTTPChaos experiments, the order set to inject the faults when the experiments start running is `abort` -> `delay` -> `replace` -> `patch`. When the `abort` fault cause short circuits, the connection will be directly interrupted.

For the detailed description of HTTPChaos configuration, see [Field description](#Field-description) below.

## Notes

Before injecting the faults supported by HTTPChaos, note the followings:

- There is no control manager of Chaos Mesh running on the target Pod.
- HTTPS accesses should be disabled, because injecting HTTPS connections is not supported currently. 
- For HTTPChaos injection to take effect, the client should avoid reusing TCP socket. This is because HTTPChaos does not affect the HTTP requests that are sent via TCP socket before the fault injection.
- Use non-idempotent requests (such as most of the POST requests) with caution in production environments. If such requests are used, the target service may not return to normal status by repeating requests after the fault injection.

## Create experiments

Currently, Chaos Mesh only supports using YAML configuration files to create HTTPChaos experiments. In the YAML files, you can simulate either one HTTP fault type or a combination of different HTTP fault types.

### Example of `abort`

1. Write the experimental configuration to the `http-abort-failure.yaml` file as the example below:

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

1. Write the experimental configuration to `http-failure.yaml` file as the example below:

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
kubectl apply -f ./http-failure.yaml
```

## Field description

### Description for common fields

Common fields are meaningful when the `target` of fault injection is `Request` or `Response`.

| Parameter        | Type              | Description                                                                                                                                                                                                                                                                                                                                                                | Default value                             | Required | Example                        |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------- | ------------------------------ |
| mode             | string            | Specifies the mode of the experiment. The mode options include `one` (selecting a random pod), `all` (selecting all eligible pods), `fixed` (selecting a specified number of eligible pods), `fixed-percent` (selecting a specified percentage of Pods from the eligible pods), and `random-max-percent` (selecting the maximum percentage of Pods from the eligible pods). |                                           | yes      | one                            |
| value            | string            | Provides parameters for the `mode` configuration depending on the value of `mode`.                                                                                                                                                                                                                                                                                          |                                           | no       | 2                              |
| target           | string            | Specifies whether the target of fault injuection is `Request` or `Response`. The [`target`-related fields](#Description-for-`target`-related-fields) should be configured at the same time.                                                                                                                                                                                 |                                           | yes      | Request                        |
| port             | int32             | The TCP port that the target service listens on.                                                                                                                                                                                                                                                                                                                            |                                           | yes      | 80                             |
| method           | string            | The HTTP method of the target request method.                                                                                                                                                                                                                                                                                                                               | Takes effect for all methods by default.  | no       | GET                            |
| path             | string            | The URI path of the target request which supports [Matching wildcards](https://www.wikiwand.com/en/Matching_wildcards).                                                                                                                                                                                                                                                     | Takes effect on all paths by default.     | no       | /api/\*                        |
| request_headers  | map[string]string | Matches request headers to the target service.                                                                                                                                                                                                                                                                                                                              | Takes effect for all requests by default. | no       | Content-Type: application/json |
| abort            | bool              | Indicates whether to inject the fault that interrupts server connection.                                                                                                                                                                                                                                                                                                    | false                                     | no       | true                           |
| delay            | string            | Specifies the time for a latency fault.                                                                                                                                                                                                                                                                                                                                     | 0                                         | no       | 10s                            |
| replace.header   | map[string]string | Specifies the key pair used to replace the request header or response header.                                                                                                                                                                                                                                                                                               |                                           | no       | Content-Type: application/xml  |
| replace.body     | []byte            | Specifies request body or response body to replace the fault (Base64 encoded).                                                                                                                                                                                                                                                                                              |                                           | no       | eyJmb28iOiAiYmFyIn0K           |
| patch.header     | [][]string        | Specifies the attached key pair of the request header or response header with patch faults.                                                                                                                                                                                                                                                                                 |                                           | no       | - [Set-Cookie, one cookie]     |
| patch.body.type  | string            | Specifies the type of patch faults of the request body or response body. Currently, it only supports [`JSON`](https://tools.ietf.org/html/rfc7396).                                                                                                                                                                                                                         |                                           | no       | JSON                           |
| patch.body.value | string            | Specifies the fault of the request body or response body with patch faults.                                                                                                                                                                                                                                                                                                 |                                           | no       | "{"foo": "bar"}"               |
| duration         | string            | Specifies the duration of a specific experiment.                                                                                                                                                                                                                                                                                                                            |                                           | yes      | 30s                            |
| scheduler        | string            | Specifies the scheduling rules for the time of a specific experiment.                                                                                                                                                                                                                                                                                                       |                                           | no       | 5 \* \* \* \*                  |

### Description for `target`-related fields

#### `Request`-related fields

The `Request` field is a meaningful when the `target` set to `Request` during the fault injection.

| Parameter        | Type              | Description                                                         | Default value | Required | Example      |
| ---------------- | ----------------- | ------------------------------------------------------------------- | ------------- | -------- | ------------ |
| replace.path     | string            | Specifies the URI path used to replace content.                     |               | no       | /api/v2/     |
| replace.method   | string            | Specifies the replaced content of the HTTP request method.          |               | no       | DELETE       |
| replace.queries  | map[string]string | Specifies the replaced key pair of the URI query.                   |               | no       | foo: bar     |
| patch.queries    | [][]string        | Specifies the attached key pair of the URI query with patch faults. |               | no       | - [foo, bar] |

#### `Respond`-related fields

The `Response` is a meaningful when the `target` set to `Response` during the fault injection.

| Parameter      | Type              | Description                                                 | Default value                                 | Required | Example                        |
| -------------- | ----------------- | ----------------------------------------------------------- | --------------------------------------------- | -------- | ------------------------------ |
| code           | int32             | Specifies the status code responded by `target`.            | Takes effect for all status codes by default. | no       | 200                            |
| response_heads | map[string]string | Matches request headers to `target`.                        | Takes effect for all responses by default.    | no       | Content-Type: application/json |
| replace.code   | int32             | Specifies the replaced content of the response status code. |                                               | no       | 404                            |

## Local debugging

If you are not sure of the effects of certain fault injections, you can also test the corresponding features locally using [rs-tproxy](https://github.com/chaos-mesh/rs-tproxy). Chaos Mesh also provides HTTPChaos by using rs-tproxy.
