---
title: Simulate Azure Faults
---

This document describes how to use Chaos Mesh to simulate Azure faults.

## AzureChaos introduction

AzureChaos can help you simulate fault scenarios on the specified Azure instance. Currently, AzureChaos supports the following fault types:

- **VM Stop**: stops the specified VM instance.
- **VM Restart**: restarts the specified VM instance.
- **Disk Detach**: uninstalls the data disk from the specified VM instance.

## `Secret` file

To easily connect to the Azure cluster, you can create a Kubernetes `Secret` file to store the authentication information in advance.

A `Secret` file sample is as follows:

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

- **name** means the Kubernetes Secret object.
- **namespace** means the namespace of the Kubernetes Secret object.
- **client_id** stores Application (client) ID of Azure App registrations.
- **client_secret** stores Application (client) secret value of Azure App registrations.
- **tenant_id** stores Directory (tenant) ID of Azure App registrations.
For `client_id` and `client_secret`, please refer to [Confidential client application](https://docs.microsoft.com/en-us/azure/healthcare-apis/azure-api-for-fhir/register-confidential-azure-ad-client-app).

:::note
Make sure that App registrations in the Secret file has been added as a contributor or owner to the access control (IAM) of the VM instance.
:::

## Create experiments using Chaos Dashboard

:::note

Before you create an experiment using Chaos Dashboard, make sure the following requirements are met:

1. Chaos Dashboard is installed.
2. Chaos Dashboard can be accessed via `kubectl port-forward`:

   ```bash
    kubectl port-forward -n chaos-testing svc/chaos-dashboard 2333:2333
   ```

   Then you can access the dashboard via [`http://localhost:2333`](http://localhost:2333) in your browser.

:::

1. Open Chaos Dashboard, and click **NEW EXPERIMENT** on the page to create a new experiment:

   ![img](./img/create-new-exp.png)

2. In the **Choose a Target** area, choose **Azure FAULT** and select a specific behavior, such as **VM STOP**.

3. Fill out the experiment information, and specify the experiment scope and the scheduled experiment duration.

4. Submit the experiment information.

## Create experiments using the YAML file

### A `vm-stop` configuration example

1. Write the experiment configuration to the `azurechaos-vm-stop.yaml` file, as shown below:

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

   Based on this configuration example, Chaos Mesh will inject the `vm-stop` fault into the specified VM instance so that the VM instance will be unavailable in 5 minutes.

   For more information about stopping VM instances, refer to [Azure documentation - Start or stop a VM](https://docs.microsoft.com/en-us/azure/devtest-labs/use-command-line-start-stop-virtual-machines).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

   ```bash
   kubectl apply -f azurechaos-vm-stop.yaml
   ```

### A `vm-restart` configuration example

1. Write the experiment configuration to the `azurechaos-vm-restart.yaml` file:

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

   Based on this configuration example, Chaos Mesh will inject `vm-restart` fault into the specified VM instance so that the VM instance will be restarted.

   For more information about restarting the VM instance, refer to the [Azure documentation - Restart a VM](https://docs.microsoft.com/en-us/azure/devtest-labs/devtest-lab-restart-vm).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

   ```bash
   kubectl apply -f azurechaos-vm-restart.yaml
   ```

### A `detach-volume` configuration example

1. Write the experiment configuration to the `azurechaos-disk-detach.yaml` file:

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

   Based on this configuration example, Chaos Mesh will inject a `disk-detach` fault into the specified VM instance so that the VM instance is detached from the specified data disk within 5 minutes.

   For more information about detaching Azure date disk, refer to the [Azure documentation - Detach a data disk](https://docs.microsoft.com/en-us/azure/devtest-labs/devtest-lab-attach-detach-data-disk#detach-a-data-disk).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

   ```bash
   kubectl apply -f azurechaos-disk-detach.yaml
   ```

### Field description

The following table shows the fields in the YAML configuration file.

| Parameter | Type | Description | Default value | Required | Example |
| --- | --- | --- | --- | --- | --- |
| action | string | Indicates the specific type of faults. Only `vm-stop`, `vm-restart`, and `disk-detach` are supported. | `vm-stop` | Yes | `vm-stop` |
| mode | string | Specifies the mode of the experiment. The mode options include `one` (selecting a random Pod), `all` (selecting all eligible Pods), `fixed` (selecting a specified number of eligible Pods), `fixed-percent` (selecting a specified percentage of Pods from the eligible Pods), and `random-max-percent` (selecting the maximum percentage of Pods from the eligible Pods). | N/A | Yes | `one` |
| value | string | Provides parameters for the `mode` configuration, depending on `mode`. For example, when `mode` is set to `fixed-percent`, `value` specifies the percentage of Pods. | N/A | No | `1` |
| secretName | string | Specifies the name of the Kubernetes Secret that stores the Azure authentication information. | N/A | No | `cloud-key-secret` |
| subscriptionID | string | Specifies the VM instacnce's subscription ID. | N/A | Yes | `your-subscription-id` |
| resourceGroupName | string | Specifies the Resource group of VM. | N/A | Yes | `your-resource-group-name` |
| lun | string | This is a required field when the `action` is `disk-detach`, specifies the LUN (Logic Unit Number) of data disk. | N/A | No | `0` |
| diskName | string | This is a required field when the `action` is `disk-detach`, specifies the name of data disk. | N/A | No | `DATADISK_0` |
| duration | string | Specifies the duration of the experiment. | N/A | Yes | `30s` |
