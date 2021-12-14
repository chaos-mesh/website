---
title: Simulate JVM Application Faults
---

Chaosd simulates the faults of JVM application through [Byteman](https://github.com/chaos-mesh/byteman). The supported fault types are as follows:

- Throw custom exceptions
- Trigger garbage collection
- Increase method latency
- Modify return values of a method
- Trigger faults by setting Byteman configuration files
- Increase JVM pressure

This document describes how to use Chaosd to create the above fault types of JVM experiments.

## Create experiments using command-line mode

This section introduces how to create the experiments of JVM application faults using command-line mode.

Before creating the experiment, you can run the following command line to see the types of JVM application faults supported by Chaosd:

```bash
chaosd attack jvm -h
```

The result is as follows:

```bash
JVM attack related commands

Usage:
  chaosd attack jvm [command]

Available Commands:
  exception   throw specified exception for specified method
  gc          trigger GC for JVM
  latency     inject latency to specified method
  return      return specified value for specified method
  rule-file   inject fault with configured byteman rule file
  stress      inject stress to JVM

Flags:
  -h, --help       help for jvm
      --pid int    the pid of Java process which needs to attach
      --port int   the port of agent server (default 9288)

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID

Use "chaosd attack jvm [command] --help" for more information about a command.
```

### Simulate the scenario of throwing custom exceptions using command-line mode

#### Commands for simulating the scenario of throwing custom exceptions

To see the configuration items supported by the scenario of throwing custom exceptions, run the following command:

```bash
chaosd attack jvm exception --help
```

The result is as follows:

```bash
throw specified exception for specified method

Usage:
  chaosd attack jvm exception [options] [flags]

Flags:
  -c, --class string       Java class name
      --exception string   the exception which needs to throw for action 'exception'
  -h, --help               help for exception
  -m, --method string      the method name in Java class

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### Configuration description for simulating the scenario of throwing custom exceptions

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| class | c | The name of the Java class | string type, required to be configured |
| exception | None | The throwed custom exception | string type, required to be configured |
| method | m | The name of the method | string type, required to be configured |
| pid | None | The Java process ID where the fault is needed to be injected | int type, required to be configured  |
| port | None | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | None | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of throwing custom exceptions

```bash
chaosd attack jvm exception -c Main -m sayhello --exception 'java.io.IOException("BOOM")' --pid 30045
```

The result is as follows:

```bash
[2021/08/05 02:39:39.106 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-exception-q6nd0\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tthrow new java.io.IOException(\"BOOM\");\nENDRULE\n"] [file=/tmp/rule.btm296930759]
Attack jvm successfully, uid: 26a45ae2-d395-46f5-a126-2b2c6c85ae9d
```

### Simulate the scenario of triggering garbage collection using command-line mode

#### Commands for simulating the scenario of triggering garbage collection

To see the configuration items supported by the scenario of triggering garbage collection, run the following command:

```bash
chaosd attack jvm gc --help
```

```bash
trigger GC for JVM

Usage:
  chaosd attack jvm gc [flags]

Flags:
  -h, --help   help for gc

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### Configuration description for simulating the scenario of triggering garbage collection

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| pid | None | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | None | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | None | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of triggering garbage collection

```bash
chaosd attack jvm gc --pid 89345
```

The result is as follows:

```bash
[2021/08/05 02:49:47.850 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --gc-u0mlf\nGC\nENDRULE\n"] [file=/tmp/rule.btm012481052]
Attack jvm successfully, uid: f360e70a-5359-49b6-8526-d7e0a3c6f696
```

Triggering garbage collection is a one-time operation, and the experiment does not require recovery.

### Simulate the scenario of increasing method latency using command-line mode

#### Commands for simulating the scenario of increasing method latency

```bash
chaosd attack jvm latency --help
```

The result is as follows:

```bash
inject latency to specified method

Usage:
  chaosd attack jvm latency [options] [flags]

Flags:
  -c, --class string    Java class name
  -h, --help            help for latency
      --latency int     the latency duration, unit ms
  -m, --method string   the method name in Java class

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### Configuration description for simulating the scenario of increasing method latency

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| class | c | The name of the Java class | string type, required to be configured |
| latency | None | The duration of increasing method latency | int type, required to be configured. The unit is ms. |
| method | m | The name of the method | string type, required to be configured |
| pid | None | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | None | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | None | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of increasing method latency

```bash
chaosd attack jvm latency --class Main --method sayhello --latency 5000 --pid 100840
```

The result is as follows:

```bash
[2021/08/05 03:08:50.716 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-latency-hlib2\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tThread.sleep(5000);\nENDRULE\n"] [file=/tmp/rule.btm359997255]
[2021/08/05 03:08:51.155 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-sayhello-latency-hlib2\n\n"]
Attack jvm successfully, uid: bbe00c57-ac9d-4113-bf0c-2a6f184be261
```

### Simulate the scenario of modifying return values of a method using command-line mode

#### Commands for simulating the scenario of modifying return values of a method

```bash
chaosd attack jvm return --help
```

```bash
return specified value for specified method

Usage:
  chaosd attack jvm return [options] [flags]

Flags:
  -c, --class string    Java class name
  -h, --help            help for return
  -m, --method string   the method name in Java class
      --value string    the return value for action 'return'. Only supports number and string types.

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### Configuration description for simulating the scenario of modifying return values of a method

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| class | c | The name of the Java class | string type, required to be configured |
| method | m | The name of the method | string type, required to be configured |
| value | None | Specifies a return value of the method | string type, required to be configured. Currently, the item can be numeric and string types. If the item (return value) is string, double quotes are required, like  "chaos". |
| pid | None | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | None | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | None | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of modifying return values of a method

```bash
chaosd attack jvm return --class Main --method getnum --value 999 --pid 112694
```

The result is as follows:

```bash
[2021/08/05 03:35:10.603 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-getnum-return-i6gb7\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO \n\treturn 999;\nENDRULE\n"] [file=/tmp/rule.btm051982059]
[2021/08/05 03:35:10.820 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-getnum-return-i6gb7\n\n"]
Attack jvm successfully, uid: e2f204f6-4bed-4d92-aade-2b4a47b02e5d
```

### Simulate the scenario of triggering faults by setting Byteman configuration files using command-line mode

You can set the fault rules in the Byteman rule configuration file, and then inject the faults by specifying the path of the configuration file using Chaosd. Regarding to the Byteman rule configuration, refer to [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language).

#### Commands for simulating the scenario of triggering faults by setting Byteman configuration files

```bash
chaosd attack jvm rule-file --help
```

The result is as follows:

```bash
inject fault with configured byteman rule file

Usage:
  chaosd attack jvm rule-file [options] [flags]

Flags:
  -h, --help          help for rule-file
  -p, --path string   the path of configured byteman rule file

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### Configuration description for simulating the scenario of triggering faults by setting Byteman configuration files

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| path | None | Specifies the path of the Byteman configuration file | string type, required to be configured |
| pid | None | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | None | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | None | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of triggering faults by setting Byteman configuration files

First, you need to write a rule configuration file based on the specific Java program and referred to [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language). For example:

```txt
RULE modify return value
CLASS Main
METHOD getnum
AT ENTRY
IF true
DO
    return 9999
ENDRULE
```

Then, save the configuration file to the file `return.btm`. After that, run the following command to inject faults.

```bash
chaosd attack jvm rule-file -p ./return.btm --pid 112694
```

The result is as follows:

```bash
[2021/08/05 03:45:40.757 +00:00] [INFO] [jvm.go:152] ["rule file data:RULE modify return value\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO\n    return 9999\nENDRULE\n"]
[2021/08/05 03:45:41.011 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule modify return value\n\n"]
Attack jvm successfully, uid: 5ca2e06d-a7c6-421d-bb67-0c9908bac17a
```

### Simulate the scenario of increasing JVM stress using command-line mode

#### Commands for simulating the scenario of increasing JVM stress

```bash
chaosd attack jvm stress --help
```

The result is as follows:

```bash
inject stress to JVM

Usage:
  chaosd attack jvm stress [options] [flags]

Flags:
      --cpu-count int   the CPU core number
  -h, --help            help for stress
      --mem-type int    the memory type to be allocated. The value can be 'stack' or 'heap'.

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### Configuration description for simulating the scenario of increasing JVM stress

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| cpu-count | None | The number of CPU cores used for increasing JVM stress | int type. You can only configure one of `cpu-count` and `mem-type`. |
| mem-type | None | The type of OOM | string type. Currently, both 'stack' and 'heap' OOM types are supported. You can only configure one of `cpu-count` and `mem-type`. |
| pid | None | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | None | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | None | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of increasing JVM stress

```bash
chaosd attack jvm stress --cpu-count 2 --pid 123546
```

The result is as follows:

```bash
[2021/08/05 03:59:51.256 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --stress-jfeiu\nSTRESS CPU\nCPUCOUNT 2\nENDRULE\n"] [file=/tmp/rule.btm773062009]
[2021/08/05 03:59:51.613 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule --stress-jfeiu\n\n"]
Attack jvm successfully, uid: b9b997b5-0a0d-4f1f-9081-d52a32318b84
```

## Create experiments using service mode

You can follow the below instructions to create experiments using service mode.

1. Execute chaosd in service mode.

   ```bash
   chaosd server --port 31767
   ```

2. Send HTTP POTST request to the /api/attack/jvm path of chaosd service.

   For the `fault-configuration` in `bash curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{fault-configuration}'`, you need to configure it according to the fault types. For the corresponding parameters, refer to the parameters and examples of each fault types in the follwing section.

::: note

- When running an experiment, remember to save the UID information of the experiment.
- When you want to end the experiment corresponding to the UID, you need to send an HTTP DELETE request to the /api/attack/{uid} path of Chaosd service.

:::

### Simulate the scenario of throwing custom exceptions using service mode

#### Parameters for simulating the scenario of throwing custom exceptions

| Parameter | Description | Value |
| :-- | :-- | :-- |
| action | The action of the experiment | Set to "exception" |
| class | The name of the Java class | string type, required to be configured |
| exception | The throwed custom exception | string type, required to be configured |
| method | The name of the method | string type, required to be configured |
| pid | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of throwing custom exceptions using service mode

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"exception","class":"Main","method":"sayhello","exception":"java.io.IOException(\"BOOM\")","pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

### Simulate the scenario of triggering garbage collection using service mode

#### Parameters for simulating the scenario of triggering garbage collection

| Parameter | Description | Value |
| :-- | :-- | :-- |
| action | The action of the experiment | Set to "gc" |
| pid | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of triggering garbage collection using service mode

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"gc","pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

Triggering garbage collection is a one-time operation. The experiment does not require recovery.

### Simulate the scenario of increasing method latency using service mode

#### Parameters for simulating the scenario of increasing method latency

| Parameter | Description | Value |
| :-- | :-- | :-- |
| action | The action of the experiment | Set to "latency" |
| class | The name of the Java class | string type, required to be configured |
| latency | The duration of increasing method latency | int type, required to be configured. The unit is ms. |
| method | The name of the method | string type, required to be configured |
| pid | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| port | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| uid | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of increasing method latency using service mode

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"latency","class":"Main","method":"sayhello","latency":5000,"pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

### Simulate the scenario of modifying return values of a method using service mode

#### Parameters for simulating the scenario of modifying return values of a method

| Parameter | Description | Value |
| :-- | :-- | :-- |
| action | The action of the experiment | Set to "return" |
| class | The name of the Java class | string type, required to be configured |
| method | The name of the method | string type, required to be configured |
| value | Specifies a return value of the method | string type, required to be configured. Currently, the item can be numeric and string types. If the item (return value) is string, double quotes are required, like  "chaos". |
| pid | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of modifying return values of a method using service mode

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"return","class":"Main","method":"getnum","value":"999","pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

### Simulate the scenario of triggering faults by setting Byteman configuration files using service mode

You can set the fault rules according to the Byteman rule configuration. Regarding to the Byteman rule configuration, refer to [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language).

#### Parameters for simulating the scenario of triggering faults by setting Byteman configuration files

| Parameter | Description | Value |
| :-- | :-- | :-- |
| action | The action of the experiment | Set to "rule-data" |
| rule-data | Specifies the Byteman configuration data | string type, required to be configured |
| pid | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of triggering faults by setting Byteman configuration files using service mode

First, you need to write a rule configuration file based on the specific Java program and referred to [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language). For example:

```txt
RULE modify return value
CLASS Main
METHOD getnum
AT ENTRY
IF true
DO
    return 9999
ENDRULE
```

Then, by running the following command, you can convert the newline in the configurations to the newline character "\n", and set the converted data to the value of the parameter "rule-data".

```bash
curl -X POST 127.0.0.1:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"rule-data","pid":30045,"rule-data":"\nRULE modify return value\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO return 9999\nENDRULE\n"}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

### Simulate the scenario of increasing JVM stress using service mode

#### Parameters for simulating the scenario of increasing JVM stress

| Parameter | Description | Value |
| :-- | :-- | :-- |
| action | The action of the experiment | Set to "stress" |
| cpu-count | The number of CPU cores used for increasing CPU stress | int type. You can only configure one of `cpu-count` and `mem-type`. |
| mem-type | The type of OOM | string type. Currently, both 'stack' and 'heap' OOM types are supported. You can only configure one of `cpu-count` and `mem-type`. |
| pid | None | The Java process ID where the fault is needed to be injected | int type, required to be configured |
| port | None | The port number attached to the Java process agent. The faults is injected into the Java process through this port number. | int type. the default value is `9288`. |
| uid | None | The experiment number | string type. This item is not required to be configured, because Chaosd randomly creates one. |

#### Example for simulating the scenario of increasing JVM stress using service mode

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"stress","cpu-count":1,"pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```