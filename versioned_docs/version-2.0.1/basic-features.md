---
title: Basic Features
---

This document describes the basic features of Chaos Mesh, including [fault injection](#fault-injection), [Chaos experiment scenarios](#chaos-experiment-scenarios), [visualized operations](#visualized-operations), and [security guarantees](#security-guarantees).

## Fault injection

Fault injection is the key of Chaos experiments. Chaos Mesh covers a full range of faults that might occur in a distributed system, and provides three comprehensive and fine-grained fault types: basic resource faults, platform faults, and application-layer faults.

- Basic resource faults:
  - [PodChaos](simulate-pod-chaos-on-kubernetes.md): simulates Pod failures, such as Pod node restart, Pod's persistent unavailablility, and certain container failures in a specific Pod.
  - [NetworkChaos](simulate-network-chaos-on-kubernetes.md): simulates network failures, such as network latency, packet loss, packet disorder, and network partitions.
  - [DNS Chaos](simulate-dns-chaos-on-kubernetes.md): simulates DNS failures, such as the parsing failure of DNS domain name and the wrong IP address returned.
  - [HTTPChaos](simulate-http-chaos-on-kubernetes.md): simulates HTTP communication failures, such as HTTP communication latency.
  - [StressChaos](simulate-heavy-stress-on-kubernetes.md): simulates CPU race or memory race.
  - [IOChaos](simulate-io-chaos-on-kubernetes.md): simulates the I/O failure of an application file, such as I/O delays, read and write failures.
  - [TimeChaos](simulate-time-chaos-on-kubernetes.md): simulates the time jump exception.
  - [KernelChaos](simulate-kernel-chaos-on-kubernetes.md): simulates kernel failures, such as an exception of the application memory allocation.
- Platform faults:
  - [AWSChaos](simulate-aws-chaos.md): simulates AWS platform failures, such as the AWS node restart.
  - [GCPChaos](simulate-gcp-chaos.md): simulates GCP platform failures, such as the GCP node restart.
- Application faults:
  - [JVMChaos](simulate-jvm-application-chaos.md): simulates JVM application failures, such as the function call delay.

## Chaos experiment scenarios

A Chaos experiment scenario includes a set of Chaos experiments and an application status check, so you can complete the entire process of a Chaos engineering project on the platform.

To run a Chaos scenario, you can perform a series of Chaos experiments, keep expanding the explosion radius (including the scope of attacks), and increase the failure types.After running a Chaos experiment, you can easily view the current state of the application using Chaos Mesh and determine whether to perform follow-up experiments.At the same time, to reduce the cost of Chaos experiments, you can keep updating and accumulating the Chaos experiment scenarios, and apply the existing experiment scenarios to other applications.

Currently, Chaos experiment scenarios provide the following features:

- Orchestrate serial Chaos experiments
- Orchestrate parallel Chaos experiments
- Support checking experimental status and results
- Support pausing a Chaos experiment
- Support using YAML files to define and manage Chaos experiment scenarios
- Support using the web UI to define and manage Chaos experiment scenarios

For the configuration of a specific experiment scenario, see [ Create the Chaos Mesh workflow](create-chaos-mesh-workflow.md).

## Visualized operations

Chaos Mesh provides the Chaos Dashboard component for visualized operations, which greatly simplifies Chaos experiments.You can manage and monitor a Chaos experiment directly through the visualization interface. For example, with a few clicks on the interface, you can define the scope of a Chaos experiment, specify the type of Chaos injection, define scheduling rules, and get the results of the Chaos experiment.

![Chaos experiment scenarios](img/dashboard-overview.png)

## Security guarantee

Chaos Mesh manages permissions using the native [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) feature in Kubernetes.

You can freely create multiple roles based on your actual permission requirements, bind the roles to the username service account, and then generate the token corresponding to the service account.When you log into the Dashboard using this token, you can only perform Chaos experiments within the permissions given by the service account.

In addition, you can specify the namespaces that allow Chaos experiments by setting the namespace annotations, which further safeguards the control of Chaos experiments.
