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

### Generate TLS certificates for Chaosd

When a request is initiated between Chaosd and Chaos Mesh, to ensure communications security between Chaosd and Chaos-controller-manager services, Chaos Mesh recommends enabling mTLS (Mutual Transport Layer Security) mode.

To enable mTLS mode, the TLS certificate parameters should be configured in Chaosd and Chaos mesh. Therefore, make sure that Chaosd and Chaos Mesh have generated TLS certificates, then start Chaosd and Chaos Mesh with the TLS certificate as parameters.

- Chaosd: You can start Chaosd before **or** after configuring TLS certificate parameters. For clusters security, it is recommended to configure TLS certificate parameters first, and then start Chaosd. For details, see [Deploy Chaosd server](simulate-physical-machine-chaos.md#deploy-chaosd-server).
- Chaos Mesh: If you deployed Chaos Mesh using Helm, TLS certificate parameters are configured by default.

If your Chaosd does not generate a TLS certificate, you can use Chaosctl to easily generate the certificate through the command lines. In the following use cases, Chaosctl runs commands through different schemes.

**Case 1**: The nodes where Chaosctl runs can access Kubernetes clusters and connect to a physical machine using SSH tools.

Run the following commands to complete the operations:

- Command: Use `chaosctl pm init` command:

   ```bash
   ./chaosctl pm init pm-name --ip=123.123.123.123 -l arch=amd64,anotherkey=value
   ```

- Operation: The command performs the following operations.
   
   - Generate the required certificate for Chaosd simply, and save the certificate to the corresponding physical machine.
   - Create the corresponding `PhysicalMachine` resource in Kubernetes clusters.

For further information and examples of this feature, refer to `chaosctl pm init -h`.

**Case 2**: The nodes where Chaosctl runs can access Kubernetes clusters, but they cannot connect to a physical machine using SSH tools.

Run the following commands to complete the operations:

1. Before executing the command, you need to manually get a CA certificate from Kubernetes clusters through commands. For example:

   ```bash
   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-testing -o "jsonpath={.data['ca\.crt']}" | base64 -d > ca.crt

   kubectl get secret chaos-mesh-chaosd-client-certs -n chaos-testing -o "jsonpath={.data['ca\.key']}" | base64 -d> ca.key
   ```

2. Copy the `ca.crt` and `ca.key` files to **the corresponding physical machine**. For example, copy the files to the `/etc/chaosd/pki` directory.
   
3. Use the `chaosctl pm generate` command to generate TLS certificates (save to `/etc/chaosd/pki by default) on **the physical machine**. For example:

   ```bash
   ./chaosctl pm generate --cacert=/etc/chaosd/pki/ca.crt --cakey=/etc/chaosd/pki/ca.key
   ```

   For further information and examples of this feature, refer to `chaosctl pm generate -h`.

4. Use the `chaosctl pm create` command to create a `PhysicalMachine` resource in Kubernetes clusters on the machine that has access to Kubernetes clusters. For example:

   ```bash
   ./chaosctl pm create pm-name --ip=123.123.123.123 -l arch=amd64
   ```

   For further information and examples of this feature, refer to `chaosctl pm create -h`.

## Questions and feedback

The code of Chaosctl is currently hosted in the Chaos Mesh project. For details, refer to [chaos-mesh/pkg/chaosctl](https://github.com/chaos-mesh/chaos-mesh/tree/master/pkg/chaosctl).

If you encounter problems during performing operations, or you are interested in helping us improve this tool, 
you are welcome to contact the Chaos Mesh team through [CNCF Slack](https://cloud-native.slack.com/archives/C0193VAV272), or create an [GitHub issue](https://github.com/chaos-mesh/chaos-mesh/issues).

When describing your issues, it would be helpful to attach related logs and Chaos information. To provide reference material for developers, you are encouraged to attach the results of `chaosctl logs` to your questions. Besides, if your question is related to iochaos, networkchaos, stresschaos, the `chaosctl debug` related information also helps to diagnose the problem.
