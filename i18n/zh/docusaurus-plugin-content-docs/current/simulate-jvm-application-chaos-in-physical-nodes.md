---
title: 模拟 JVM 应用故障
---

Chaosd 可以通过 [Byteman](https://github.com/chaos-mesh/byteman) 模拟 JVM 应用故障，主要支持以下几种故障类型：

- 抛出自定义异常
- 触发垃圾回收
- 增加方法延迟
- 修改方法返回值
- 设置 Byteman 配置文件触发故障
- 增加 JVM 压力

同时，Chaosd 支持对常用的服务或其 Java 客户端注入上述的故障。比如，当 MySQL Java 客户端执行指定类型的 SQL 语句（`"select"`，`"update"`，`"insert"`，`"replace"` 或 `"delete"`）时，你可以使用 Chaosd 在该客户端注入延迟或抛出异常。

本文主要介绍如何通过 Chaosd 创建以上故障类型的 JVM 实验。

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
  mysql       inject fault into MySQL client
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

### 使用命令行模式模拟抛出自定义异常

#### 抛出自定义异常命令

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

#### 抛出自定义异常相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `class` | c | Java 类的名称 | string 类型，必须配置 |
| `exception` | 无 | 抛出的自定义异常 | string 类型，必须配置 |
| `method` | m | 方法名称 | string 类型，必须配置 |
| `pid` | 无 | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 无 | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 无 | 实验的编号 | string 类型，可以不配置，因为 Chaosd 会随机生成一个 |

#### 抛出自定义异常示例

```bash
chaosd attack jvm exception -c Main -m sayhello --exception 'java.io.IOException("BOOM")' --pid 30045
```

输出如下所示：

```bash
[2021/08/05 02:39:39.106 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-exception-q6nd0\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tthrow new java.io.IOException(\"BOOM\");\nENDRULE\n"] [file=/tmp/rule.btm296930759]
Attack jvm successfully, uid: 26a45ae2-d395-46f5-a126-2b2c6c85ae9d
```

### 使用命令行模式模拟触发垃圾回收

#### 触发垃圾回收命令

运行以下命令查看抛出触发垃圾回收场景支持的配置：

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

#### 触发垃圾回收相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `pid` | 无 | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 无 | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 无 | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 触发垃圾回收示例

```bash
chaosd attack jvm gc --pid 89345
```

输出如下所示：

```bash
[2021/08/05 02:49:47.850 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --gc-u0mlf\nGC\nENDRULE\n"] [file=/tmp/rule.btm012481052]
Attack jvm successfully, uid: f360e70a-5359-49b6-8526-d7e0a3c6f696
```

触发垃圾回收为一次性操作，实验不需要恢复。

### 使用命令行模式模拟增加方法延迟

#### 增加方法延迟命令

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

#### 增加方法延迟相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `class` | c | Java 类的名称 | string 类型，必须配置 |
| `latency` | 无 | 增加方法的延迟时间 | int 类型，必须配置，单位为 ms |
| `method` | m | 方法名称 | string 类型，必须配置 |
| `pid` | 无 | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 无 | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 无 | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 增加方法延迟示例

```bash
chaosd attack jvm latency --class Main --method sayhello --latency 5000 --pid 100840
```

输出如下所示：

```bash
[2021/08/05 03:08:50.716 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-latency-hlib2\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tThread.sleep(5000);\nENDRULE\n"] [file=/tmp/rule.btm359997255]
[2021/08/05 03:08:51.155 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-sayhello-latency-hlib2\n\n"]
Attack jvm successfully, uid: bbe00c57-ac9d-4113-bf0c-2a6f184be261
```

### 使用命令行模式模拟修改方法返回值

#### 修改方法返回值命令

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

#### 修改方法返回值相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `class` | c | Java 类的名称 | string 类型，必须配置 |
| `method` | m | 方法名称 | string 类型，必须配置 |
| `value` | 无 | 指定方法的返回值 | string 类型，必须配置。目前支持数字和字符串类型的返回值，如果为字符串，则需要使用双引号，例如："chaos"。 |
| `pid` | 无 | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 无 | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 无 | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 修改方法返回值示例

```bash
chaosd attack jvm return --class Main --method getnum --value 999 --pid 112694
```

输出如下所示：

```bash
[2021/08/05 03:35:10.603 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-getnum-return-i6gb7\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO \n\treturn 999;\nENDRULE\n"] [file=/tmp/rule.btm051982059]
[2021/08/05 03:35:10.820 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-getnum-return-i6gb7\n\n"]
Attack jvm successfully, uid: e2f204f6-4bed-4d92-aade-2b4a47b02e5d
```

### 命令行模式下设置 Byteman 配置文件触发故障

你可以先在 Byteman 规则配置文件中设置故障规则，然后再通过使用 Chaosd 指定该文件路径的方式注入故障。关于 Byteman 的规则配置，请参考 [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language)。

#### 设置 Byteman 配置文件触发故障命令

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

#### 设置 Byteman 配置文件触发故障相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `path` | 无 | 指定 Byteman 配置文件的路径 | string 类型，必须配置 |
| `pid` | 无 | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 无 | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 无 | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 设置 Byteman 配置文件触发故障示例

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

其次，将该配置文件保存到文件 `return.btm` 后，运行以下命令注入故障：

```bash
chaosd attack jvm rule-file -p ./return.btm --pid 112694
```

输出如下所示：

```bash
[2021/08/05 03:45:40.757 +00:00] [INFO] [jvm.go:152] ["rule file data:RULE modify return value\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO\n    return 9999\nENDRULE\n"]
[2021/08/05 03:45:41.011 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule modify return value\n\n"]
Attack jvm successfully, uid: 5ca2e06d-a7c6-421d-bb67-0c9908bac17a
```

### 使用命令行模式模拟增加 JVM 压力

#### 增加 JVM 压力命令

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
      --mem-type int    the memory type to be allocated. The value can be 'stack' or 'heap'.

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which needs to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### 增加 JVM 压力相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `cpu-count` | 无 | 增加 CPU 压力所使用的 CPU 核的数量 | int 类型，`cpu-count` 和 `mem-type` 只能配置一个 |
| `mem-type` | 无 | OOM 的类型 | string 类型，目前支持 'stack' 和 'heap' 两种 OOM 类型。`cpu-count` 和 `mem-type` 只能配置一个。 |
| `pid` | 无 | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 无 | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 无 | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 增加 JVM 压力示例

```bash
chaosd attack jvm stress --cpu-count 2 --pid 123546
```

输出如下所示：

```bash
[2021/08/05 03:59:51.256 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --stress-jfeiu\nSTRESS CPU\nCPUCOUNT 2\nENDRULE\n"] [file=/tmp/rule.btm773062009]
[2021/08/05 03:59:51.613 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule --stress-jfeiu\n\n"]
Attack jvm successfully, uid: b9b997b5-0a0d-4f1f-9081-d52a32318b84
```

### 使用命令行模式在 MySQL 的 Java 客户端注入故障

Chaosd 支持在 MySQL 的 Java 客户端执行指定类型的 SQL 语句时对其注入延迟、抛出异常。

#### 注入故障命令

```bash
chaosd attack jvm stress --help
```

输出如下所示：

```bash
inject fault into MySQL client

Usage:
  chaosd attack jvm mysql [options] [flags]

Flags:
  -d, --database string                  the match database
      --exception string                 the exception message needs to throw
  -h, --help                             help for mysql
      --latency int                      the latency duration, unit ms
  -v, --mysql-connector-version string   the version of mysql-connector-java, only support 5.X.X(set to 5) and 8.X.X(set to 8) (default "8")
      --sql-type string                  the match sql type
  -t, --table string                     the match table

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --pid int            the pid of Java process which need to attach
      --port int           the port of agent server (default 9288)
      --uid string         the experiment ID
```

#### 注入故障相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 | 默认值 |
| :-- | :-- | :-- | :-- | :-- |
| `database` | `d` | 可匹配的指定的数据库名称 | string 类型，如 `“test”` | `""`（即匹配所有的数据库） |
| `exception` | 无 | 抛出的自定义异常信息 | string 类型，如 `“BOOM”`。`exception` 和 `latency` 中必须配置一个 | 无 |
| `latency` | 无 | 执行 SQL 的延迟时间 | int 类型，单位为毫秒 (ms)，如 `1000`。`exception` 和 `latency` 中必须配置一个  | 无 |
| `mysql-connector-version` | `v` | 使用的 MySQL 客户端 (mysql-connector-java) 的版本 | int 类型，对于 `5.X.X` 版本设置为 `5`，对于 `8.X.X` 版本设置为 `8` | `8` |
| `sql-type` | 无 | 可匹配的 SQL 类型 | string 类型，可选值为 `"select"`、`"update"`、`"insert"`、`"replace"`、`"delete"`  | `""`（即匹配所有类型的 SQL） |
| `table` | `t` | 可匹配的指定的表名称 | string 类型，如 `"t1"`| `""`（即匹配所有的表） |
| `uid` | 无 | 实验的编号 | string 类型，可以不配置（Chaosd 会随机生成一个） | 无 |
| `port` | 无 | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程  | int 类型 | `9288` |
| `pid` | 无 | 需要注入故障的 Java 进程号  | int 类型，必须设置 |

#### 注入故障示例

1. 部署 TiDB（或者 MySQL）

    执行以下命令，部署一个 `mocktikv` 模式的 TiDB：

    ```bash
    export tidb_dir="tidb-v5.3.0-linux-amd64"
    curl -fsSL -o ${tidb_dir}.tar.gz https://download.pingcap.org/${tidb_dir}.tar.gz
    tar zxvf ${tidb_dir}.tar.gz
    ${tidb_dir}/bin/tidb-server -store mocktikv -P 4000 > tidb.log 2>&1 &
    ```

2. 部署 Demo 应用程序

    部署一个 Demo 应用程序 `mysqldemo`。该应用程序可以接收 HTTP 请求，并查询 TiDB（或者 MySQL）数据库：

    ```bash
    git clone https://github.com/WangXiangUSTC/byteman-example.git
    cd byteman-example/mysqldemo
    mvn -X package -Dmaven.test.skip=true -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true
    export MYSQL_DSN=jdbc:"mysql://127.0.0.1:4000/test"
    export MYSQL_USER=root
    export MYSQL_CONNECTOR_VERSION=8
    mvn exec:java -Dexec.mainClass="com.mysqldemo.App" > mysqldemo.log 2>&1 &
    ```

    执行以下命令，确认应用程序可以正常提供服务：

    ```bash
    curl -X GET "http://127.0.0.1:8001/query?sql=SELECT%20*%20FROM%20mysql.user"
    ```

    你可以在命令输出结果中查看用户名为 root 的用户的信息。

3. 注入故障

    假设 `mysqldemo` 的 PID（需要注入故障的 Java 进程号） 为 `12345`，通过以下命令在该应用程序中注入故障：

    ```bash
    chaosd attack jvm mysql --database mysql --table user --port 9288  --exception "BOOM" --pid 12345
    ```

    注入故障后，正在执行与 `mysql.user` 表相关的 SQL 语句时，应用程序会返回异常信息 `BOOM`。确认该结果后，再次向 `mysqldemo` 发送查询请求：

    ```bash
    curl -X GET "http://127.0.0.1:8001/query?sql=SELECT%20*%20FROM%20mysql.user"
    ```

    结果如下所示：

    ```log
    java.sql.SQLException: BOOM
    at com.mysql.cj.jdbc.exceptions.SQLError.createSQLException(SQLError.java:129)
	  at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:122)
    at com.mysql.cj.jdbc.StatementImpl.executeQuery(StatementImpl.java:1206)
	  at com.mysqldemo.App.querySQL(App.java:125)
	  at com.mysqldemo.App$QueryHandler.handle(App.java:95)
    at jdk.httpserver/com.sun.net.httpserver.Filter$Chain.doFilter(Filter.java:77)
	  at jdk.httpserver/sun.net.httpserver.AuthFilter.doFilter(AuthFilter.java:82)
	  at jdk.httpserver/com.sun.net.httpserver.Filter$Chain.doFilter(Filter.java:80)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Exchange$LinkHandler.handle(ServerImpl.java:692)
    at jdk.httpserver/com.sun.net.httpserver.Filter$Chain.doFilter(Filter.java:77)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Exchange.run(ServerImpl.java:664)
    at jdk.httpserver/sun.net.httpserver.ServerImpl$DefaultExecutor.execute(ServerImpl.java:159)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Dispatcher.handle(ServerImpl.java:442)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Dispatcher.run(ServerImpl.java:408)
	  at java.base/java.lang.Thread.run(Thread.java:832)
    ```

## 使用服务模式创建实验

要使用服务模式创建实验，请进行以下操作：

1. 以服务模式运行 Chaosd。

    ```bash
    chaosd server --port 31767
    ```

2. 向 Chaosd 服务的路径 `/api/attack/jvm` 发送 `POST` HTTP 请求。

    ```bash
    curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{fault-configuration}'
    ```

    在上述命令中，你需要按照故障类型在 `fault-configuration` 中进行配置。有关对应的配置参数，请参考下文中各个类型故障的相关参数说明和命令示例。

:::note 注意

在运行实验时，请注意保存实验的 UID 信息。当要结束 UID 对应的实验时，需要向 Chaosd 服务的路径 /api/attack/{uid} 发送 `DELETE` HTTP 请求。

:::

### 使用服务模式模拟抛出自定义异常

#### 抛出自定义异常相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 "exception" |
| `class` | Java 类的名称 | string 类型，必须配置 |
| `exception` | 抛出的自定义异常 | string 类型，必须配置 |
| `method` | 方法名称 | string 类型，必须配置 |
| `pid` | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 使用服务模式模拟抛出自定义异常示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"exception","class":"Main","method":"sayhello","exception":"java.io.IOException(\"BOOM\")","pid":1828622}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

