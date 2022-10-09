---
title: 模拟 Azure 故障
---

本文档介绍如何使用 Chaos Mesh 来模拟 Azure 故障。

## AzureChaos 介绍

AzureChaos 能够帮助你模拟指定的 Azure 实例发生故障的情景。目前，AzureChaos 支持以下类型的故障：

- **VM Stop**：使指定的 VM 实例进入停止状态。
- **VM Restart**：重启指定的 VM 实例。
- **Disk Detach**：从指定的 VM 实例中卸载数据磁盘。

## `Secret` 文件

为了方便地连接 Azure 集群，你可以提前创建一个 Kubernetes Secret 文件存储认证相关信息。

以下是一个 `Secret` 文件示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloud-key-secret
  namespace: chaos-testing
type: Opaque
stringData:
  client_id: your-client-id
  client_secret: your-client-secret
  tenant_id: your-tenant-id
```

- **name** 表示 Kubernetes Secret 对象的名字。
- **namespace** 表示 Kubernetes Secret 对象的命名空间。
- **client_id** 存储 Azure 应用注册的应用程序（客户端）ID。
- **client_secret** 存储 Azure 应用注册的应用程序（客户端）的机密值。
- **tenant_id** 存储 Azure 应用注册的目录（租户）ID。 `client_id` 及 `client_secret` 的获取请参考[机密客户端应用程序](https://docs.microsoft.com/zh-cn/azure/healthcare-apis/azure-api-for-fhir/register-confidential-azure-ad-client-app)。

:::note

注意请确保 Secret 文件中的应用注册已作为参与者或所有者添加到指定 VM 实例的访问控制（IAM）中。

:::

## 使用 Dashboard 方式创建实验


1. 单击实验页面中的**新的实验**按钮进行创建实验。

   ![img](./img/create-pod-chaos-on-dashboard-1_zh.jpg)

2. 在**选择目标**处选择 **Azure 故障**，并选择具体行为，例如 **VM STOP**。

3. 填写实验信息，指定实验范围以及实验计划运行时间。

4. 提交实验。

## 使用 YAML 方式创建实验

### `vm-stop` 配置文件示例

1. 将实验配置写入到文件 `azurechaos-vm-stop.yaml` 中，内容如下所示：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: AzureChaos
   metadata:
     name: vm-stop-example
     namespace: chaos-testing
   spec:
     action: vm-stop
     secretName: 'cloud-key-secret'
     subscriptionID: 'your-subscription-id'
     resourceGroupName: 'your-resource-group-name'
     duration: '5m'
   ```

   依据此配置示例，Chaos Mesh 将向指定的 VM 实例中注入 `vm-stop` 故障，该 VM 实例将在 5 分钟时间内处于不可用的状态。

   如需查看更多关于停止 VM 实例的信息，可以参考[启动或停止 VM](https://docs.microsoft.com/zh-cn/azure/devtest-labs/use-command-line-start-stop-virtual-machines)。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f azurechaos-vm-stop.yaml
   ```

### `vm-restart` 配置文件示例

1. 将实验配置写入到文件 `azurechaos-vm-restart.yaml` 中，内容如下所示：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: AzureChaos
   metadata:
     name: vm-restart-example
     namespace: chaos-testing
   spec:
     action: vm-restart
     secretName: 'cloud-key-secret'
     subscriptionID: 'your-subscription-id'
     resourceGroupName: 'your-resource-group-name'
   ```

   依据此配置示例，Chaos Mesh 将向指定的 VM 实例中注入 `vm-restart` 故障，该 VM 实例将重启一次。

   如需查看更多关于重启 VM 实例的信息，可以参考[重新启动 VM](https://docs.microsoft.com/zh-cn/azure/devtest-labs/devtest-lab-restart-vm)。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f azurechaos-vm-restart.yaml
   ```

### `disk-detach` 配置文件示例

1. 将实验配置写入到文件 `azurechaos-disk-detach.yaml` 中，内容如下所示：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: AzureChaos
   metadata:
     name: disk-detach-example
     namespace: chaos-testing
   spec:
     action: disk-detach
     secretName: 'cloud-key-secret'
     subscriptionID: 'your-subscription-id'
     resourceGroupName: 'your-resource-group-name'
     lun: 'your-disk-lun'
     diskName: 'your-disk-name'
     duration: '5m'
   ```

   依据此配置示例，Chaos Mesh 将向指定的 VM 实例中注入 `disk-detach `故障，使该 VM 实例在 5 分钟内与指定数据磁盘分离。

   查看更多关于分离 Azure 数据磁盘的消息，可以参考[分离数据磁盘](https://docs.microsoft.com/zh-cn/azure/devtest-labs/devtest-lab-attach-detach-data-disk#detach-a-data-disk)。

2. 使用 `kubectl` 创建实验，命令如下：

   ```bash
   kubectl apply -f azurechaos-disk-detach.yaml
   ```

### 字段说明

下表介绍以上 YAML 配置文件中的字段。

| 参数 | 类型 | 说明 | 默认值 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- | --- |
| action | string | 表示具体的故障类型，仅支持 `vm-stop`、`vm-restart`、`disk-detach` | `vm-stop` | 是 | `vm-stop` |
| mode | string | 指定实验的运行方式，可选择的方式包括：`one`（表示随机选出一个符合条件的 Pod）、`all`（表示选出所有符合条件的 Pod）、`fixed`（表示选出指定数量且符合条件的 Pod）、`fixed-percent`（表示选出占符合条件的 Pod 中指定百分比的 Pod）、`random-max-percent`（表示选出占符合条件的 Pod 中不超过指定百分比的 Pod） | 无 | 是 | `one` |
| value | string | 取决与 `mode` 的配置，为 `mode` 提供对应的参数。例如，当你将 `mode` 配置为 `fixed-percent` 时，`value` 用于指定 Pod 的百分比。 | 无 | 否 | `1` |
| secretName | string | 指定存储 Azure 认证信息的 Kubernetes Secret 名字 | 无 | 否 | `cloud-key-secret` |
| subscriptionID | string | 指定 VM 实例的订阅 ID | 无 | 是 | `your-subscription-id` |
| resourceGroupName | string | 指定 VM 实例所属的资源组的名称 | 无 | 是 | `your-resource-group-name` |
| lun | string | 当 action 为 `disk-detach` 时必填，指定硬盘的 LUN (Logic Unit Number) | 无 | 否 | `0` |
| diskName | string | 当 action 为 `disk-detach` 时必填，指定设备名 | 无 | 否 | `DATADISK_0` |
| duration | string | 指定实验的持续时间 | 无 | 是 | `30s` |
