---
title: 查找和恢复 Chaosd 实验
summary: 本文档介绍了查找和恢复 Chaosd 实验的操作方法，并提供了示例。
---

Chaosd 支持按照条件搜索实验，以及恢复指定的 UID 对应的实验。本文档介绍了查找和恢复 Chaosd 实验的操作方法，并提供了示例。

## 查找 Chaosd 实验

本章节介绍了如何使用命令行模式和服务模式查找 Chaosd 实验。

### 使用命令行模式查找实验

运行以下命令可查看搜索命令 (`search`) 所支持的配置：

```bash
$ chaosd search --help
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

#### 参数说明

| 配置项 | 配置缩写 | 说明 | 类型 |
| :-- | :-- | :-- | :-- |
| `all` | A | 列出所有的实验 | bool 类型 |
| `asc` | 无 | 按照创建时间的升序对实验进行排列，默认值为 `false` | bool 类型 |
| `kind` | k | 列出指定类型的实验 | string 类型，支持的类型包括：`network`、`process`、`stress`、`disk`、`host`、`JVM` |
| `limit` | l | 列出实验的数量 | int 类型 |
| `offset` | o | 从指定的偏移量开始搜索 | int 类型 |
| `status` | s | 列出指定状态的实验 | string 类型，支持的状态类型包括：`created`、`success`、`error`、`destroyed`、`revoked`

#### 示例

```bash
./chaosd search --kind network --status destroyed --limit 1
```

通过该命令，你可以查找类型为 `network` 且状态为 `destroyed`（表示实验已恢复）的实验。

运行命令后，结果中仅会输出一行数据。

输出结果如下：

```bash
                  UID                     KIND     ACTION    STATUS            CREATE TIME                                                                                                                  CONFIGURATION
--------------------------------------- --------- -------- ----------- --------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  1f6c1253-522a-43d9-83f8-42607102b3b9   network   delay    destroyed   2021-11-02T15:14:07+08:00   {"schedule":"","duration":"","action":"delay","kind":"network","uid":"1f6c1253-522a-43d9-83f8-42607102b3b9","latency":"2s","jitter":"0ms","correlation":"0","device":"eth0","ip-address":"220.181.38.251","ip-protocol":"all"}
```

### 使用服务模式查找实验

目前，服务模式只支持查找出所有的实验。你可以通过访问 Chaosd 服务的 `/api/experiments/` 路径来获取数据。

#### 示例

```bash
curl -X GET 127.0.0.1:31767/api/experiments/
```

输出如下所示：

```bash
[{"id":1,"uid":"ddc5ca81-b677-4595-b691-0ce57bedb156","created_at":"2021-10-18T16:01:18.563542491+08:00","updated_at":"2021-10-18T16:07:27.87111393+08:00","status":"success","kind":"stress","action":"mem","recover_command":"{\"schedule\":\"\",\"duration\":\"\",\"action\":\"mem\",\"kind\":\"stress\",\"uid\":\"ddc5ca81-b677-4595-b691-0ce57bedb156\",\"Load\":0,\"Workers\":0,\"Size\":\"100MB\",\"Options\":null,\"StressngPid\":0}","launch_mode":"svr"}]
```

## 恢复 Chaosd 实验

在创建完实验后，如果想撤销实验造成的影响，可以使用实验的恢复功能。

### 使用命令行模式恢复实验

你可以通过使用 Chaosd recover UID 的方式恢复实验。

以下为在命令行模式下通过该方式恢复实验的示例。

1. 使用 Chaosd 创建一个 CPU 压力实验：

    ```bash
    chaosd attack stress cpu --workers 2 --load 10
    ```

    输出如下所示：

    ```bash
    [2021/05/12 03:38:33.698 +00:00] [INFO] [stress.go:66] ["stressors normalize"] [arguments=" --cpu 2 --cpu-load 10"]
    [2021/05/12 03:38:33.702 +00:00] [INFO] [stress.go:82] ["Start stress-ng process successfully"] [command="/usr/bin/stress-ng --cpu 2 --cpu-load 10"] [Pid=27483]
    Attack stress cpu successfully, uid: 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
    ```

    请注意保存输出中的实验 UID 信息，以便在下一步操作中使用。

2. 在不需要模拟 CPU 压力场景时，使用 `recover` 命令来恢复 UID 对应的实验：

    ```bash
    chaosd recover 4f33b2d4-aee6-43ca-9c43-0f12867e5c9c
    ```

### 使用服务模式恢复实验

你可以通过向 Chaosd 服务的 `/api/attack/{uid}` 路径发送 `DELETE` HTTP 请求的方式来恢复实验。

以下为在服务模式下通过该方式恢复实验的示例。

1. 向 Chaosd 服务发送 `POST` HTTP 请求，创建一个 CPU 压力实验：

    ```bash
    curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"load":10, "action":"cpu","workers":1}'
    ```

    输出如下所示：

    ```bash
    {"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
    ```

    请注意保存输出中的实验 UID 信息，以便在下一步操作中使用。

2. 在不需要模拟 CPU 压力场景时，运行以下命令来结束 UID 对应的实验：

    ```bash
    curl -X DELETE 172.16.112.130:31767/api/attack/c3c519bf-819a-4a7b-97fb-e3d0814481fa
    ```