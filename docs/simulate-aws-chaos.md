---
title: Simulate AWS Faults
sidebar_label: Simulate AWS Faults
---

This document describes how to use Chaos Mesh to simulate AWS faults.

## AwsChaos introduction

AwsChaos can help you simulate fault scenarios on the specified AWS instance. Currently, AwsChaos supports the following fault types:

- **Ec2 Stop**: stops the specified EC2 instance.
- **Ec2 Restart**: restarts the specified EC2 instance.
- **Detach Volume**: uninstalls the storage volume from the specified EC2 instance.

## `Secret` file

To easily connect to the AWS cluster, you can create a Kubernetes `Secret` file to store the authentication information in advance.

A `Secret` file sample is as follows:

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

- **name** means the Kubernetes Secret object.
- **namespace** means the namespace of the Kubernetes Secret object.
- **aws_access_key_id** stores the ID of the access key to the AWS cluster.
- **aws_secret_access_key** stores the secrete access key to the AWS cluster.

## Create experiments using Chaos Dashboard

:::note

Before you create an experiment using Chaos Dashboard, make sure the following requirements are met:

1. Chaos Dashboard is installed.
2. Chaos Dashboard can be accessed via `kubectl port-forward`:

   ```bash
    kubectl port-forward -n chaos-testing svc/chaos-dashboard 2333:2333
   ```

   You can then access the dashboard via [`http://localhost:2333`](http://localhost:2333) in your browser.

:::

1. Open Chaos Dashboard, and click **NEW EXPERIMENT** on the page to create a new experiment:

    ![img](./img/create-new-exp.png)

2. In the "**Choose a Target**" area, choose **AWS FAULT** and select a specific behavior, such as **STOP EC2**.

3. Fill out the experiment information, and specify the experiment scope and the scheduled experiment duration.

4. Submit the experiment information.

## Create experiments using the YAML file

### An `ec2-stop` configuration example

1. Write the experiment configuration to the `awschaos-ec2-stop.yaml` file, as shown below:

    ```yaml
    apiVersion: chaos-mesh.org/v1alpha1
    kind: AwsChaos
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

    Based on this configuration example, Chaos Mesh will inject the `ec2-stop` fault into the specified EC2 instance so that the EC2 instance will be unavailable in 5 minutes.

    For more information about stopping EC2 instances, refer to [AWS documentation - Stop and start your instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Stop_Start.html).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

    ```bash
    kubectl apply -f awschaos-ec2-stop.yaml
    ```

### An `ec2-start` configuration example

1. Write the experiment configuration to the `awchaos-ec2-restot.yaml` file:

    ```yaml
    apiVersion: chaos-mesh.org/v1alpha1
    kind: AwsChaos
    metadata:
    name: ec2-restart-example
    namespace: chaos-testing
    spec:
    action: ec2-restart
    secretName: 'cloud-key-secret'
    awsRegion: 'us-east-2'
    ec2Instance: 'your-ec2-instance-id'
    ```

    Based on this configuration example, Chaos Mesh will inject `ec2-restart` fault into the specified EC2 instance so that the EC2 instance will be restarted.

    For more information about restarting the EC2 instance, refer to the [AWS documentation - Reboot your instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-reboot.html).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

    ```bash
    kubectl apply -f awschaos-ec2-restart.yaml
    ```

### A `detail-volume` configuration example

1. Write the experiment configuration to the `awschaos-detach-volume.yaml` file:

    ```yaml
    apiVersion: chaos-mesh.org/v1alpha1
    kind: AwsChaos
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

    Based on this configuration example, Chaos Mesh will inject a `detail-volume` fault into the specified EC2 instance so that the EC2 instance is detached from the specified storage volume within 5 minutes.

    For more information about detaching Amazon EBS volumes, refer to the [AWS documentation - Detach an Amazon EBS volume from a Linux instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-detaching-volume.html).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

    ```bash
    kubectl apply -f awschaos-detach-volume.yaml
    ```

### Field description

The following table shows the fields in the YAML configuration file.

| Parameter   | Type   | Description                                                                                                                                                                                                                                                                                                                                                                        | Default value | Required | Example              |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- | -------------------- |
| action      | string | Indicates the specific type of faults. Only ec2-stop, ec2-restore, and detain-volume are supported.                                                                                                                                                                                                                                                                         | ec2-stop      | Yes      | ec2-stop             |
| mode        | string | Specifies the mode of the experiment. The mode options include `one` (selecting a random Pod), `all` (selecting all eligible Pods), `fixed` (selecting a specified number of eligible Pods), `fixed-percent` (selecting a specified percentage of Pods from the eligible Pods), and `random-max-percent` (selecting the maximum percentage of Pods from the eligible Pods). | None          | Yes      | `1`                  |
| value       | string | Provides parameters for the `mode` configuration, depending on `mode`.For example, when `mode` is set to `fixed-percent`, `value` specifies the percentage of Pods.                                                                                                                                                                                                         | None          | No       | 2                    |
| secretName  | string | Specifies the name of the Kubernetes Secret that stores the AWS authentication information.                                                                                                                                                                                                                                                                                 | None          | No       | cloud-key-secret     |
| awsRegion   | string | Specifies the AWS region.                                                                                                                                                                                                                                                                                                                                                   | None          | Yes      | us-east-2            |
| ec2Instance | string | Specifies the ID of the EC2 instance.                                                                                                                                                                                                                                                                                                                                       | None          | Yes      | your-ec2-instance-id |
| volumeID    | string | This is a required field when the `action` is `detach-volume`. This field specifies the EBS volume ID.                                                                                                                                                                                                                                                                      | None          | No       | your-volume-id       |
| deviceName  | string | This is a required field when the `action` is `detach-volume`. This field specifies the machine name.                                                                                                                                                                                                                                                                       | None          | No       | /dev/sdf             |
| duration    | string | Specifies the duration of the experiment.                                                                                                                                                                                                                                                                                                                                   | None          | Yes      | 30s                  |
