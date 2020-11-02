---
id: dnschaos_experiment
title: DNSChaos Experiment
sidebar_label: DNSChaos Experiment
---

This document describes how to create DNSChaos experiments in Chaos Mesh.

## Deploy DNS service for chaos

To create DNSChaos experiments in Chaos Mesh, need to deploy a DNS service in Chaos Mesh by executing the command below:

```bash
helm upgrade chaos-mesh helm/chaos-mesh --namespace=chaos-testing --set dnsServer.create=true
```

Then check the status of this DNS service:

```bash
kubectl get pods -n chaos-testing -l app.kubernetes.io/component=chaos-dns-server
```

Make sure the pod's `STATUS` is `Running`.

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

* **action** Defines the chaos action about DNS. Supported action: `error` / `random`.
    - `error` Get error when send DNS request.
    - `random` Get random IP when send DNS request.

* **scope** Defines the scope in which the DNS chaos works. Supported scope: `outer` / `inner` / `all`.
    - `outer` DNS chaos only works on the host outer of the Kubernetes cluster.
    - `inner` DNS chaos only works on the inner host in the Kubernetes cluster.
    - `all` DNS chaos works on all hosts.

* **selector** specifies the target pods for chaos injection. For more details, see [Define the Scope of Chaos Experiment](../user_guides/experiment_scope.md).


## Notes

- Now DNS chaos only supports record type `A` and `AAAA`.
- Chaos DNS Service runs coredns with plugin [k8s_dns_chaos](https://github.com/chaos-mesh/k8s_dns_chaos), If the coredns service in your K8s cluster contains some special configurations, you can edit configMap `dns-server-config` to make the configuration of chaos DNS service consistent with the K8s coredns service:

    ```bash
    kubectl edit configmap dns-server-config -n chaos-testing
    ```

