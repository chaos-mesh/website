---
title: 模拟时间故障
---

本文主要介绍如何使用 Chaosd 模拟时间偏移的场景。本功能支持通过命令行模式或服务模式创建实验。

在创建时间故障实验前，可运行以下命令行查看时间故障的相关配置项：

```
chaosd attack clock -h
```

结果如下所示：

```bash
$ chaosd attack clock -h

clock skew

Usage:
  chaosd attack clock attack [flags]

Flags:
  -c, --clock-ids-slice string   The identifier of the particular clock on which to act.More clock description in linux kernel can be found in man page of clock_getres, clock_gettime, clock_settime.Muti clock ids should be split with "," (default "CLOCK_REALTIME")
  -h, --help                     help for clock
  -p, --pid int                  Pid of target program.
  -t, --time-offset string       Specifies the length of time offset.

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID

```

要使用服务模式创建实验，你需要以服务模式运行 Chaosd，然后向 Chaosd 服务的路径 `/api/attack/clock` 发送 `POST` HTTP 请求：

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/clock -H "Content-Type:application/json" -d '{fault-configuration}'
```

在上述命令中，你需要按照故障类型在 `fault-configuration` 中进行配置。有关对应的配置参数和示例，请参考下文中各个类型故障的相关参数说明。

:::note

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 `/api/attack/{uid}` 发送 `DELETE` HTTP 请求。

:::

## 模拟时间故障相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| --- | --- | --- | --- | --- | --- |
| time-offset | — | time-offset | 指定时间的偏移量。 | string 类型 | 例如：`-5m`，必须配置 |
| clock-ids-slice | — | clock-ids-slice | 指定时间偏移作用的时钟，多个时钟 ID 以逗号分隔，详见 [clock_gettime documentation](https://man7.org/linux/man-pages/man2/clock_gettime.2.html)。 | string 类型 | 默认值为 `"CLOCK_REALTIME"` |
| pid | — | pid | 进程的标识符。 | int 类型 | 必须配置 |

## 使用命令行模式模拟时间故障场景

### 快速使用

准备测试程序：

```bash
cat > time.c << EOF
#include <stdio.h>
#include <time.h>
#include <unistd.h>
#include <sys/types.h>

int main() {
    printf("PID : %ld\n", (long)getpid());
    struct  timespec ts;
    for(;;) {
        clock_gettime(CLOCK_REALTIME, &ts);
        printf("Time : %lld.%.9ld\n", (long long)ts.tv_sec, ts.tv_nsec);
        sleep(10);
    }
}
EOF

gcc -o get_time ./time.c
```

接下来执行 get_time 并且使用 chaosd 尝试创建时间故障如下：

```bash
chaosd attack clock -p $PID -t 11s
```

## 使用服务模式模拟时间故障场景

运行[快速使用](#快速使用)中的测试程序，使用以下命令创建时间故障实验：

```bash
curl -X POST 172.16.112.130:31767/api/attack/clock -H "Content-Type:application/json" -d '{"pid":123, "time-offset":"11s"}'
```
