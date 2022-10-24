---
title: 模拟 AWS 故障
---

本文档介绍如何使用 Chaos Mesh 来模拟 AWS 故障。

## AWSChaos 介绍

AWSChaos 能够帮助你模拟指定的 AWS 实例发生故障的情景。目前，AWSChaos 支持以下类型的故障：

- **EC2 Stop**: 使指定的 EC2 实例进入停止状态。
- **EC2 Restart**: 重启指定的 EC2 实例。
- **Detach Volume**: 从指定的 EC2 实例中卸载存储卷。

## `Secret` 文件

为了方便地连接 AWS 集群，你可以提前创建一个 Kubernetes Secret 文件存储认证相关信息。

以下是一个 `secret` 文件示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloud-key-secret
  namespace: chaos-testing
type: Opaque
stringData:
  aws_access_key_id: your-aws-access-key-id
  aws_secret_access_key: your-aws-secret-access-key
```

- **name** 表示 Kubernetes Secret 对象的名字。
- **namespace** 表示 Kubernetes Secret 对象的命名空间。
- **aws_access_key_id** 存储 AWS 集群的访问密钥 ID。
- **aws_secret_access_key** 存储 AWS 集群的秘密访问密钥。

## 使用 Dashboard 方式创建实验

:::note 注意

在使用 Dashboard 方式创建实验之前，请确保：

1. 已经安装了 Dashboard。
2. 可以通过 `kubectl port-forward` 方式访问 Dashboard：

   ```bash
    kubectl port-forward -n chaos-mesh svc/chaos-dashboard 2333:2333
   ```

   接着你可以在浏览器通过 [`http://localhost:2333`](http://localhost:2333)访问 Dashboard 。

:::

1. 单击实验页面中的**新的实验**按钮进行创建实验。

   ![img](./img/create-pod-chaos-on-dashboard-1_zh.jpg)

2. 在**选择目标**处选择 **Aws 故障**，并选择具体行为，例如 **Ec2 Stop**。

3. 填写实验信息，指定实验范围以及实验计划运行时间。

4. 提交实验。

## 使用 YAML 方式创建实验

### ec2-stop 配置文件示例

1. 将实验配置写入到文件 `awschaos-ec2-stop.yaml` 中，内容如下所示：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: AWSChaos
   metadata:
     name: ec2-stop-example
     namespace: chaos-testing
   spec:
     action: ec2-stop
     secretName: 'cloud-key-secret'
     awsRegion: 'us-east-2'
     ec2Instance: 'your-ec2-instance-id'
     duration: '5m'
   ```

   依据此配置示例，Chaos Mesh 将向指定的 EC2 实例中注入 ec2-stop 故障，使该 EC2 实例将在 5 分钟时间内处于不可用的状态。

   如需查看更多关于停止 EC2 实例的信息，可以参考 [停止和启动 EC2 实例](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/Stop_Start.html)。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f awschaos-ec2-stop.yaml
   ```

### ec2-restart 配置文件示例

1. 将实验配置写入到文件 `awschaos-ec2-restart.yaml` 中，内容如下所示：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: AWSChaos
   metadata:
     name: ec2-restart-example
     namespace: chaos-testing
   spec:
     action: ec2-restart
     secretName: 'cloud-key-secret'
     awsRegion: 'us-east-2'
     ec2Instance: 'your-ec2-instance-id'
   ```

   依据此配置示例，Chaos Mesh 将向指定的 EC2 实例中注入 ec2-restart 故障，使该 EC2 实例将重启一次。

   如需查看更多关于重启 EC2 实例的信息，可以参考[重启实例](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/ec2-instance-reboot.html)。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f awschaos-ec2-restart.yaml
   ```

### detach-volume 配置文件示例

1. 将实验配置写入到文件 `awschaos-detach-volume.yaml` 中，内容如下所示：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: AWSChaos
   metadata:
     name: ec2-detach-volume-example
     namespace: chaos-testing
   spec:
     action: ec2-stop
     secretName: 'cloud-key-secret'
     awsRegion: 'us-east-2'
     ec2Instance: 'your-ec2-instance-id'
     volumeID: 'your-volume-id'
     deviceName: '/dev/sdf'
     duration: '5m'
   ```

   依据此配置示例，Chaos Mesh 将向指定的 EC2 实例中注入 detach-volume 故障，使该 EC2 实例在 5 分钟内与指定存储卷分离。

   查看更多关于分离 Amazon EBS 卷的消息, 可以参考[分离 Amazon EBS 卷](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/ebs-detaching-volume.html)。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f awschaos-detach-volume.yaml
   ```

### 字段说明

下表介绍以上 YAML 配置文件中的字段。

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| action | string | 表示具体的故障类型，仅支持 ec2-stop、ec2-restart、detach-volume | ec2-stop | 是 | ec2-stop |
| mode | string | 指定实验的运行方式，可选择的方式包括：`one`（表示随机选出一个符合条件的 Pod）、`all`（表示选出所有符合条件的 Pod）、`fixed`（表示选出指定数量且符合条件的 Pod）、`fixed-percent`（表示选出占符合条件的 Pod 中指定百分比的 Pod）、`random-max-percent`（表示选出占符合条件的 Pod 中不超过指定百分比的 Pod） | 无 | 是 | `one` |
| value | string | 取决与 `mode` 的配置，为 `mode` 提供对应的参数。例如，当你将 `mode` 配置为 `fixed-percent` 时，`value` 用于指定 Pod 的百分比。 | 无 | 否 | 1 |
| secretName | string | 指定存储 AWS 认证信息的 Kubernetes Secret 名字 | 无 | 否 | cloud-key-secret |
| awsRegion | string | 指定 AWS 区域 | 无 | 是 | us-east-2 |
| ec2Instance | string | 指定 EC2 实例的 ID | 无 | 是 | your-ec2-instance-id |
| volumeID | string | 当 action 为 detach-volume 必填，指定 EBS 卷的 ID | 无 | 否 | your-volume-id |
| deviceName | string | 当 action 为 detach-volume 必填，指定设备名 | 无 | 否 | /dev/sdf |
| duration | string | 指定实验的持续时间 | 无 | 是 | 30s |
