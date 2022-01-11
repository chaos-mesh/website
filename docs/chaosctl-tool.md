---
title: chaosctl
---

chaosctl is a tool to assist in debugging Chaos Mesh. With chaosctl, you can simplify the process of developing and debugging new chaos types, and provide references for other developers when raising an issue.

## Get chaosctl

For Linux users, you can directly download the executable file for chaosctl.

```bash
curl -sSL https://mirrors.chaos-mesh.org/latest/chaosctl
```

For Windows or macOS users, you can compile it from the source code. Go v1.15 or above is recommended for compiling. Perform the following steps:

1. Clone the Chaos Mesh repository to your local machine.

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   ```

2. Switch to the Chaos Mesh directory.

3. Execute the following command:

   ```bash
   make chaosctl
   ```

   The compiled executable file is at `bin/chaosctl`.

## Features

Currently, chaosctl supports printing logs and debugging information for Chaos experiments.

### Printing logs

To print the logs from all Chaos Mesh components, use the `chaosctl logs` command. To check the help information and examples of this feature, use the `chaosctl logs -h` command. An example command is as follows:

```bash
chaosctl logs -t 100 # Print the last 100 lines of logs from all components
```

### Printing debugging information

To print debugging information, use the `chaosctl debug` command. To check the help information and examples of this feature, use the `chaosctl debug -h` command. When you are debugging, you need to make sure chaosctl is connected to the corresponding `chaos-daemon`. If you disable TLS (enabled by default) when deploying Chaos Mesh, add the `-i` option to tell chaosctl that TLS is not used. An example command is as follows:

```bash
./chaosctl debug -i networkchaos web-show-network-delay
```

Currently, chaosctl only supports the debugging of IOChaos, NetworkChaos, and StressChaos.

### Generate TLS certs for Choasd

For secure communication between Chaosd and Chaos-controller-manager services, Chaos Mesh recommends enabling mTLS mode. Chaosctl provides convenient commands to generate TLS certificates, and there are two options to execute the commands in different scenarios.

**Scenario 1**: Nodes running chaosctl can access the Kubernetes cluster and ssh to the physical machine

In this scenario, the operation steps are as follows:

1. Using `chaosctl pm init` command:

   ```bash
   ./chaosctl pm init pm-name --ip=123.123.123.123 -l arch=amd64,anotherkey=value
   ```

   This command performs the following actions: 
   
   - generate the required certificates for Chaosd with one click and save them to the corresponding physical machine.
   - create the corresponding `PhysicalMachine` resource in the Kubernetes cluster.

   For more information and examples of this feature, please refer to `chaosctl pm init -h`.

**Scenario 2**: Nodes running chaosctl can access the Kubernetes cluster, but cannot ssh to the physical machine

1. Before executing the command, you need to manually obtain the CA certificate from the Kubernetes cluster. An example command is as follows:

   ```bash
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-testing -o "jsonpath={.data['ca\.crt']}" | base64 -d > ca.crt

   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-testing -o "jsonpath={.data['ca\.key']}" | base64 -d> ca.key
   ```

2. Copy the `ca.crt` and `ca.key` files to **the corresponding physical machine**, for example, to the `/etc/chaosd/pki` directory.
   
3. Then, on **the physical machine**, use the `chaosctl pm generate` command to generate TLS certificates (the default path for saving certifacates is `/etc/chaosd/pki`). An example command is as follows:

   ```bash
   ./chaosctl pm generate --cacert=/etc/chaosd/pki/ca.crt --cakey=/etc/chaosd/pki/ca.key
   ```

   For more information and examples of this feature, please refer to `chaosctl pm generate -h`.

4. Finally, use the `chaosctl pm create` command to create a `PhysicalMachine` resource in the Kubernetes cluster on a machine that has access to the Kubernetes cluster. An example command is as follows:

   ```bash
   ./chaosctl pm create pm-name --ip=123.123.123.123 -l arch=amd64
   ```

   For more information and examples of this feature, please refer to `chaosctl pm create -h`.
## Scenarios

If you want to raise an issue about Chaos Mesh, it is recommended to attach the relevant logs and chaos information. Therefore, you can attach the output of `chaosctl logs` to the end of the issue for developers' reference. If you want to raise issues about IOChaos, NetworkChaos or StressChaos, you can also attach the output from `chaosctl debug`.

## Development and improvement

The code of chaosctl is currently hosted in the Chaos Mesh project. You can refer to [chaos-mesh/pkg/chaosctl](https://github.com/chaos-mesh/chaos-mesh/tree/master/pkg/chaosctl) for details. If you are interested in helping us improve this tool, contact us by [Slack](https://cloud-native.slack.com/archives/C0193VAV272) or raise the issue in the Chaos Mesh project.
