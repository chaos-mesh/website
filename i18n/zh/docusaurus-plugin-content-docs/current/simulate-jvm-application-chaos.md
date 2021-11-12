---
title: 模拟 JVM 应用故障
---

## JVMChaos 介绍

JVMChaos 能向目标容器中的 JVM 注入故障，适用于任何使用 JVM 作为运行时的应用。目前 JVMChaos 借助 [chaosblade-exec-jvm](https://github.com/chaosblade-io/chaosblade-exec-jvm) 实现对 JVM 的错误注入，主要支持以下类型的故障：

- 指定返回值
- 方法延迟
- 抛自定义异常
- 内存溢出
- 填充 JVM Code Cache
- Java 进程 CPU 满载
- 执行任意自定义 Groovy/Java 脚本

## 使用限制

目前 Chaos Mesh 使用 [MutatingAdmissionWebhook](https://kubernetes.io/zh/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) 修改对 Pod 的定义，通过 [Init 容器](https://kubernetes.io/zh/docs/concepts/workloads/pods/init-containers/)加载 java agnet，并非运行时加载 java agent。因此在使用时存在如下限制：

- Kubernetes 需要启用 Webhook 支持。
- 在为命名空间配置 MutatingAdmissionWebhook 之前已经存在 Pod，不会受到 JVMChaos 影响。
- 命名空间下的所有容器中的 JVM 都会在启动阶段加载 java agent，JVMChaos 在被删除后也不会卸载 java agent。若考虑到 java agent 可能对程序行为或性能带来的影响，期望清理 java agnet，请将工作负载移出该命名空间。

另外，目前无法通过 Chaos Dashboard 创建 JVMChaos。

## 使用 YAML 方式创建实验

下面将以指定返回值为例，展示 JVMChaos 的使用方法与效果。以下内容中涉及的 yaml 文件均可在 [examples/jvm](https://github.com/chaos-mesh/chaos-mesh/tree/master/examples/jvm) 中找到，以下步骤默认的工作路径也是在 `examples/jvm` 中。 默认 Chaos Mesh 安装的命名空间为 `chaos-testing`。

### 1. 创建命名空间并配置 MutatingAdmissionWebhook

建立应用所在的命名空间：

```shell
kubectl create ns app
```

为命名空间 `app` 增加 label `admission-webhook=enabled`，允许 Chaos Mesh 的 MutatingAdmissionWebhook 修改该命名空间下的 Pod。

```shell
kubectl label ns app admission-webhook=enabled
```

为 JVMChaos 所需要的修改行为准备模板：

```shell
kubectl apply -f sidecar-template.yaml
kubectl apply -f sidecar.yaml
```

### 2. 创建被测应用

[jvm-chaos-demo](https://github.com/chaos-mesh/jvm-chaos-demo) 是一个简单的 Spring Boot 应用，此处作为被测应用。被测应用定义在 `example/jvm/app.yaml` 中，内容如下：

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

其中值为 `admission-webhook.chaos-mesh.org/request: jvmchaos-sidecar` 的 `annotation` 与步骤 1 `sidecar.yaml` 中 `ConfigMap` 的名称对应。

建立应用 Deployment：

```shell
kubectl apply -f app.yaml
```

执行 `kubectl -n app get pods`，预期能够观察到命名空间 `app` 中出现 `1` 个名称形如 `springboot-jvmchaos-demo-777d94c5b9-7t7l2` 的 Pod，等待其 `READY` 为 `1/1` 后进行下一步。

```shell
kubectl -n app get pods
```

预期结果如下：

```text
NAME                                        READY   STATUS    RESTARTS   AGE
springboot-jvmchaos-demo-777d94c5b9-7t7l2   1/1     Running   0          21s
```

### 3. 观测未被注入时的行为

在注入前你可以先观测应用 `jvm-chaos-demo` 未被注入时的行为，例如：

使用 `kubectl port-forward` 将 Pod 的端口映射到本地：

```shell
kubectl -n app port-forward pod/springboot-jvmchaos-demo-777d94c5b9-7t7l2 8080:8080
```

在另外一个 shell session 中使用 curl 或者直接使用浏览器访问 `http://localhost:8080/hello`，预期返回 `Hello firend`：

```shell
curl http://localhost:8080/hello
Hello friend
```

### 4. 注入 JVMChaos 并验证

指定返回值的 JVMChaos 内容如下：

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

JVMChaos 将 `hello` 方法的返回值修改为字符串 `hello chaos mesh!`。

注入指定返回值的 JVMChaos：

```shell
kubectl apply -f ./jvm-return-example.yaml
```

使用 curl 或者直接使用浏览器访问 <http://localhost:8080/hello>，预期返回 `hello chaos mesh!`：

```shell
curl http://localhost:8080/hello
hello chaos mesh!
```

## 字段说明

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| action | string | 表示具体的故障类型，支持 delay、return、script、cfl、oom、ccf、tce、cpf、tde、tpf。 | 无 | 是 | return |
| mode | string | 表示选择 Pod 的方式，支持 one、all、fixed、fixed-percent、random-max-percent。 | 无 | 是 | `one` |
| value | string | 取决于 mode 的取值，为 mode 提供参数 | 无 | 否 | 1 |
| target | string | 传递给 `chaosblade-exec-jvm` 的参数，代表 JVMChaos 的目标，支持 servlet、psql、jvm、jedis、http、dubbo、rocketmq、tars、mysql、druid、redisson、rabbitmq、mongodb。 | 无 | 是 | jvm |
| flags | map[string]string | 传递给 `chaosblade-exec-jvm` 的参数，代表 action 的 flags | 无 | 否 |  |
| matchers | map[string]string | 传递给 `chaosblade-exec-jvm` 的参数，代表注入点的匹配方式 | 无 | 否 |  |

关于 action 的取值的含义，可参考：

| 名称   | 含义                                   |
| ------ | -------------------------------------- |
| delay  | 指定方法调用延迟                       |
| return | 修改返回值                             |
| script | 编写 groovy 和 java 实现场景           |
| cfl    | java 进程 CPU 使用率满载               |
| oom    | 内存溢出，支持堆、栈、metaspace 区溢出 |
| ccf    | 填充 jvm code cache                    |
| tce    | 抛自定义异常场景                       |
| cpf    | 连接池满                               |
| tde    | 抛方法声明中的第一个异常               |
| tpf    | 线程池满                               |

关于 action 的详细用法可参考 [chaos blade 文档](https://chaosblade-io.gitbook.io/chaosblade-help-zh-cn/blade-create-jvm)。

关于传递给 `chaosblade-exec-jvm` 的参数，Chaos Mesh 会将 `flags` 与 `matchers` 中的所有字段合并后作为请求体发送给 `chaosblade-exec-jvm`，具体可参考 [chaosblade-exec-jvm/协议篇](https://github.com/chaosblade-io/chaosblade-dev-doc/blob/a7074ab656de469f7dfaa19227723d0967c590ae/zh-cn/chaosblade-exec-jvm/%E5%8D%8F%E8%AE%AE%E7%AF%87.md)。
