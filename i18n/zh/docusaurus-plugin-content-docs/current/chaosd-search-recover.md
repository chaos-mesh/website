---
title: 查找和恢复 Chaosd 实验
summary: 本文档介绍了查找和恢复 Chaosd 实验的操作方法，并提供了示例。
---

Chaosd 支持按照条件搜索实验，以及恢复指定的 UID 对应的实验。本文档介绍了查找和恢复 Chaosd 实验的操作方法，并提供了示例。

本页适用于 Chaosd v1.5.0 及以上版本。安装和运行要求请参阅 [Chaosd 组件简介](chaosd-overview.md)。

## 查找 Chaosd 实验

本章节介绍了如何使用命令行模式和服务模式查找 Chaosd 实验。

### 使用命令行模式查找实验

运行以下命令可查看搜索命令 (`search`) 所支持的配置：

```bash
chaosd search --help
```

#### 参数说明

| 配置项 | 配置缩写 | 说明 | 类型 |
| :-- | :-- | :-- | :-- |
| `all` | A | 列出所有的实验 | bool 类型 |
| `asc` | 无 | 设为 `true` 时按创建时间升序排列，默认值为 `false`，按创建时间降序排列 | bool 类型 |
| `kind` | k | 列出指定类型的实验 | string 类型，支持的类型包括：`network`、`process`、`stress`、`disk`、`disk-server`、`host`、`jvm`、`clock`、`kafka`、`redis`、`file`、`http`、`vm`、`userDefined` |
| `limit` | l | 列出实验的数量 | uint32 类型 |
| `offset` | o | 从指定的偏移量开始搜索 | uint32 类型 |
| `status` | s | 列出指定状态的实验 | string 类型，支持的状态类型包括：`created`、`success`、`error`、`scheduled`、`destroyed`、`revoked` |

#### 示例

```bash
./chaosd search --kind network --status destroyed --limit 1
```

通过该命令，你可以查找类型为 `network` 且状态为 `destroyed`（表示实验已恢复）的实验。

从 Chaosd v1.5.0 起，可以按 `scheduled` 状态查找定时实验：

```bash
chaosd search --status scheduled
```

### 使用服务模式查找实验

目前，服务模式只支持查找出所有的实验。你可以通过访问 Chaosd 服务的 `/api/experiments/` 路径来获取数据。

#### 示例

```bash
curl -X GET 127.0.0.1:31767/api/experiments/
```

## 恢复 Chaosd 实验

在创建完实验后，如果想撤销实验造成的影响，可以使用实验的恢复功能。

恢复能力取决于故障类型。从 Chaosd v1.5.0 起，恢复主机关机、重启，或未配置 `recover-cmd` 的进程终止故障时，会返回错误。Redis 缓存过期故障无法恢复已过期的键，即使恢复请求报告成功也是如此。恢复后，请同时检查目标的实际状态。

定时任务和恢复计时器只存在于创建它们的运行进程中，重启服务不会从数据库恢复这些任务。取消定时任务时，需要向创建任务的同一个 Chaosd 服务发送 `DELETE /api/attack/{uid}`。命令行恢复使用独立的调度器，无法取消另一个服务进程中的定时任务。当前已启动的实验依赖原有恢复计时器。

### 使用命令行模式恢复实验

你可以通过使用 Chaosd recover UID 的方式恢复实验。

以下为在命令行模式下通过该方式恢复实验的示例。

1. 使用 Chaosd 创建一个 CPU 压力实验：

   ```bash
   chaosd attack stress cpu --workers 2 --load 10
   ```

   请注意保存实验的 UID 信息，以便在下一步操作中使用。

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

   请注意保存实验的 UID 信息，以便在下一步操作中使用。

2. 在不需要模拟 CPU 压力场景时，运行以下命令来结束 UID 对应的实验：

   ```bash
   curl -X DELETE 172.16.112.130:31767/api/attack/c3c519bf-819a-4a7b-97fb-e3d0814481fa
   ```
