---
title: Simulate Stress Scenarios
---

This document describes how to use Chaosd to simulate stress scenarios. This feature generates CPU or memory stress on the host using [stress-ng](https://wiki.ubuntu.com/Kernel/Reference/stress-ng). You can create stress experiments either in command-line or service mode.

## Create stress experiments using command-line mode

This section describes how to create stress experiments using command-line mode.

Before creating stress experiments, you can run the following command to view the stress experiment types supported by Chaosd:

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

### Simulate CPU stress using command-line mode

#### Command for simulating CPU stress

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

#### Configuration description for simulating CPU stress

| Configuration item | Abbreviation | Description | Type                                                                                             | Value                                    |
| :----------------- | :----------- | :----------------------------------------------------------------------------------------------------- | :---------------------------------------| :--------------------------------------- |
| `load`               | l            | Specifies the percentage of CPU load per CPU worker. `0` means no CPU utilization, and `100` means full CPU utilization. | int | Range: `0` to `100`; Default value: `10`. |
| `workers`            | w            | Specifies the number of workers used to create CPU stress.                                             | int | Default value: 1.                   |
| `options`            | o            | The extended parameter of stress-ng, usually not configured.                                           | string | Default value: "".               |

#### Example for simulating CPU stress

```bash
chaosd attack stress cpu --workers 2 --load 10
```

The result is as follows:

```bash
[2021/05/12 03:38:33.698 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --cpu 2 --cpu-load 10"]
[2021/05/12 03:38:33.702 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --cpu 2 --cpu-load 10"] [Pid=27483]
Attack stress cpu successfully, uid: 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
```

### Simulating memory stress using command-line mode

#### Command for simulating memory stress

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

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### Configuration description for simulating memory stress

| Configuration item | Abbreviation | Description | Type                                                  | Value                                                                                                                  |
| :----------------- | :----------- | :-----------------------------------------------------------  | :----------- | :--------------------------------------------------------------------------------------------------------------------- |
| `size`               | s            | Specifies the size of memory per VM worker.                  | string | The memory size in B, KB/KiB, MB/MiB, GB/GiB, TB/TiB. If the size is not set, all available memory is used by default. |
| `options`            | o            | The extended parameter of stress-ng, usually not configured. | string | Default value: "".                                                                                            |

#### Example for simulating memory stress

```bash
chaosd attack stress mem --workers 2 --size 100M
```

The result is as follows:

```bash
[2021/05/12 03:37:19.643 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --vm 2 --vm-keep --vm-bytes 100000000"]
[2021/05/12 03:37:19.654 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --vm 2 --vm-keep --vm-bytes 100000000"] [Pid=26799]
Attack stress mem successfully, uid: c2bff2f5-3aac-4ace-b7a6-322946ae6f13
```

When running the experiment, you need to save the uid information of the experiment. When a stress simulation is not needed, you can use `recover` to terminate the uid-related experiment::

```bash
chaosd recover c2bff2f5-3aac-4ace-b7a6-322946ae6f13
```

The result is as follows:

```bash
Recover c2bff2f5-3aac-4ace-b7a6-322946ae6f13 successfully
```

## Create stress experiments using service mode

To create experiments using service mode, follow the instructions below:

1. Run Chaosd in service mode:

   ```bash
   chaosd server --port 31767
   ```

2. Send a `POST` HTTP request to the `/api/attack/{uid}` path of Chaosd service.

   ```bash
   curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{fault-configuration}'
   ```

   For the `fault-configuration` part in the above command, you need to configure it according to the fault types. For the corresponding parameters, refer to the parameters and examples of each fault type in the following sections.

:::note

When running an experiment, remember to save the UID information of the experiment. When you want to end the experiment corresponding to the UID, you need to send an HTTP DELETE request to the `/api/attack/{uid}` path of Chaosd service.

:::

### Simulate CPU stress using service mode

#### Parameters for simulating CPU stress

| Parameter | Description | Type | Value |
| :-- | :-- | :-- | :-- |
| `action` | Actions of the experiment |  | Set to "cpu" |
| `load` | Specifies the percentage of CPU load per CPU worker. `0` means no CPU utilization, and `100` means full CPU utilization. | int | Range: `0` to `100`; Default value: `10` |
| `workers` | Specifies the number of workers used to create CPU stress | int | Default value: `1` |
| `options` | The extended parameter of stress-ng, usually not configured. | string | Default value: "" |

#### Example for simulating CPU stress using service mode

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"load":10, "action":"cpu","workers":1}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

### Simulate memory stress using service mode

#### Parameters for simulating memory stress

| Parameter | Description | Type | Value |
| :-- | :-- | :-- | :-- |
| `action` | Actions of the experiment |  | Set to "mem" |
| `size` | Specifies the size of memory per VM worker | string | the memory size in B, KB/KiB, MB/MiB, GB/GiB, TB/TiB. If the size is not set, all available memory is used by default.|
| `options` | The extended parameter of stress-ng, usually not configured. | string | Default value: "" |

#### Example for simulating memory stress using service mode

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"size":"100M", "action":"mem"}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```