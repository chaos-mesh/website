---
title: 模拟进程故障
---

本文主要介绍如何使用 Chaosd 模拟进程故障。该功能通过使用 `kill` 的 Golang 接口模拟进程被终止或暂停的场景，支持通过命令行模式或服务模式创建实验。

在创建进程故障实验前，可运行以下命令行查看 Chaosd 支持的进程故障类型：

```bash
chaosd attack process -h
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

:::info

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 `/api/attack/{uid}` 发送 `DELETE` HTTP 请求。

:::

## 杀死进程

### 模拟杀死进程相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `process` | p | process | 需要注入故障的进程的名字或者进程的标识符 | string 类型 | 默认为 `""` |
| `recover-cmd` | r | recover-cmd | 需要在实验恢复时执行的命令 | string 类型 | 默认为 `""` |
| `signal` | s | signal | 所提供的进程信号值 | int 类型 | 默认为 `9`。目前只支持 `SIGKILL`、`SIGTERM` 和 `SIGSTOP` 三种信号值。 |

### 使用命令行模式模拟杀死进程场景

```bash
chaosd attack process kill -h
```

示例如下：

```bash
chaosd attack process kill -p python
```

:::info

只有 `signal` 为 `SIGSTOP`，或配置了 `recover-cmd` 的实验支持被恢复。

:::

### 使用服务模式模拟杀死进程场景

示例如下：

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{"process":"12345","signal":15}'
```

## 停止进程

### 模拟停止进程相关参数说明

| 配置项    | 配置缩写 | 服务模式字段 | 说明                                 | 类型        | 值          |
| :-------- | :------- | :----------- | :----------------------------------- | :---------- | :---------- |
| `process` | p        | process      | 需要暂停的进程的名字或者进程的标识符 | string 类型 | 默认为 `""` |
| `signal`  | —        | signal       | 所提供的进程信号值                   | int 类型    | 默认为 `9`  |

### 使用命令行模式模拟停止进程场景

```bash
chaosd attack process stop -h
```

示例如下：

```bash
chaosd attack process stop -p python
```

### 使用服务模式模拟停止进程场景

示例如下：

```bash
curl -X POST 172.16.112.130:31767/api/attack/process -H "Content-Type:application/json" -d '{"process":"12345","signal":19}'
```

:::info

只有 `signal` 为 `SIGSTOP`，或配置了 `recover-cmd` 的实验支持被恢复。

:::
