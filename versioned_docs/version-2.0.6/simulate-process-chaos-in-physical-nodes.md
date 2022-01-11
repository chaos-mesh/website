---
title: Simulate Process Faults
---

This document describes how to use Chaosd to simulate process faults. The process faults use the Golang interface of the `kill` command to simulate the scenarios that the process is killed or stopped. You can create experiments in the command-line mode.

## Create experiments using the command-line mode

Before creating an experiment, you can run the following command to see the process fault types that are supported by Chaosd:

```bash
chaosd attack process -h
```

The result is as follows:

```bash
Process attack related commands

Usage:
  chaosd attack process [command]

Available Commands:
  kill        kill process, default signal 9
  stop        stop process, this action will stop the process with SIGSTOP

Flags:
  -h, --help   help for process

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'

Use "chaosd attack process [command] --help" for more information about a command.
```

Currently, Chaosd supports simulating that a process is killed or stopped.

### Killing a process using the command-line mode

#### Command for killing a process

```bash
chaosd attack process kill -h
```

The result is as follows:

```bash
kill process, default signal 9

Usage:
  chaosd attack process kill [flags]

Flags:
  -h, --help             help for kill
  -p, --process string   The process name or the process ID
  -s, --signal int       The signal number to send (default 9)

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### Configuration description for killing a process

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| `process` | p | The name or the identifier of the process to be injected faults | string; the default value is `""`. |
| `signal` | s | The provided value of the process signal | int; the default value is `9`. Currently, only `SIGKILL`, `SIGTERM`, and `SIGSTOP` are supported. |

#### Example for killing a process

```bash
chaosd attack process kill -p python
```

The result is as follows:

```bash
Attack process python successfully, uid: 10e633ac-0a37-41ba-8b4a-cd5ab92099f9
```

### Stopping a process using the command-line mode

#### Command for stopping a process

```bash
chaosd attack process stop -h
```

The result is as follows:

```bash
stop process, this action will stop the process with SIGSTOP

Usage:
  chaosd attack process stop [flags]

Flags:
  -h, --help             help for stop
  -p, --process string   The process name or the process ID

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### Configuration description for stopping a process

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| `process` | p | The name or the identifier of the process to be stopped | string; the default value is `""`. |

#### Example for stopping a process

```bash
chaosd attack process stop -p python
```

The result is as follows:

```bash
Attack process python successfully, uid: 9cb6b3be-4f5b-4ecb-ae05-51050fcd0010
```