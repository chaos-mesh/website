---
title: Simulate time chaos
---

This document describes how to use Chaosd to simulate a time offset scenario.
You can create experiments either in command-line mode or service mode.

## Create experiments using commands

This section describes how to create time chaos experiments using commands.

Before creating an experiment, you can run the following command to check the options of time chaos:

```
chaosd attack clock -h
```

The result is as follows:

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

### Quick Example

Prepare test program:

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

Then execute get_time and try to attack it.

### Configuration description of simulating disk read load

| Parameter  | Type     | Note                                                                                                                                                                                                                                                                                                                                                                        | Default value        | Required | Example                                 |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------- | --------------------------------------- |
| timeOffset | string   | Specifies the length of time offset.                                                                                                                                                                                                                                                                                                                                        | None                 | Yes      | `-5m`                                   |
| clockIds   | []string | Specifies the ID of clock that will be offset. See the [<clock>clock_gettime</clock> documentation](https://man7.org/linux/man-pages/man2/clock_gettime.2.html) for details.                                                                                                                                                                                                | `["CLOCK_REALTIME"]` | No       | `["CLOCK_REALTIME", "CLOCK_MONOTONIC"]` |
| pid        | string   | Specifies the mode of the experiment. The mode options include `one` (selecting a random Pod), `all` (selecting all eligible Pods), `fixed` (selecting a specified number of eligible Pods), `fixed-percent` (selecting a specified percentage of Pods from the eligible Pods), and `random-max-percent` (selecting the maximum percentage of Pods from the eligible Pods). | None                 | Yes      | `1`                                     |

### Create experiments using service mode

(ongoing update)
