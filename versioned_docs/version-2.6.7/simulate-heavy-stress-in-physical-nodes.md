---
title: Simulate Stress Scenarios
---

This document describes how to use Chaosd to simulate stress scenarios. This feature generates CPU or memory stress on the host using [stress-ng](https://wiki.ubuntu.com/Kernel/Reference/stress-ng). You can create stress experiments either in command-line or service mode.

Before creating stress experiments, you can run the following command to view the stress experiment types supported by Chaosd:

```bash
chaosd attack stress --help
```

Currently, Chaosd supports creating CPU stress experiments and memory stress experiments.

To create experiments using the service mode, you need to run Chaosd in the service mode and then send a `POST` HTTP request to the `/api/attack/stress` path of the Chaosd service:

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{fault-configuration}'
```

For the `fault-configuration` part in the above command, you need to configure it according to the fault types. For the corresponding parameters and examples, refer to the parameters of each fault type in the following sections.

:::info

When running an experiment, remember to record the UID of the experiment. When you want to end the experiment corresponding to the UID, you need to send a `DELETE` HTTP request to the `/api/attack/{uid}` path of the Chaosd service.

:::

## Simulate CPU stress

### Parameters for simulating CPU stress

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Actions of the experiment | string | Set to `"cpu"` |
| `load` | l | `load` | Specifies the percentage of CPU load per CPU worker. `0` means no CPU utilization, and `100` means full CPU utilization. | int | Range: `0` to `100`; Default value: `10`. |
| `workers` | w | `workers` | Specifies the number of workers used to create CPU stress. | int | Default value: `1`. |
| `options` | o | `options` | The extended parameter of stress-ng, usually not configured. | string | Default value: `""`. |

### Simulate CPU stress using the command-line mode

To view the configuration items supported by the CPU stress simulation, run the following command:

```bash
chaosd attack stress cpu --help
```

An example is as follows:

```bash
chaosd attack stress cpu --workers 2 --load 10
```

### Simulate CPU stress using the service mode

Send a `POST` HTTP request to the `/api/attack/stress` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"load":10, "action":"cpu","workers":1}'
```

## Simulate memory stress

### Parameters for simulating memory stress

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | Actions of the experiment | string | Set to `"mem"` |
| `size` | s | `size` | Specifies the size of memory per VM worker. | string | The memory size in B, KB/KiB, MB/MiB, GB/GiB, TB/TiB. If the size is not set, all available memory is used by default. |
| `workers` | w | `workers` | Specifies the number of workers used to create memory stress. | int | Default value: `1`. |
| `options` | o | `options` | The extended parameter of stress-ng, usually not configured. | string | Default value: `""`. |

:::info

The `--workers` flag for `chaosd attack stress mem` was restored in chaosd v1.6.0. If you use an earlier version of chaosd, this flag is not available.

:::

### Simulate memory stress using the command-line mode

To view the configuration items supported by the memory stress simulation, run the following command:

```bash
chaosd attack stress mem --help
```

An example is as follows:

```bash
chaosd attack stress mem --workers 2 --size 100M
```

When running the experiment, you need to save the uid information of the experiment. When a stress simulation is not needed, you can use `recover` to terminate the uid-related experiment:

```bash
chaosd recover c2bff2f5-3aac-4ace-b7a6-322946ae6f13
```

### Simulate memory stress using the service mode

Send a `POST` HTTP request to the `/api/attack/stress` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"action":"mem", "workers":2, "size":"100M"}'
```