### 使用服务模式模拟触发垃圾回收

#### 触发垃圾回收相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 "gc" |
| `pid` | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 使用服务模式模拟触发垃圾回收示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"gc","pid":1828622}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

触发垃圾回收为一次性操作，实验不需要恢复。

### 使用服务模式模拟增加方法延迟

#### 增加方法延迟相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 "latency" |
| `class` | Java 类的名称 | string 类型，必须配置 |
| `latency` | 增加方法的延迟时间 | int 类型，必须配置，单位为 ms |
| `method` | 方法名称 | string 类型，必须配置 |
| `pid` | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 使用服务模式模拟增加方法延迟示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"latency","class":"Main","method":"sayhello","latency":5000,"pid":1828622}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

### 使用服务模式模拟修改方法返回值

#### 修改方法返回值相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 "return" |
| `class` | Java 类的名称 | string 类型，必须配置 |
| `method` | 方法名称 | string 类型，必须配置 |
| `value` | 指定方法的返回值 | string 类型，必须配置。目前支持数字和字符串类型的返回值，如果为字符串，则需要使用双引号，例如："chaos"。 |
| `pid` | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 使用服务模式模拟修改方法返回值示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"return","class":"Main","method":"getnum","value":"999","pid":1828622}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

### 服务模式下设置 Byteman 配置文件触发故障

