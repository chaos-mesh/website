---
title: 模拟时间干扰
summary: 本文介绍如何使用 Chaosd 模拟时间偏移场景。
---

本文介绍如何使用 Chaosd 模拟时间偏移场景。你可以通过命令行模式或服务模式创建实验。

## 模拟时间故障相关参数说明

| 配置项 | 配置缩写 | 服务模式字段 | 说明 | 类型 | 值 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `time-offset` | `-t` | time-offset | 指定时间偏移的长度 | string 类型 | 未设置默认值；必须设置。例如，`-5m` |
| `clock-ids-slice` | `-c` | clock-ids-slice | 指定将要发生偏移的时钟的 ID。多个时钟 ID 之间用逗号分隔。有关详细信息，请参见 [clock_gettime 文档](https://man7.org/linux/man-pages/man2/clock_gettime.2.html) | string 类型 | 默认值为 `"CLOCK_REALTIME"` |
| `pid` | `-p` | pid | 进程的标识符 | int 类型 | 未设置默认值；必须设置 |

## 使用命令行模式模拟时间故障

在创建实验前，你可以运行以下命令查看时间故障的选项：

```bash
chaosd attack clock -h
```

输出结果如下所示：

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

### 快速示例

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

然后运行 `get_time` 并尝试对其发起攻击。示例如下：

```bash
chaosd attack clock -p $PID -t 11s
```

## 使用服务模式模拟时间故障

运行 [快速示例](#快速示例) 中的测试程序，然后使用以下命令创建时间故障实验：

```bash
curl -X POST 172.16.112.130:31767/api/attack/clock -H "Content-Type:application/json" -d '{"pid":123, "time-offset":"11s"}'
```
