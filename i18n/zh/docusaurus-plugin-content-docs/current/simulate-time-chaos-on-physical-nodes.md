---
title: 模拟时间故障
---

本文主要介绍如何使用 Chaosd 模拟时间偏移的场景。本功能支持通过命令行模式或服务模式创建实验。

## 通过命令行创建实验

本节介绍如何在命令行模式中创建时间故障实验。

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

### 模拟时间故障的相关配置

| 配置项 | 类型 | 说明 | 默认值 | 必要项 | 例子 |
| --- | --- | --- | --- | --- | --- |
| timeOffset | string | 指定时间的偏移量。 | None | 是 | `-5m` |
| clockIds | []string | 指定时间偏移作用的时钟，详见 [clock_gettime documentation](https://man7.org/linux/man-pages/man2/clock_gettime.2.html) 。 | `["CLOCK_REALTIME"]` | 否 | `["CLOCK_REALTIME", "CLOCK_MONOTONIC"]` |
| pid | string | 进程的标识符。 | None | 是 | `1` |

### 使用服务模式创建实验

（正在持续更新中）
