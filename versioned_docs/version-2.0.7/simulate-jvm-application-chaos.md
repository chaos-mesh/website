---
title: Simulate JVM Application Faults
---

## JVMChaos introduction

JVMChaos can inject faults into JVM of the target container, which can be applied for any application that uses JVM as the runtime environment. Currently, JVMChaos uses [chaosblade-exec-jvm](https://github.com/chaosblade-io/chaosblade-exec-jvm) to inject faults into the JVM. JVMChaos supports the following fault types:

- Specify return value
- Method Delay
- Throw custom exceptions
- Out of memory
- Fill JVM Code Cache
- CPU full load in Java
- Perform customized Groovy or Java script

## Usage restrictions

Currently, Chaos Mesh uses [MutatingAdmissionWebhook](https://kubernetes.io/zh/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) to modify the Pod definition and loads Java agent using [Init Containers](https://kubernetes.io/zh/docs/concepts/workloads/pods/init-containers/) instead of loading java agent at runtime. Therefore, there are some restrictions when you use JVMChaos:

- The Webhook support needs to be enabled in Kubernetes.
- For Pods that exist before you configure [MutatingAdmissionWebhook](https://kubernetes.io/zh/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) for the namespace, they will not be affected by JVMChaos.
- JVM in all containers under namespace will load Java agent at the startup stage, and JVMChaos will not unload Java agent after being deleted. If you hope to clean up the Java agent considering the impact that Java agent may have on program behaviors or performance, you can move the workload out of the namespace.

In addition, creating JVMChaos using Chaos Dashboard is not supported currently.

## Create experiments using YAML files

The following example shows you the methods and effects of JVMChaos with a specified return value. The YAML files referred in the following steps can be found in [examples/jvm](https://github.com/chaos-mesh/chaos-mesh/tree/master/examples/jvm). The default work directory for the following steps is in `examples/jvm`. The default namespace installed by Chaos Mesh is `chaos-testing`.

### 1. Create a namespace and configure MutatingAdmissionWebhook

Create the namespace for the application:

```shell
kubectl create ns app
```

Add the `admission-webhook=enabled` label for the `app` namespace, and allow the MutatingAdmissionWebhook of Chaos Mesh to modify Pods under the namespace.

```shell
kubectl label ns app admission-webhook=enabled
```

Prepare a template for modifications to be made by JVMChaos:

```shell
kubectl apply -f sidecar-template.yaml
kubectl apply -f sidecar.yaml
```

### 2. Create target applications

[jvm-chaos-demo](https://github.com/chaos-mesh/jvm-chaos-demo) is a simple Spring Boot application and here serves as a target application. A target application is defined in `example/jvm/app.yaml` as follows:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: springboot-jvmchaos-demo
  namespace: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: springboot-jvmchaos-demo
  template:
    metadata:
      annotations:
        admission-webhook.chaos-mesh.org/request: jvmchaos-sidecar
      creationTimestamp: null
      labels:
        app: springboot-jvmchaos-demo
    spec:
      containers:
        - image: 'gallardot/chaosmesh-jvmchaos-sample:latest'
          imagePullPolicy: IfNotPresent
          name: springboot-jvmchaos-demo
```

In the above example, the `annotation` with the value `admission-webhook.chaos-mesh.org/request: jvmchaos-sidecar` corresponds to the name of `ConfigMap` in `sidecar.yaml` of step 1.

Build application deployment:

```shell
kubectl apply -f app.yaml
```

Execute `kubectl -n app get pods`, and then you can find `1` Pod with a name like `springboot-jvmchaos-demo-777d94c5b9-7t7l2` under the namespace `app`. Wait for `READY` changes to `1/1` and then execute the following commands:

```shell
kubectl -n app get pods
```

The result is as follows:

```text
NAME                                        READY   STATUS    RESTARTS   AGE
springboot-jvmchaos-demo-777d94c5b9-7t7l2   1/1     Running   0          21s
```

### 3. Obseve application behaviors before injecting faults

You can observe the behavior of the `jvm-chaos-demo` application before injecting faults, for example:

Map the port of Pod to local using `kubectl port-forward`:

```shell
kubectl -n app port-forward pod/springboot-jvmchaos-demo-777d94c5b9-7t7l2 8080:8080
```

Use curl in another shell session or directly access to `http://localhost:8080/hello`. `Hello firend` is expected to be returned:

```shell
curl http://localhost:8080/hello
Hello friend
```

### 4. Inject JVMChaos and check

The JVMChaos with a specified return value is as follows:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: JVMChaos
metadata:
  name: jvm-return-example
  namespace: app
spec:
  action: return
  target: jvm
  flags:
    value: 'hello chaos mesh!'
  matchers:
    classname: 'org.chaosmesh.jvm.Application'
    methodname: 'hello'
  mode: one
  selector:
    labelSelectors:
      app: springboot-jvmchaos-demo
```

JVMChaos modifies the return value of `hello` method to string `hello chaos mesh!`.

Inject JVMChaos with a specified value:

```shell
kubectl apply -f ./jvm-return-example.yaml
```

Use curl or directly access to <http://localhost:8080/hello>, `hello chaos mesh!` is expected to be returned:

```shell
curl http://localhost:8080/hello
hello chaos mesh!
```

## Field description

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| action | string | Indicates the specific fault type. The available fault types include return, script, cfl, oom, ccf, tce, tcf, cpf, tde, and tpf. | None | Yes | return |
| mode | string | Indicates how to select Pod. The supported modes include one, all, fixed, fixed-percent, and random-max-percent. | None | Yes | `one` |
| value | string | Provides parameters for the `mode` configuration, depending on `mode`. | None | No | 1 |
| target | string | Indicates the parameter passed to `chaosblade-exec-jvm`, representing JVMChaos targets, supporting servlet, psql, jvm, jedis, http, dubbo, rocketmq, tars, mysql, ruid, redisson, rabbitmq, monodb. | None | Yes | jvm |
| flags | map[string]string | Indicates parameters passed to `chaosblade-exec-jvm` and represents the flags of action. | None | No |  |
| matchers | map[string]string | Indicates parameters passed to `chaosblade-execu-jvm` and represents the matching of injection points. | None | No |  |

For the meaning of the value of action, refer to:

| Name   | Meaning                                                      |
| ------ | ------------------------------------------------------------ |
| delay  | Specifies method call delay                                  |
| return | Modifies the return value                                    |
| script | Writes groovy and Java implement scenarios                   |
| cfl    | Java CPU usage overload                                      |
| oom    | Out of memory, supporting oom of heap, stack, and metaspaces |
| ccf    | JVM code cache fill                                          |
| tce    | Throw custom exceptions                                      |
| cpf    | Connection pool full                                         |
| tde    | Throw the first exception of method declare                  |
| tpf    | Thread pool full                                             |

For the details of action, refer to [chaos blade document](https://chaosblade-io.gitbook.io/chaosblade-help-zh-cn/blade-create-jvm).

For the parameters passed to `chaosblade-exec-jvm`, Chaos Mesh will merge all fields in `flags` and `matchers` as a request body and then send it to `chaosblade-exec-jvm`. For details, refer to [chaosblade-exec-jvm/Protocol](https://github.com/chaosblade-io/chaosblade-dev-doc/blob/a7074ab656de469f7dfaa19227723d0967c590ae/zh-cn/chaosblade-exec-jvm/%E5%8D%8F%E8%AE%AE%E7%AF%87.md).
