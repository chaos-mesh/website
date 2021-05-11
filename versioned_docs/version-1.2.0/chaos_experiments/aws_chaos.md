---
id: awschaos_experiment
title: AwsChaos Experiment
sidebar_label: AwsChaos Experiment
---

This document introduces how to create AwsChaos experiments.

AwsChaos can help you inject faults into the specified AWS Instance, specifically `ec2-stop`, `ec2-restart` and `detach-volume`.

- **Ec2 Stop** action periodically stops the specified ec2 instance.

- **Ec2 Restart** action periodically reboots the specified ec2 instance.

- **Detach Volume** action detaches the storage volume from the specified ec2 instance.

## Secret file

In order to facilitate the connection to the AWS cluster, you can first create a kubernetes secret file to store related information (such as access key id).

Below is a sample `secret` file:

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

- **name** defines the name of kubernetes secret.
- **namespace** defines the namespace of kubernetes secret.
- **aws_access_key_id** stores your AWS access key id.
- **aws_secret_access_key** stores your AWS secret access key.

## `ec2-stop` configuration file

Below is a sample `ec2-stop` configuration file:

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
  scheduler:
    cron: '@every 10m'
```

For more details about stopping ec2 instance, see [docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Stop_Start.html).

For a detailed description of each field in the configuration template, see [`Fields description`](#fields-description).

## `ec2-restart` configuration file

Below is a sample `ec2-restart` configuration file:

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
  duration: '5m'
  scheduler:
    cron: '@every 10m'
```

For more details about rebooting ec2 instance, see [docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-reboot.html).

For a detailed description of each field in the configuration template, see [`Fields description`](#fields-description).

## `detach-volume` configuration file

Below is a sample `detach-volume` configuration file:

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
  scheduler:
    cron: '@every 10m'
```

For more details about detaching an Amazon EBS volume, see [docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-detaching-volume.html).

For a detailed description of each field in the configuration template, see [`Fields description`](#fields-description).

## Fields description

- **action** defines the specific chaos action for the AWS instance. Supported action: `ec2-stop` / `ec2-restart` / `detach-volume`.
- **secretName** defines the kubernetes secret name used to store AWS information.
- **awsRegion** defines the AWS region.
- **ec2Instance** indicates the ID of the ec2 instance.
- **volumeID** is needed in `detach-volume` action. It indicates the ID of the EBS volume.
- **deviceName** is needed in `detach-volume` action. It indicates the name of the device.
- **duration** defines the duration for each chaos experiment.
- **scheduler** defines the scheduler rules for the running time of the chaos experiment. For more rule information, see [robfig/cron](https://godoc.org/github.com/robfig/cron).
