---
id: dnschaos_experiment
title: DNSChaos Experiment
sidebar_label: DNSChaos Experiment
---

This document describes how to create DNSChaos experiments in Chaos Mesh.

DNSChaos allows you to simulate fault DNS responses such as a DNS error or a random IP address after a request is sent.

## Deploy DNS service for chaos

To create DNSChaos experiments in Chaos Mesh, you need to deploy a DNS service in Chaos Mesh by executing the command below:

```bash
helm upgrade chaos-mesh helm/chaos-mesh --namespace=chaos-testing --set dnsServer.create=true
```

When the deployment finishes, check the status of this DNS service:

```bash
kubectl get pods -n chaos-testing -l app.kubernetes.io/component=chaos-dns-server
```

Make sure the Pod's `STATUS` is `Running`.

## Configuration file

Below is a sample DNSChaos configuration file:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: DNSChaos
metadata:
  name: busybox-dns-chaos
spec:
  action: random
  scope: inner
  mode: all
  selector:
    namespaces:
      - busybox
  duration: "90s"
  scheduler:
    cron: "@every 100s"
```

For more sample files, see [examples](https://github.com/chaos-mesh/chaos-mesh/tree/master/examples). You can edit them as needed.

## Fields description

- **action**: Defines the chaos action for DNS chaos. Supported actions are:
    - `error` - Get an error when sending the DNS request
    - `random` - Get a random IP when sending the DNS request

* **scope**: Defines the scope of the DNS chaos. Supported scopes are:
    - `outer` - DNS chaos only works on outer hosts of the Kubernetes cluster
    - `inner`- DNS chaos only works on inner hosts of the Kubernetes cluster
    - `all` - DNS chaos works on all hosts.

* **selector**: Specifies the target pods for chaos injection. For more details, see [Define the Scope of Chaos Experiment](../user_guides/experiment_scope.md).


## Notes

- Currently, DNSChaos only supports record types `A` and `AAAA`.
- The chaos DNS service runs CoreDNS with the  [k8s_dns_chaos](https://github.com/chaos-mesh/k8s_dns_chaos) plugin. If the CoreDNS service in your Kubernetes cluster contains some special configurations, you can edit configMap `dns-server-config` to make the configuration of the chaos DNS service consistent with that of the K8s CoreDNS service as shown below:

    ```bash
    kubectl edit configmap dns-server-config -n chaos-testing
    ```
