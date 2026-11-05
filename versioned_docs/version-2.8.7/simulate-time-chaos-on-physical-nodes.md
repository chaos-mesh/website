---
title: Simulate Time Faults
summary: This document describes how to use Chaosd to simulate a time offset scenario.
---

This document describes how to use Chaosd to simulate a time offset scenario. You can create experiments either in command-line mode or service mode.

Before creating an experiment, you can run the following command to check the options of time faults:

```
chaosd attack clock -h
```

To create experiments using the service mode, you need to run Chaosd in the service mode and then send a `POST` HTTP request to the `/api/attack/clock` path of the Chaosd service:

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/clock -H "Content-Type:application/json" -d '{fault-configuration}'
```

For the `fault-configuration` part in the above command, you need to configure it according to the fault types. For the corresponding parameters and examples, refer to the parameters of each fault type in the following sections.

:::note

When running an experiment, remember to record the UID of the experiment. When you want to end the experiment corresponding to the UID, you need to send a `DELETE` HTTP request to the `/api/attack/{uid}` path of the Chaosd service.

:::

## Parameters for simulating time faults

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| --- | --- | --- | --- | --- | --- |
| time-offset | — | time-offset | Specifies the length of time offset. | string | For example, `-5m`; required |
| clock-ids-slice | — | clock-ids-slice | Specifies the ID of the clock that will be offset. Multiple clock IDs should be separated by a comma. See the [clock_gettime documentation](https://man7.org/linux/man-pages/man2/clock_gettime.2.html) for details. | string | The default value is `"CLOCK_REALTIME"` |
| pid | — | pid | The identifier of the process. | int | Required |

## Simulate time faults using the command-line mode

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

Then execute get_time and try to attack it. The following is an example:

```bash
chaosd attack clock -p $PID -t 11s
```

## Simulate time faults using the service mode

Run the test program in [Quick Example](#quick-example), and then use the following command to create a time fault experiment:

```bash
curl -X POST 172.16.112.130:31767/api/attack/clock -H "Content-Type:application/json" -d '{"pid":123, "time-offset":"11s"}'
```
