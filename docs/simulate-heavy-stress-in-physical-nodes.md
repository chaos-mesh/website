---
title: Simulate Stress Scenarios
sidebar_label: Simulate Stress Scenarios
---

This document describes how to use Chaosd to simulate stress scenarios. This feature generates CPU or memory stress on the host using [stress-ng](https://wiki.ubuntu.com/Kernel/Reference/stress-ng). You can create stress experiments either in command-line or service mode.

## Create stress experiments in command-line mode

This section describes how to create stress experiments in command-line mode.

Before creating stress experiments, you can run the following command to view the stress experiment types supported by Chaosd：

```bash
chaosd attack stress --help
```

The result is as follows:

```bash
Stress attack related commands

Usage:
  chaosd attack stress [command]

Available Commands:
  cpu         continuously stress CPU out
  mem         continuously stress virtual memory out

Flags:
  -h, --help   help for stress

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'

Use "chaosd attack stress [command] --help" for more information about a command.
```

Currently, Chaosd supports creating CPU stress experiments and memory stress experiments.

### Simulating CPU stress

#### Command of simulating CPU stress

To view the configuration items supported by the CPU stress simulation, run the following command:

```bash
chaosd attack stress cpu --help
```

The result is as follows:

```bash
continuously stress CPU out

Usage:
  chaosd attack stress cpu [options] [flags]

Flags:
  -h, --help              help for cpu
  -l, --load int          Load specifies P percent loading per CPU worker. 0 is effectively a sleep (no load) and 100 is full loading. (default 10)
  -o, --options strings   extend stress-ng options.
  -w, --workers int       Workers specifies N workers to apply the stressor. (default 1)

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### Configuration description of simulating CPU stress

| Configuration Item | Abbreviation | Descpription                                                                                           | Value                                    |
|:------------------ |:------------ |:------------------------------------------------------------------------------------------------------ |:---------------------------------------- |
| load               | l            | Specifies the percentage of CPU load per CPU worker. 0 means no CPU load, and 100 means full CPU load. | int; range: 0 to 100; default value: 10. |
| workers            | w            | Specifies the number of workers used to create CPU stress.                                             | int; default value: 1.                   |
| options            | o            | The extended parameter of stress-ng, usually not configured.                                           | string; default value: "".               |

#### Example of simulating CPU stress

```bash
chaosd attack stress cpu --workers 2 --load 10
```

The result is as follows:

```bash
[2021/05/12 03:38:33.698 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --cpu 2 --cpu-load 10"]
[2021/05/12 03:38:33.702 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --cpu 2 --cpu-load 10"] [Pid=27483]
Attack stress cpu successfully, uid: 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
```

### Simulating memory stress

#### Command of simulating memory stress

To view the configuration items supported by the memory stress simulation, run the following command:

```bash
chaosd attack stress mem --help
```

The result is as follows:

```bash
continuously stress virtual memory out

Usage:
  chaosd attack stress mem [options] [flags]

Flags:
  -h, --help              help for mem
  -o, --options strings   extend stress-ng options.
  -s, --size string       Size specifies N bytes consumed per vm worker, default is the total available memory. One can specify the size as % of total available memory or in units of B, KB/KiB, MB/MiB, GB/GiB, TB/TiB..
  -w, --workers int       Workers specifies N workers to apply the stressor. (default 1)

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### Configuration description of simulating memory stress

| Configuration Item | Abbreviation | Description                                                  | Value                                                                                                                  |
|:------------------ |:------------ |:------------------------------------------------------------ |:---------------------------------------------------------------------------------------------------------------------- |
| size               | s            | Specifies the size of memory per VM worker.                  | the memory size in B, KB/KiB, MB/MiB, GB/GiB, TB/TiB. If the size is not set, all available memory is used by default. |
| workers            | w            | Specify the number of workers used to create memory stress.  | int; default value: 1                                                                                                  |
| options            | o            | The extended parameter of stress-ng, usually not configured. | string; default value: "".                                                                                             |

#### Example of simulating memory stress

```bash
chaosd attack stress mem --workers 2 --size 100M
```

The result is as follows:

```bash
[2021/05/12 03:37:19.643 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --vm 2 --vm-keep --vm-bytes 100000000"]
[2021/05/12 03:37:19.654 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --vm 2 --vm-keep --vm-bytes 100000000"] [Pid=26799]
Attack stress mem successfully, uid: c2bff2f5-3aac-4ace-b7a6-322946ae6f13
```

When running the experiment, you need to save the uid information of the experiment. When a stress simulation is not needed, you can use `recover` to terminate the uid-related experiment:：

```bash
chaosd recover c2bff2f5-3aac-4ace-b7a6-322946ae6f13
```

The result is as follows:

```bash
Recover c2bff2f5-3aac-4ace-b7a6-322946ae6f13 successfully
```

## Create stress experiments in service mode

(To be added)
