---
title: Simulate Process Faults
---

This document describes how to use Chaosd to simulate process faults. The process faults use the Golang interface of the `kill` command to simulate the scenarios that the process is killed or stopped. You can create experiments either in the command-line mode or service mode.

Before creating an experiment, you can run the following command to see the process fault types that are supported by Chaosd:

```bash
chaosd attack process -h
```

Currently, Chaosd supports simulating that a process is killed or stopped.

To create experiments using the service mode, you need to run Chaosd in the service mode and then send a `POST` HTTP request to the `/api/attack/process` path of the Chaosd service:

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{fault-configuration}'
```

For the `fault-configuration` part in the above command, you need to configure it according to the fault types. For the corresponding parameters and examples, refer to the parameters of each fault type in the following sections.

:::note

When running an experiment, remember to record the UID of the experiment. When you want to end the experiment corresponding to the UID, you need to send a `DELETE` HTTP request to the `/api/attack/{uid}` path of the Chaosd service.

:::

## Kill a process

### Parameters for killing a process

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `process` | p | `process` | The name or the identifier of the process into which faults are injected | string | The default value is `""`. |
| `recover-cmd` | r | `recover-cmd` | The command to be run when recovering experiment | string | The default value is `""`. |
| `signal` | s | `signal` | The provided value of the process signal | int | The default value is `9`. Currently, only `SIGKILL`, `SIGTERM`, and `SIGSTOP` are supported. |

### Kill a process using the command-line mode

Run the following command to see the commands for killing a process:

```bash
chaosd attack process kill -h
```

The example for killing a process is as follows:

```bash
chaosd attack process kill -p python
```

:::note

Only the experiments whose `signal` is `SIGSTOP` or that configure `recover-cmd` can be recovered.

:::

### Kill a process using the service mode

Terminate a process:

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{"process":"12345","signal":15}'
```

## Stop a process

### Parameters for stopping a process

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `process` | p | process | The name or the identifier of the process to be stopped | string | The default value is `""`. |
| `signal` | — | signal | The provided value of the process signal | int | The default value is `9`. |

### Stop a process using the command-line mode

Run the following command to see the command for stopping a process:

```bash
chaosd attack process stop -h
```

The example for stopping a process is as follows:

```bash
chaosd attack process stop -p python
```

### Stop a process using the service mode

Stop a process:

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{"process":"12345","signal":19}'
```
