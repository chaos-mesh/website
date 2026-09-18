---
title: 模拟进程故障
---

本文主要介绍如何使用 Chaosd 模拟进程故障。该功能通过使用 `kill` 的 Golang 接口模拟进程被终止或暂停的场景，支持通过命令行模式或服务模式创建实验。

在创建进程故障实验前，可运行以下命令行查看 Chaosd 支持的进程故障类型：

```bash
chaosd attack process -h
```

输出结果如下所示：

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

目前 Chaosd 支持模拟进程被终止或暂停的故障。

要使用服务模式创建实验，你需要以服务模式运行 Chaosd，然后向 Chaosd 服务的路径 `/api/attack/process` 发送 `POST` HTTP 请求：

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{fault-configuration}'
```

在上述命令中，你需要按照故障类型在 `fault-configuration` 中进行配置。有关对应的配置参数和示例，请参考下文中各个类型故障的相关参数说明。

:::note

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 `/api/attack/{uid}` 发送 `DELETE` HTTP 请求。

:::

## 杀死进程

### 模拟杀死进程相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | action | 实验的行为 | string 类型 | 设置为 "kill" |
| `process` | p | process | 需要注入故障的进程的名字或者进程的标识符 | string 类型 | 默认值为 `""` |
| `recover-cmd` | r | recover-cmd | 需要在实验恢复时执行的命令 | string 类型 | 默认值为 `""` |
| `signal` | s | signal | 所提供的进程信号值 | int 类型 | 默认为 `9`。目前只支持 `SIGKILL`、`SIGTERM` 和 `SIGSTOP` 三种信号值 |

### 使用命令行模式模拟杀死进程

```bash
chaosd attack process kill -h
```

输出结果如下所示：

```bash
kill process, default signal 9

Usage:
  chaosd attack process kill [flags]

Flags:
  -h, --help                 help for kill
  -p, --process string       The process name or the process ID
  -r, --recover-cmd string   The command to be run when recovering experiment
  -s, --signal int           The signal number to send (default 9)

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

```bash
chaosd attack process kill -p python
```

输出结果如下所示：

```bash
Attack process python successfully, uid: 10e633ac-0a37-41ba-8b4a-cd5ab92099f9
```

:::note

只有 `signal` 为 `SIGSTOP`，或配置了 `recover-cmd` 的实验支持被恢复。

:::

### 使用服务模式模拟杀死进程

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{"process":"12345","signal":15}'
```

输出结果如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

## 停止进程

### 模拟停止进程相关参数说明

| 配置项    | 配置缩写 | 服务模式字段 | 说明                                 | 类型        | 值            |
| :-------- | :------- | :----------- | :----------------------------------- | :---------- | :------------ |
| `action`  | —        | action       | 实验的行为                           | string 类型 | 设置为 "stop" |
| `process` | p        | process      | 需要暂停的进程的名字或者进程的标识符 | string 类型 | 默认值为 `""` |

### 使用命令行模式模拟停止进程

```bash
chaosd attack process stop -h
```

输出结果如下所示：

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

```bash
chaosd attack process stop -p python
```

输出结果如下所示：

```bash
Attack process python successfully, uid: 9cb6b3be-4f5b-4ecb-ae05-51050fcd0010
```

### 使用服务模式模拟停止进程

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{"process":"12345","signal":19}'
```

输出结果如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a00cca2b-eba7-4716-86b3-3e66f94880f7"}
```

:::note

只有 `signal` 为 `SIGSTOP`，或配置了 `recover-cmd` 的实验支持被恢复。

:::
