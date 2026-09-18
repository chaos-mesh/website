---
title: Simulate JVM Application Faults
---

Chaosd simulates JVM application faults through [Byteman](https://github.com/chaos-mesh/byteman). The supported fault types are as follows:

- Throw custom exceptions
- Trigger garbage collection
- Increase method latency
- Modify return values of a method
- Trigger faults by setting Byteman configuration files
- Increase JVM pressure

Chaosd also supports injecting the above faults into common services or their Java clients. For example, when a MySQL Java client executes SQL statements of the specified types (`"select"`, `"update"`, `"insert"`, `"replace"`, or `"delete"`), you can use Chaosd to inject latency or throw exceptions into that client.

This document describes how to use Chaosd to create the above fault types of JVM experiments.

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

To create experiments using the service mode, you need to run Chaosd in the service mode and then send a `POST` HTTP request to the `/api/attack/jvm` path of the Chaosd service:

```bash
chaosd server --port 31767
```

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{fault-configuration}'
```

For the `fault-configuration` part in the above command, you need to configure it according to the fault types. For the corresponding parameters and examples, refer to the parameters of each fault type in the following sections.

:::note

When running an experiment, remember to save the UID information of the experiment. When you want to end the experiment corresponding to the UID, you need to send an HTTP DELETE request to the `/api/attack/{uid}` path of Chaosd service.

:::

## Throw custom exceptions

### Parameters for throwing custom exceptions

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | The action of the experiment | string | Set to `"exception"` |
| `class` | `c` | `class` | The name of the Java class | string | Required |
| `exception` | — | `exception` | The thrown custom exception | string | Required |
| `method` | `m` | `method` | The name of the method | string | Required |
| `pid` | — | `pid` | The Java process ID where the fault is to be injected | int | Required |
| `port` | — | `port` | The port number attached to the Java process agent. The fault is injected into the Java process through this port number. | int | The default value is `9288`. |
| `uid` | — | `uid` | The experiment ID | string | This item is not required to be configured, because Chaosd randomly creates one. |

### Throw custom exceptions using the command-line mode

To see the usage and configuration items of the command that throws custom exceptions, run the following command:

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

The example for throwing custom exceptions is as follows:

```bash
chaosd attack jvm exception -c Main -m sayhello --exception 'java.io.IOException("BOOM")' --pid 30045
```

The result is as follows:

```bash
[2021/08/05 02:39:39.106 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-exception-q6nd0\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tthrow new java.io.IOException(\"BOOM\");\nENDRULE\n"] [file=/tmp/rule.btm296930759]
Attack jvm successfully, uid: 26a45ae2-d395-46f5-a126-2b2c6c85ae9d
```

### Throw custom exceptions using the service mode

Send a `POST` HTTP request to the `/api/attack/jvm` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"exception","class":"Main","method":"sayhello","exception":"java.io.IOException(\"BOOM\")","pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

## Trigger garbage collection

### Parameters for triggering garbage collection

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | The action of the experiment | string | Set to `"gc"` |
| `pid` | — | `pid` | The Java process ID where the fault is to be injected | int | Required |
| `port` | — | `port` | The port number attached to the Java process agent. The fault is injected into the Java process through this port number. | int | The default value is `9288`. |
| `uid` | — | `uid` | The experiment ID | string | This item is not required to be configured, because Chaosd randomly creates one. |

### Trigger garbage collection using the command-line mode

To see the usage and configuration items of the command that triggers garbage collection, run the following command:

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

The example for triggering garbage collection is as follows:

```bash
chaosd attack jvm gc --pid 89345
```

The result is as follows:

```bash
[2021/08/05 02:49:47.850 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --gc-u0mlf\nGC\nENDRULE\n"] [file=/tmp/rule.btm012481052]
Attack jvm successfully, uid: f360e70a-5359-49b6-8526-d7e0a3c6f696
```

Triggering garbage collection is a one-time operation, and the experiment does not require recovery.

### Trigger garbage collection using the service mode

Send a `POST` HTTP request to the `/api/attack/jvm` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"gc","pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"c3c519bf-819a-4a7b-97fb-e3d0814481fa"}
```

Triggering garbage collection is a one-time operation. The experiment does not require recovery.

## Increase method latency

### Parameters for increasing method latency

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | The action of the experiment | string | Set to `"latency"` |
| `class` | `c` | `class` | The name of the Java class | string | Required |
| `latency` | — | `latency` | The duration of increasing method latency | int | Required. The unit is millisecond. |
| `method` | `m` | `method` | The name of the method | string | Required |
| `pid` | — | `pid` | The Java process ID where the fault is to be injected | int | Required |
| `port` | — | `port` | The port number attached to the Java process agent. The fault is injected into the Java process through this port number. | int | The default value is `9288`. |
| `uid` | — | `uid` | The experiment ID | string | This item is not required to be configured, because Chaosd randomly creates one. |

### Increase method latency using the command-line mode

To see the usage and configuration items of the command that increases method latency, run the following command:

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

The example for increasing method latency is as follows:

```bash
chaosd attack jvm latency --class Main --method sayhello --latency 5000 --pid 100840
```

The result is as follows:

```bash
[2021/08/05 03:08:50.716 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-sayhello-latency-hlib2\nCLASS Main\nMETHOD sayhello\nAT ENTRY\nIF true\nDO \n\tThread.sleep(5000);\nENDRULE\n"] [file=/tmp/rule.btm359997255]
[2021/08/05 03:08:51.155 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-sayhello-latency-hlib2\n\n"]
Attack jvm successfully, uid: bbe00c57-ac9d-4113-bf0c-2a6f184be261
```

### Increase method latency using the service mode

Send a `POST` HTTP request to the `/api/attack/jvm` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"latency","class":"Main","method":"sayhello","latency":5000,"pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

## Modify return values of a method

### Parameters for modifying return values of a method

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | The action of the experiment | string | Set to `"return"` |
| `class` | `c` | `class` | The name of the Java class | string | Required |
| `method` | `m` | `method` | The name of the method | string | Required |
| `value` | — | `value` | Specifies the return value of the method | string | Required. Currently, the item can be numeric and string types. If the item (return value) is string, double quotes are required, like "chaos". |
| `pid` | — | `pid` | The Java process ID where the fault is to be injected | int | Required |
| `port` | — | `port` | The port number attached to the Java process agent. The fault is injected into the Java process through this port number. | int | The default value is `9288`. |
| `uid` | — | `uid` | The experiment ID | string | This item is not required to be configured, because Chaosd randomly creates one. |

### Modify return values of a method using the command-line mode

To see the usage and configuration items of the command that modifies return values of a method, run the following command:

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

The example for simulating the scenario of modifying return values of a method is as follows:

```bash
chaosd attack jvm return --class Main --method getnum --value 999 --pid 112694
```

The result is as follows:

```bash
[2021/08/05 03:35:10.603 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE Main-getnum-return-i6gb7\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO \n\treturn 999;\nENDRULE\n"] [file=/tmp/rule.btm051982059]
[2021/08/05 03:35:10.820 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule Main-getnum-return-i6gb7\n\n"]
Attack jvm successfully, uid: e2f204f6-4bed-4d92-aade-2b4a47b02e5d
```

### Modify return values of a method using the service mode

Send a `POST` HTTP request to the `/api/attack/jvm` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"return","class":"Main","method":"getnum","value":"999","pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

## Trigger faults by setting Byteman configuration files

You can set the fault rules in the Byteman rule configuration file, and then inject the faults by specifying the path of the configuration file using Chaosd. Regarding the Byteman rule configuration, refer to [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language).

### Parameters for triggering faults by setting Byteman configuration files

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | The action of the experiment | string | Set to `"rule-data"` |
| `path` | — | `path` | Specifies the path of the Byteman configuration file | string | Required |
| `rule-data` | — | `rule-data` | Specifies the Byteman configuration data | string | Required |
| `pid` | — | `pid` | The Java process ID where the fault is to be injected | int | Required |
| `port` | — | `port` | The port number attached to the Java process agent. The fault is injected into the Java process through this port number. | int | The default value is `9288`. |
| `uid` | — | `uid` | The experiment ID | string | This item is not required to be configured, because Chaosd randomly creates one. |

### Trigger faults by setting Byteman configuration files using the command-line mode

To see the usage and configuration items of the command that triggers faults by setting Byteman configuration files, run the following command:

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

First, based on the specific Java program and referring to [the Byteman rule language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language), write a rule configuration file. For example:

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

Then, save the configuration file to the `return.btm` file. After that, run the following command to inject faults.

```bash
chaosd attack jvm rule-file -p ./return.btm --pid 112694
```

The result is as follows:

```bash
[2021/08/05 03:45:40.757 +00:00] [INFO] [jvm.go:152] ["rule file data:RULE modify return value\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO\n    return 9999\nENDRULE\n"]
[2021/08/05 03:45:41.011 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule modify return value\n\n"]
Attack jvm successfully, uid: 5ca2e06d-a7c6-421d-bb67-0c9908bac17a
```

### Trigger faults by setting Byteman configuration files using the service mode

You can set the fault rules according to the Byteman rule configuration. For more information about the Byteman rule configuration, refer to [byteman-rule-language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language).

First, based on the specific Java program and referring to [the Byteman rule language](https://downloads.jboss.org/byteman/4.0.16/byteman-programmers-guide.html#the-byteman-rule-language), write a rule configuration file. For example:

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

Then, escape the line breaks in the configuration file to the newline character "\n", and use the escaped text as the value of "rule-data". Run the following command:

```bash
curl -X POST 127.0.0.1:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"rule-data","pid":30045,"rule-data":"\nRULE modify return value\nCLASS Main\nMETHOD getnum\nAT ENTRY\nIF true\nDO return 9999\nENDRULE\n"}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

## Increase JVM stress

### Parameters for increasing JVM stress

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | The action of the experiment | string | Set to `"stress"` |
| `cpu-count` | — | `cpu-count` | The number of CPU cores used for increasing JVM stress | int | You must configure one of `cpu-count` and `mem-type`. |
| `mem-type` | — | `mem-type` | The type of OOM | string | Currently, both 'stack' and 'heap' OOM types are supported. You must configure one of `cpu-count` and `mem-type`. |
| `pid` | — | `pid` | The Java process ID where the fault is to be injected | int | Required |
| `port` | — | `port` | The port number attached to the Java process agent. The fault is injected into the Java process through this port number. | int | The default value is `9288`. |
| `uid` | — | `uid` | The experiment ID | string | This item is not required to be configured, because Chaosd randomly creates one. |

### Increase JVM stress using the command-line mode

To see the usage and configuration items of the command that increases JVM stress, run the following command:

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

The example for increasing JVM stress is as follows:

```bash
chaosd attack jvm stress --cpu-count 2 --pid 123546
```

The result is as follows:

```bash
[2021/08/05 03:59:51.256 +00:00] [INFO] [jvm.go:208] ["byteman rule"] [rule="\nRULE --stress-jfeiu\nSTRESS CPU\nCPUCOUNT 2\nENDRULE\n"] [file=/tmp/rule.btm773062009]
[2021/08/05 03:59:51.613 +00:00] [INFO] [jvm.go:94] ["submit rules"] [output="install rule --stress-jfeiu\n\n"]
Attack jvm successfully, uid: b9b997b5-0a0d-4f1f-9081-d52a32318b84
```

### Increase JVM stress using the service mode

Send a `POST` HTTP request to the `/api/attack/jvm` path of the Chaosd service with the following `fault-configuration`:

```bash
curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"stress","cpu-count":1,"pid":1828622}'
```

The result is as follows:

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

## Trigger faults in the MySQL Java client

Chaosd supports injecting latency or throwing exceptions when the MySQL Java client executes SQL statements of the specified types.

### Parameters for triggering faults

| Configuration item | Abbreviation | Service mode field | Description | Type | Value |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `action` | — | `action` | The action of the experiment | string | Set to `"mysql"` |
| `database` | `d` | `database` | The name of the database to match | string | Such as `"test"`. Default value: `""` (matches all databases). |
| `exception` | — | `exception` | The custom exception message to throw | string | Such as `"BOOM"`. You must set one of `exception` or `latency`. |
| `latency` | — | `latency` | The latency of executing the SQL statements | int | In milliseconds, such as `1000`. You must set one of `exception` or `latency`. |
| `mysql-connector-version` | `v` | `mysql-connector-version` | The version of the MySQL client (mysql-connector-java) | string | Set to `5` for `5.X.X` or `8` for `8.X.X`. Default value: `8`. |
| `sql-type` | — | `sql-type` | The SQL type to match | string | Optional values: `"select"`, `"update"`, `"insert"`, `"replace"`, `"delete"`. Default value: `""` (matches all SQL types). |
| `table` | `t` | `table` | The name of the table to match | string | Such as `"t1"`. Default value: `""` (matches all tables). |
| `pid` | — | `pid` | The Java process ID where the fault is to be injected | int | Required |
| `port` | — | `port` | The port number attached to the Java process agent. The fault is injected into the Java process through this port number. | int | The default value is `9288`. |
| `uid` | — | `uid` | The experiment ID | string | This item is not required to be configured, because Chaosd randomly creates one. |

### Trigger faults in the MySQL Java client using the command-line mode

To see the usage and configuration items of the command that triggers faults, run the following command:

```bash
chaosd attack jvm mysql --help
```

The result is as follows:

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

To trigger faults in the MySQL Java client, follow the instructions below:

1. Deploy TiDB (or MySQL)

   Run the following command to deploy TiDB in `mocktikv` mode:

   ```bash
   export tidb_dir="tidb-v5.3.0-linux-amd64"
   curl -fsSL -o ${tidb_dir}.tar.gz https://download.pingcap.org/${tidb_dir}.tar.gz
   tar zxvf ${tidb_dir}.tar.gz
   ${tidb_dir}/bin/tidb-server -store mocktikv -P 4000 > tidb.log 2>&1 &
   ```

2. Deploy the demo application

   Deploy a demo application `mysqldemo`. This application accepts HTTP requests and queries the TiDB (or MySQL) database:

   ```bash
   git clone https://github.com/WangXiangUSTC/byteman-example.git
   cd byteman-example/mysqldemo
   mvn -X package -Dmaven.test.skip=true -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true
   export MYSQL_DSN=jdbc:"mysql://127.0.0.1:4000/test"
   export MYSQL_USER=root
   export MYSQL_CONNECTOR_VERSION=8
   mvn exec:java -Dexec.mainClass="com.mysqldemo.App" > mysqldemo.log 2>&1 &
   ```

   Run the following command to confirm that the application is serving normally:

   ```bash
   curl -X GET "http://127.0.0.1:8001/query?sql=SELECT%20*%20FROM%20mysql.user"
   ```

   You can view the information of the `root` user in the command output.

3. Inject faults

   Assume the PID of `mysqldemo` (the Java process ID where the fault is to be injected) is `12345`. Run the following command to inject faults into the application:

   ```bash
   chaosd attack jvm mysql --database mysql --table user --port 9288 --exception "BOOM" --pid 12345
   ```

   After injecting the fault, when the SQL statements related to the `mysql.user` table are being executed, the application returns the exception `BOOM`. After confirming this result, send the query request to `mysqldemo` again:

   ```bash
   curl -X GET "http://127.0.0.1:8001/query?sql=SELECT%20*%20FROM%20mysql.user"
   ```

   The result is as follows:

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

### Trigger faults in the MySQL Java client using the service mode

Chaosd supports injecting latency or throwing exceptions when the MySQL Java client executes SQL statements of the specified types.

To trigger faults in the MySQL Java client using the service mode, follow the instructions below:

1. Deploy TiDB (or MySQL) and the demo application

   Before injecting faults, you need to deploy TiDB (or MySQL) and the demo application `mysqldemo` in advance. For the deployment steps, refer to step 1 and step 2 in [the example of triggering faults in the MySQL Java client using the command-line mode](#trigger-faults-in-the-mysql-java-client-using-the-command-line-mode).

2. Inject faults

   Assume the PID of `mysqldemo` (the Java process ID where the fault is to be injected) is `12345`. Run the following command to inject faults into the application:

   ```bash
   curl -X POST 172.16.112.130:31767/api/attack/jvm -H "Content-Type:application/json" -d '{"action":"mysql","database":"mysql", "table":"user", "port":9288, "exception":"boom", "pid":12345}'
   ```

   The result is as follows:

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
   at jdk.httpserver/com.sun.net.httpserver.ServerImpl$DefaultExecutor.execute(ServerImpl.java:159)
     at jdk.httpserver/sun.net.httpserver.ServerImpl$Dispatcher.handle(ServerImpl.java:442)
     at jdk.httpserver/sun.net.httpserver.ServerImpl$Dispatcher.run(ServerImpl.java:408)
     at java.base/java.lang.Thread.run(Thread.java:832)
   ```
