---
title: Search and Recover Experiments Using Chaosd
summary: Describes how to search and recover the experiments created by Chaosd, and provide related examples.
---

Chaosd supports searching experiments according to conditions, and recovering the experiments corresponding to specified UIDs. This document describes how to search and recover experiments using Chaosd, and provides releated examples.

## Search experiments using Chaosd

This section introduces how to use command-line mode and service mode to find experiments using Chaosd.

### Search experiments using command-line mode 

By running the following command, you can view the configurations supported by the currently searched experiment:

```bash
chaosd search --help
Search chaos attack, you can search attacks through the uid or the state of the attack

Usage:
  chaosd search UID [flags]

Flags:
  -A, --all             list all chaos attacks
      --asc             order by CreateTime, default value is false that means order by CreateTime desc
  -h, --help            help for search
  -k, --kind string     attack kind, supported value: network, process, stress, disk, host, jvm
  -l, --limit uint32    limit the count of attacks
  -o, --offset uint32   starting to search attacks from offset
  -s, --status string   attack status, supported value: created, success, error, destroyed, revoked

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### Configuration description

| Configuration item | Abbreviation | Description | Type |
| :-- | :-- | :-- | :-- |
| `all` | A | Lists all experiments | bool |
| `asc` | None | Sorts the experiments in ascending order of the created time. The default value is `false`.| bool |
| `kind` | k | Lists experiments of the specified kind | string. The supported kinds are as follows:`network`, `process`, `stress`, `disk`, `host`, `JVM` |
| `limit` | l | Lists the number of experiments | int |
| `offset` | o | Searches from the specified offset | int |
| `status` | s | Lists experiments with the specified status | string. The supported types are as follows:`created`, `success`, `error`, `destroyed`, `revoked`

#### Example

```bash
./chaosd search --kind network --status destroyed --limit 1
```

By running this command, you can search the experiments of the kind of `network` in the status of `destroyed` (indicating that the experiment has been restored).

After running the command, only one row of data is output in the result.

The result is as follows:

```bash
                  UID                     KIND     ACTION    STATUS            CREATE TIME                                                                                                                  CONFIGURATION
--------------------------------------- --------- -------- ----------- --------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  1f6c1253-522a-43d9-83f8-42607102b3b9   network   delay    destroyed   2021-11-02T15:14:07+08:00   {"schedule":"","duration":"","action":"delay","kind":"network","uid":"1f6c1253-522a-43d9-83f8-42607102b3b9","latency":"2s","jitter":"0ms","correlation":"0","device":"eth0","ip-address":"220.181.38.251","ip-protocol":"all"}
```

### Search experiments using service mode

Currently, the service mode only supports searching all experiments. You can get the data by visiting the /api/experiments/ path of Chaosd service.

#### Example

```bash
curl -X GET 127.0.0.1:31767/api/experiments/
```

The result is as follows:

```bash
[{"id":1,"uid":"ddc5ca81-b677-4595-b691-0ce57bedb156","created_at":"2021-10-18T16:01:18.563542491+08:00","updated_at":"2021-10-18T16:07:27.87111393+08:00","status":"success","kind":"stress","action":"mem","recover_command":"{\"schedule\":\"\",\"duration\":\"\",\"action\":\"mem\",\"kind\":\"stress\",\"uid\":\"ddc5ca81-b677-4595-b691-0ce57bedb156\",\"Load\":0,\"Workers\":0,\"Size\":\"100MB\",\"Options\":null,\"StressngPid\":0}","launch_mode":"svr"}]
```

## Recover Chaosd experiments

After creating an experiment, if you want to withdraw the impact caused by the experiment, you can use the recovery feature of experiments.

### Recover experiments using command-line mode

You can recover an experiment by using Chaosd recover UID.

The following is an example of recovering an experiment using above way under the command-line mode.

1. Create a CPU stress experiment using Chaosd:

```bash
chaosd attack stress cpu --workers 2 --load 10
```

The result is as follows:

```bash
[2021/05/12 03:38:33.698 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --cpu 2 --cpu-load 10"]
[2021/05/12 03:38:33.702 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --cpu 2 --cpu-load 10"] [Pid=27483]
Attack stress cpu successfully, uid: 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
```

You need to pay attention to save the experiment UID in the output.

2. When you do not need to simulate the CPU stress scenario anymore, use the `recover` command to recover the experiment corresponding to the UID:

```bash
chaosd recover 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
```

### Recover experiments using service mode

You can recover an experiment by sending a `DELETE HTTP` request to the /api/attack/{uid} path of Chaosd service.

The following is an example of recovering an experiment using the above way under the service mode.

1. Send an `HTTP POST` request to the Chaosd service to create a CPU stress experiment:

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"load":10, "action":"cpu","workers":1}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

You need to pay attention to save the experiment UID in the output.

2. When you do not need to simulate the CPU stress scenario anymore, run the following command to recover the experiment corresponding to the UID:

```bash
curl -X DELETE 172.16.112.130:31767/api/attack/c3c519bf-819a-4a7b-97fb-e3d0814481fa
```