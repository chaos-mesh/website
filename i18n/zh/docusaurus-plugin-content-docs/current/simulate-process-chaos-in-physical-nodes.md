---
title: 模拟进程故障
---

本文主要介绍如何使用 Chaosd 模拟进程故障。该功能通过使用 kill 的 golang 接口模拟进程被终止或暂停的场景，支持通过命令行模式或服务模式创建实验。

## 使用命令行模式创建实验

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

### 模拟进程被终止

#### 模拟进程被终止命令

```bash
chaosd attack process kill -h
```

输出结果如下所示：

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

#### 模拟进程被终止相关配置说明

| 配置项  | 配置缩写 | 说明                                 | 值                                                                      |
| :------ | :------- | :----------------------------------- | :---------------------------------------------------------------------- |
| process | p        | 所需要杀死进程的名字或者进程的标识符 | string 类型，默认为 ""                                                  |
| signal  | s        | 所提供的进程信号值                   | int 类型，默认为 9。目前只支持 SIGKILL、SIGTERM 和 SIGSTOP 三种信号值。 |

#### 模拟进程被终止示例

```bash
chaosd attack process kill -p python
```

输出结果如下所示：

```bash

Attack process python successfully, uid: 10e633ac-0a37-41ba-8b4a-cd5ab92099f9
```

:::note 注意

只有 signal 为 SIGSTOP 的实验支持恢复实验。

:::

### 模拟进程被暂停

#### 模拟进程被暂停命令

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

#### 模拟进程被暂停相关配置说明

| 配置项  | 配置缩写 | 说明                                 | 值                    |
| :------ | :------- | :----------------------------------- | :-------------------- |
| process | p        | 所需要杀死进程的名字或者进程的标识符 | string 类型，默认为"" |

#### 模拟进程被暂停示例

```bash
chaosd attack process stop -p python
```

输出结果如下所示：

```bash

Attack process python successfully, uid: 9cb6b3be-4f5b-4ecb-ae05-51050fcd0010
```

## 使用服务模式创建实验

以服务模式运行 chaosd，通过向 chaosd 服务的路径 /api/attack/process 发送 HTTP POTST 请求，从而创建实验。在运行实验时，请注意保存实验的 uid 信息，向 chaosd 服务的路径 /api/attack/{uid} 发送 HTTP DELETE 请求来结束 uid 对应的实验。

### 服务模式模拟进程故障

#### 进程故障相关参数说明

| 参数  |  说明                                 | 值            |
| :------ | :----------------------------------- | :---------------------------------------------------------------------- |
| process | 所需要杀死进程的名字或者进程的标识符 | string 类型，默认为 ""              |
| signal  | 所提供的进程信号值                   | int 类型，默认为 9。 |

#### 服务模式进程故障示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/stress -H "Content-Type:application/json" -d '{"process":"12345","signal":15}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

:::note 注意

只有 signal 为 SIGSTOP 的实验支持恢复实验。

:::