通过 Byteman 规则配置来设置故障规则。关于 Byteman 的规则配置，请参考 [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language)。

#### 设置 Byteman 配置文件触发故障相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 "rule-data" |
| `rule-data` | 指定 Byteman 配置数据 | string 类型，必须配置 |
| `pid` | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 服务模式下设置 Byteman 配置文件触发故障示例

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

其次，通过如下命令把配置中的换行转换为换行符 "\n"，并将转换后的数据设置为参数 "rule-data" 的值：

```bash
curl -X POST 127.0.0.1:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"rule-data","pid":30045,"rule-data":"\nRULE modify return value\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO return 9999\nENDRULE\n"}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

### 使用服务模式模拟增加 JVM 压力

#### 增加 JVM 压力相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 "stress" |
| `cpu-count` | 增加 CPU 压力所使用的 CPU 核的数量 | int 类型，`cpu-count` 和 `mem-type` 中必须配置一个 |
| `mem-type` | OOM 的类型 | string 类型，目前支持 'stack' 和 'heap' 两种 OOM 类型。`cpu-count` 和 `mem-type` 中必须配置一个 |
| `pid` | 需要注入故障的 Java 进程号 | int 类型，必须配置 |
| `port` | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程 | int 类型，默认为 `9288` |
| `uid` | 实验的编号 | string 类型，可以不配置，Chaosd 会随机生成一个 |

#### 使用服务模式模拟增加 JVM 压力示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"stress","cpu-count":1,"pid":1828622}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

### 使用服务模式模拟对 MySQL Java 客户端注入故障

Chaosd 支持对 MySQL 的 Java 客户端执行指定类型的 SQL 时注入延迟、抛出异常。

#### 注入故障相关参数说明

| 配置项 | 说明 | 值 | 默认值 |
| :-- | :-- | :-- | :-- |
| `database` | 可匹配的指定的数据库名称 | string 类型，如 `“test”` | `""`（即匹配所有的数据库） |
| `exception` | 抛出的自定义异常信息 | string 类型，如 `“BOOM”`。`exception` 和 `latency` 中必须配置一个 | 无 |
| `latency` | 执行 SQL 的延迟时间 | int 类型，单位为毫秒 (ms)，如 `1000`。`exception` 和 `latency` 中必须配置一个  | 无 |
| `mysql-connector-version` | 使用的 MySQL 客户端 (mysql-connector-java) 的版本 | int 类型，对于 `5.X.X` 版本设置为 `5`，对于 `8.X.X` 版本设置为 `8` | `8` |
| `sql-type` | 可匹配的 SQL 类型 | string 类型，可选值为 `"select"`、`"update"`、`"insert"`、`"replace"`、`"delete"`  | `""`（即匹配所有类型的 SQL） |
| `table` | 可匹配的指定的表名称 | string 类型，如 `"t1"`| `""`（即匹配所有的表） |
| `uid` | 实验的编号 | string 类型，可以不配置（Chaosd 会随机生成一个） | 无 |
| `port` | 附加到 Java 进程 agent 的端口号，通过该端口号将故障注入到 Java 进程  | int 类型 | `9288` |
| `pid` | 需要注入故障的 Java 进程号  | int 类型，必须设置 |

#### 使用服务模式模拟 MySQL 故障示例

1. 部署 TiDB（或者 MySQL）和 Demo 应用程序

    在注入故障前，你需要提前部署 TiDB（或者 MySQL）和 Demo 应用程序 `mysqldemo`。具体的部署步骤，请参阅 [使用命令行模式在 MySQL 的 Java 客户端注入故障的示例](#注入故障示例) 中的步骤 1 和步骤 2。

2. 注入故障

    假设 `mysqldemo` 的 PID（需要注入故障的 Java 进程号） 为 `12345`，通过以下命令在该应用程序中注入故障：

    ```bash
    curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"mysql","database":"mysql", "table":"user", "port":9288, "exception":"boom", "pid":12345}'
    ```

   结果如下所示：

    ```log
    java.sql.SQLException: BOOM
	  at com.mysql.cj.jdbc.exceptions.SQLError.createSQLException(SQLError.java:129)
	  at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:122)
    at com.mysql.cj.jdbc.StatementImpl.executeQuery(StatementImpl.java:1206)
	  at com.mysqldemo.App.querySQL(App.java:125)
	  at com.mysqldemo.App$QueryHandler.handle(App.java:95)
    at jdk.httpserver/com.sun.net.httpserver.Filter$Chain.doFilter(Filter.java:77)
	  at jdk.httpserver/sun.net.httpserver.AuthFilter.doFilter(AuthFilter.java:82)
	  at jdk.httpserver/com.sun.net.httpserver.Filter$Chain.doFilter(Filter.java:80)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Exchange$LinkHandler.handle(ServerImpl.java:692)
    at jdk.httpserver/com.sun.net.httpserver.Filter$Chain.doFilter(Filter.java:77)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Exchange.run(ServerImpl.java:664)
    at jdk.httpserver/sun.net.httpserver.ServerImpl$DefaultExecutor.execute(ServerImpl.java:159)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Dispatcher.handle(ServerImpl.java:442)
	  at jdk.httpserver/sun.net.httpserver.ServerImpl$Dispatcher.run(ServerImpl.java:408)
	  at java.base/java.lang.Thread.run(Thread.java:832)
    ```
