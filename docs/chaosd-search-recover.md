---
title: Search and Recover Experiments of Chaosd
summary: Describes how to search and recover the experiments of Chaosd, and provides related examples.
---

You can search experiments by conditions and recover the experiments corresponding to specified UIDs using Chaosd. This document describes how to search and recover experiments of Chaosd, and provides related examples.

This page applies to Chaosd v1.5.0 and later. See [Chaosd Introduction](chaosd-overview.md) for installation and runtime requirements.

## Search experiments of Chaosd

This section introduces how to use command-line mode and service mode to find experiments of Chaosd.

### Search experiments using the command-line mode

By running the following command, you can view the configurations supported by the `search` command:

```bash
chaosd search --help
```

#### Configuration description

| Configuration item | Abbreviation | Description | Type |
| :-- | :-- | :-- | :-- |
| `all` | A | Lists all experiments | bool |
| `asc` | None | Set to `true` to sort by creation time in ascending order. The default is `false`, which sorts by creation time in descending order. | bool |
| `kind` | k | Lists experiments of the specified kind | string. The supported kinds are as follows: `network`, `process`, `stress`, `disk`, `disk-server`, `host`, `jvm`, `clock`, `kafka`, `redis`, `file`, `http`, `vm`, `userDefined` |
| `limit` | l | The number of listed experiments | uint32 |
| `offset` | o | Searches from the specified offset | uint32 |
| `status` | s | Lists experiments with the specified status | string. The supported types are as follows: `created`, `success`, `error`, `scheduled`, `destroyed`, `revoked` |

#### Example

```bash
./chaosd search --kind network --status destroyed --limit 1
```

By running this command, you can search the experiments of the kind of `network` in the status of `destroyed` (indicating that the experiment has been recovered).

Starting with Chaosd v1.5.0, you can search for scheduled experiments:

```bash
chaosd search --status scheduled
```

### Search experiments using the service mode

Currently, the service mode only supports searching all experiments. You can get the data by visiting the `/api/experiments/` path of Chaosd service.

#### Example

```bash
curl -X GET 127.0.0.1:31767/api/experiments/
```

## Recover experiments of Chaosd

After creating an experiment, if you want to withdraw the impact caused by the experiment, you can use the recovery feature of experiments.

Recovery depends on the fault type. Starting with Chaosd v1.5.0, recovering a host shutdown or reboot, or a killed process without `recover-cmd`, returns an error. Redis cache expiration cannot restore expired keys, even if the recovery request reports success. Check the target itself after recovery.

Starting with Chaosd v1.6.0, recovering an experiment already recorded as `destroyed` returns success without running cleanup again. This applies to both `chaosd recover <UID>` and `DELETE /api/attack/{uid}`.

Schedules and recovery timers exist only in the process that created them. Restarting the service does not reload them from the database. To cancel a schedule, send `DELETE /api/attack/{uid}` to the same running Chaosd service that created it. CLI recovery uses a separate scheduler and cannot cancel a schedule in another service process. The current run relies on its existing recovery timer.

### Recover experiments using the command-line mode

You can recover an experiment by using Chaosd recover UID.

The following example shows how to recover an experiment using the command-line mode.

1. Create a CPU stress experiment using Chaosd:

   ```bash
   chaosd attack stress cpu --workers 2 --load 10
   ```

   Save the experiment UID for later use.

2. When you do not need to simulate the CPU stress scenario anymore, use the `recover` command to recover the experiment corresponding to the UID:

   ```bash
   chaosd recover 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
   ```

### Recover experiments using the service mode

You can recover an experiment by sending a `DELETE` HTTP request to the `/api/attack/{uid}` path of Chaosd service.

The following example shows how to recover an experiment using the service mode.

1. Send a `POST` HTTP request to the Chaosd service to create a CPU stress experiment:

   ```bash
   curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"load":10, "action":"cpu","workers":1}'
   ```

   Save the experiment UID for later use.

2. When you do not need to simulate the CPU stress scenario anymore, run the following command to recover the experiment corresponding to the UID:

   ```bash
   curl -X DELETE 172.16.112.130:31767/api/attack/c3c519bf-819a-4a7b-97fb-e3d0814481fa
   ```
