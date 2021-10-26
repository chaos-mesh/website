---
title: 模拟 JVM 应用故障
---

Chaosd 通过 [Byteman](https://github.com/chaos-mesh/byteman) 模拟 JVM 应用故障，主要支持以下几种故障类型：

- 抛出自定义异常
- 触发垃圾回收
- 增加方法延迟
- 指定方法返回值
- 设置 Byteman 配置文件触发故障
- 增加 JVM 压力

本文主要介绍如何创建以上故障类型的 JVM 实验。

## 使用命令行模式创建实验

本节介绍如何在命令行模式中创建 JVM 应用故障实验。

在创建磁盘故障实验前，可运行以下命令行查看 Chaosd 支持的 JVM 应用故障类型：

```bash
chaosd attack jvm -h
```

输出结果如下所示：

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

## 抛出自定义异常

### 抛出自定义异常命令

运行以下命令查看抛出自定义异常场景支持的配置：

```bash
chaosd attack jvm exception --help
```

输出如下所示：

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

### 抛出自定义异常相关配置说明

| 配置项    | 配置缩写 | 说明                                                                | 值                    |
| :-------- | :------- | :------------------------------------------------------------------ | :-------------------- |
| class     | c        | Java 类的名称                                                       | string 类型，必须配置 |
| exception | 无       | 抛出的自定义异常                                                    | string 类型，必须配置 |
| method    | m        | 方法名称                                                            | string 类型，必须配置 |
| pid       | 无       | 需要注入故障的 Java 进程号                                          | int 类型，必须配置    |
| port      | 无       | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 9288 |
| uid       | 无       | 实验的编号          | string 类型，可以不配置，Chaosd 会随机生成一个    |

#### 抛出自定义异常示例

```bash
chaosd attack jvm exception -c Main -m sayhello --exception 'java.io.IOException("BOOM")' --pid 30045
```

输出如下所示：

```bash
[2021/08/05 02:39:39.106 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-exception-q6nd0\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tthrow new java.io.IOException(\"BOOM\");\nENDRULE\n"] [file=/tmp/rule.btm296930759]
Attack jvm successfully, uid: 26a45ae2-d395-46f5-a126-2b2c6c85ae9d
```

在运行实验后，请注意保存实验的 uid 信息。在需要停止故障注入时使用 `recover` 命令结束 uid 对应的实验：

```bash
chaosd recover 26a45ae2-d395-46f5-a126-2b2c6c85ae9d
```

## 触发垃圾回收

### 触发垃圾回收命令

运行以下命令查看抛出自定义异常场景支持的配置：

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

### 触发垃圾回收相关配置说明

| 配置项 | 配置缩写 | 说明                                                                | 值                    |
| :----- | :------- | :------------------------------------------------------------------ | :-------------------- |
| pid    | 无       | 需要注入故障的 Java 进程号                                          | int 类型，必须配置    |
| port   | 无       | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 9288 |
| uid    | 无       | 实验的编号  | string 类型，可以不配置，Chaosd 会随机生成一个    |

### 触发垃圾回收示例

```bash
chaosd attack jvm gc --pid 89345
```

输出如下所示：

```bash
[2021/08/05 02:49:47.850 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --gc-u0mlf\nGC\nENDRULE\n"] [file=/tmp/rule.btm012481052]
Attack jvm successfully, uid: f360e70a-5359-49b6-8526-d7e0a3c6f696
```

触发垃圾回收为一次性操作，实验不需要恢复。

## 增加方法延迟

### 增加方法延迟命令

```bash
chaosd attack jvm latency --help
```

输出如下所示：

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

### 增加方法延迟相关配置说明

| 配置项  | 配置缩写 | 说明                                                                | 值                            |
| :------ | :------- | :------------------------------------------------------------------ | :---------------------------- |
| class   | c        | Java 类的名称                                                       | string 类型，必须配置         |
| latency | 无       | 增加方法的延迟时间                                                  | int 类型，必须配置，单位为 ms |
| method  | m        | 方法名称                                                            | string 类型，必须配置         |
| pid     | 无       | 需要注入故障的 Java 进程号                                          | int 类型，必须配置            |
| port    | 无       | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 9288         |
| uid     | 无       | 实验的编号        | string 类型，可以不配置，Chaosd 会随机生成一个    |

### 增加方法延迟示例

```bash
chaosd attack jvm latency --class Main --method sayhello --latency 5000 --pid 100840
```

输出如下所示：

```bash
[2021/08/05 03:08:50.716 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-latency-hlib2\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tThread.sleep(5000);\nENDRULE\n"] [file=/tmp/rule.btm359997255]
[2021/08/05 03:08:51.155 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-sayhello-latency-hlib2\n\n"]
Attack jvm successfully, uid: bbe00c57-ac9d-4113-bf0c-2a6f184be261
```

在运行实验后，请注意保存实验的 uid 信息。在需要停止故障注入时使用 `recover` 命令结束 uid 对应的实验：

```bash
chaosd recover bbe00c57-ac9d-4113-bf0c-2a6f184be261
```

## 指定方法返回值

### 指定方法返回值命令

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

### 指定方法返回值相关配置说明

| 配置项 | 配置缩写 | 说明                                                                | 值                                                                                                     |
| :----- | :------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------- |
| class  | c        | Java 类的名称                                                       | string 类型，必须配置                                                                                  |
| method | m        | 方法名称                                                            | string 类型，必须配置                                                                                  |
| value  | 无       | 指定方法的返回值                                                    | string 类型，必须配置。目前支持数字和字符串类型的返回值，如果为字符串，则需要使用双引号，例如："chaos"。 |
| pid    | 无       | 需要注入故障的 Java 进程号                                          | int 类型，必须配置                                                                                     |
| port   | 无       | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 9288                                                                                  |
| uid    | 无       | 实验的编号    | string 类型，可以不配置，Chaosd 会随机生成一个    |

### 指定方法返回值示例

```bash
chaosd attack jvm return --class Main --method getnum --value 999 --pid 112694
```

输出如下所示：

```bash
[2021/08/05 03:35:10.603 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-getnum-return-i6gb7\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO \n\treturn 999;\nENDRULE\n"] [file=/tmp/rule.btm051982059]
[2021/08/05 03:35:10.820 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-getnum-return-i6gb7\n\n"]
Attack jvm successfully, uid: e2f204f6-4bed-4d92-aade-2b4a47b02e5d
```

在运行实验后，请注意保存实验的 uid 信息。在需要停止故障注入时，使用 `recover` 命令来结束 uid 对应的实验：

```bash
chaosd recover e2f204f6-4bed-4d92-aade-2b4a47b02e5d
```

## 设置 Byteman 配置文件触发故障

通过 Byteman 规则配置文件来设置故障规则，然后使用 Chaosd 指定该文件路径来注入故障。关于 Byteman 的规则配置，请参考 [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language)。

### 设置 Byteman 配置文件触发故障命令

```bash
chaosd attack jvm rule-file --help
```

输出如下所示：

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

### 设置 Byteman 配置文件触发故障相关配置说明

| 配置项 | 配置缩写 | 说明                                                                | 值                    |
| :----- | :------- | :------------------------------------------------------------------ | :-------------------- |
| path   | 无       | 指定 Byteman 配置文件的路径                                         | string 类型，必须配置 |
| pid    | 无       | 需要注入故障的 Java 进程号                                          | int 类型，必须配置    |
| port   | 无       | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 9288 |
| uid    | 无       | 实验的编号          | string 类型，可以不配置，Chaosd 会随机生成一个    |

### 设置 Byteman 配置文件触发故障示例

首先根据具体的 Java 程序，并参考 [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language) 编写一个规则配置文件，例如：

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

将该文件保存到文件 `return.btm`，然后运行以下命令注入故障：

```bash
chaosd attack jvm rule-file -p ./return.btm --pid 112694
```

输出如下所示：

```bash
[2021/08/05 03:45:40.757 +00:00] [INFO] [jvm.go:152] ["rule file data:RULE modify return value\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO\n    return 9999\nENDRULE\n"]
[2021/08/05 03:45:41.011 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule modify return value\n\n"]
Attack jvm successfully, uid: 5ca2e06d-a7c6-421d-bb67-0c9908bac17a
```

在运行实验后，请注意保存实验的 uid 信息。在需要停止故障注入时，使用 `recover` 命令来结束 uid 对应的实验：

```bash
chaosd recover 5ca2e06d-a7c6-421d-bb67-0c9908bac17a
```

## 增加 JVM 压力

### 增加 JVM 压力命令

```bash
chaosd attack jvm stress --help
```

输出如下所示：

```bash
inject stress to JVM

Usage:
  chaosd attack jvm stress [options] [flags]

Flags:
      --cpu-count int   the CPU core number
  -h, --help            help for stress
      --mem-size int    the memory size to be allocated. The unit is MB.

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

### 增加 JVM 压力相关配置说明

| 配置项    | 配置缩写 | 说明                                                                | 值                                                      |
| :-------- | :------- | :------------------------------------------------------------------ | :------------------------------------------------------ |
| cpu-count | 无       | 增加 CPU 压力所使用的 CPU 核的数量                                  | int 类型，`cpu-count` 和 `mem-size` 中必须配置一个            |
| mem-size  | 无       | 指定占用内存的大小                                                  | int 类型，单位为 MB，`cpu-count` 和 `mem-size` 中必须配置一个 |
| pid       | 无       | 需要注入故障的 Java 进程号                                          | int 类型，必须配置                                      |
| port      | 无       | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 9288                                   |
| uid       | 无       | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个    |

### 增加 JVM 压力示例

```bash
chaosd attack jvm stress --cpu-count 2 --pid 123546
```

输出如下所示：

```bash
[2021/08/05 03:59:51.256 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --stress-jfeiu\nSTRESS CPU\nCPUCOUNT 2\nENDRULE\n"] [file=/tmp/rule.btm773062009]
[2021/08/05 03:59:51.613 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule --stress-jfeiu\n\n"]
Attack jvm successfully, uid: b9b997b5-0a0d-4f1f-9081-d52a32318b84
```

在运行实验后，请注意保存实验的 uid 信息。在需要停止故障注入时，使用 `recover` 命令来结束 uid 对应的实验：

```bash
chaosd recover b9b997b5-0a0d-4f1f-9081-d52a32318b84
```

## 使用服务模式创建实验

（正在持续更新中）
