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

## Scenarios

If you want to raise an issue about Chaos Mesh, it is recommended to attach the relevant logs and chaos information. Therefore, you can attach the output of `chaosctl logs` to the end of the issue for developers' reference. If you want to raise issues about IOChaos, NetworkChaos or StressChaos, you can also attach the output from `chaosctl debug`.

## Development and improvement

The code of chaosctl is currently hosted in the Chaos Mesh project. You can refer to [chaos-mesh/pkg/chaosctl](https://github.com/chaos-mesh/chaos-mesh/tree/master/pkg/chaosctl) for details. If you are interested in helping us improve this tool, contact us by [Slack](https://cloud-native.slack.com/archives/C0193VAV272) or raise the issue in the Chaos Mesh project.
