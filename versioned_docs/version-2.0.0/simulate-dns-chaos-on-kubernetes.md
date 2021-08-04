---
title: Simulate DNS Faults
sidebar_label: Simulate DNS Faults
---

This document describes how to create DNSChaos experiments in Chaos Mesh to simulate DNS faults.

## DNSChaos Introduction

DNSChaos is used to simulate wrong DNS responses. For example, DNSChaos can return an error or return a random IP address when receiving a DNS request.

## Deploy Chaos DNS Service

Before creating a DNSChaos experiment using Chaos Mesh, you need to deploy a special DNS service to inject faults:

```bash
helm upgrade chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing --set dnsServer.create=true
```

After executing the above commands, check if the DNS service status is normal:

```bash
kubectl get pods -n chaos-testing -l app.kubernetes.io/component=chaos-dns-server
```

Make sure that the Pod status is `Running`.

## Notes

1. Currently, DNSChaos only supports record types `A` and `AAAA`.

2. The chaos DNS service runs CoreDNS with the [k8s_dns_chaos](https://github.com/chaos-mesh/k8s_dns_chaos) plugin. If the CoreDNS service in your Kubernetes cluster contains some special configurations, you can edit configMap `dns-server-config` to make the configuration of the chaos DNS service consistent with that of the K8s CoreDNS service using the following command:

   ```bash
   kubectl edit configmap dns-server-config -n chaos-testing
   ```

## Create experiments using Chaos Dashboard

1. Open Chaos Dashboard, and click **NEW EXPERIMENT** on the page to create a new experiment:

   ![Create Experiment](./img/create-new-exp.png)

2. In the **Choose a Target** area, choose **DNS FAULT** and select a specific behavior, such as **ERROR**. Then fill out the matching rules.

   ![DNSChaos Experiment](./img/dnschaos-exp.png)

   According to the matching rules configured in the screenshot, the DNS FAULT takes effect for domains including `google.com`, `chaos-mesh.org`, and `github.com`, which means that an error will be returned when a DNS request is sent to these three domains. For details of specific matching rules, refer to the description of the `patterns` field in [Configuration Description](#configuration-description).

3. Fill out the experiment information, and specify the experiment scope and the scheduled experiment duration:

   ![Experiment Information](./img/exp-info.png)

4. Submit the experiment information.

## Create experiments using the YAML file

1. Write the experiment configuration to the `dnschaos.yaml` file:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: DNSChaos
   metadata:
     name: dns-chaos-example
     namespace: chaos-testing
   spec:
     action: random
     mode: all
     patterns:
       - google.com
       - chaos-mesh.*
       - github.?om
     selector:
       namespaces:
         - busybox
   ```

   This configuration can take effect for domains including `google.com`, `chaos-mesh.org`, and `github.com`, which means that an IP address will be returned when a DNS request is sent to these three domains. For specific matching rules, refer to the `patterns` description in [Configuration Description](#configuration-description).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

   ```bash
   kubectl apply -f dnschaos.yaml
   ```

### Configuration Description

| Parameter | Type         | Description                                                                                                                                                                                                                                                                                                                                                                 | Default value | Required | Example                                      |
| :-------- | :----------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------ | :------- | :------------------------------------------- |
| action    | string       | Defines the behavior of DNS fault. The value can be `random` or `error`. When the value is `random`, DNS service will return a random IP address; when the value is `error`, DNS service will return an error.                                                                                                                                                              | None          | Yes      | `random` or `error`                          |
| patterns  | String array | Selects a domain template that matches faults. Placeholder `?` and wildcard are supported. `*`                                                                                                                                                                                                                                                                              | []            | No       | `google.com`, `chaos-mesh.org`, `github.com` |
| mode      | string       | Specifies the mode of the experiment. The mode options include `one` (selecting a random Pod), `all` (selecting all eligible Pods), `fixed` (selecting a specified number of eligible Pods), `fixed-percent` (selecting a specified percentage of Pods from the eligible Pods), and `random-max-percent` (selecting the maximum percentage of Pods from the eligible Pods). | None          | Yes      | `1`                                          |
| value     | string       | Provides parameters for the `mode` configuration, depending on `mode`. For example, when `mode` is set to `fixed-percent`, `value` specifies the percentage of Pods.                                                                                                                                                                                                        | None          | No       | 2                                            |
| selector  | struct       | Specifies the target Pod. For details, refer to [Define the Scope of Chaos Experiments](./define-chaos-experiment-scope.md).                                                                                                                                                                                                                                                | None          | Yes      |                                              |

:::note

- The wildcard in `patterns` configuration must be at the end of string. For example, `chaos-mes*.org.` is an invalid configuration.

- When `patterns` is not configured, faults will be injected for all domains.

:::
