---
title: 模拟磁盘故障
---

本文主要介绍如何使用 Chaosd 模拟磁盘故障场景。使用该功能，你可以在物理机器上模拟磁盘读写负载（通过 [dd](https://man7.org/linux/man-pages/man1/dd.1.html)）或磁盘填充（通过 [dd](https://man7.org/linux/man-pages/man1/dd.1.html) 或 [fallocate](https://man7.org/linux/man-pages/man1/fallocate.1.html)）。

## 使用命令行模式创建实验

本节介绍如何在命令行模式中创建磁盘故障实验。

在创建磁盘故障实验前，可运行以下命令行查看 Chaosd 支持的磁盘故障类型：

```bash
chaosd attack disk -h
```

输出结果如下所示：

```bash
disk attack related command

Usage:
  chaosd attack disk [command]

Available Commands:
  add-payload add disk payload
  fill        fill disk

Flags:
  -h, --help   help for disk

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'

Use "chaosd attack disk [command] --help" for more information about a command.
```

目前 Chaosd 支持创建磁盘读负载实验、磁盘写负载实验、磁盘填充实验。

### 模拟磁盘读负载

#### 模拟磁盘读负载命令

```bash
chaosd attack disk add-payload read -h
```

输出结果如下所示：

```bash
read payload

Usage:
  chaosd attack disk add-payload read [flags]

Flags:
  -h, --help                help for read
  -p, --path string         'path' specifies the location to read data.If path not provided, payload will read from disk mount on "/"
  -n, --process-num uint8   'process-num' specifies the number of process work on reading , default 1, only 1-255 is valid value (default 1)
  -s, --size string         'size' specifies how many units of data will read from the file path.'unit' specifies the unit of data, support c=1, w=2, b=512, kB=1000, K=1024, MB=1000*1000,M=1024*1024, , GB=1000*1000*1000, G=1024*1024*1024 BYTESexample : 1M | 512kB

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### 模拟磁盘读负载相关配置说明

| 配置项      | 配置缩写 | 说明                                                                                                                                                                    | 值                                   |
| :---------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| path        | p        | 指定所读数据的文件路径。如果没有设置此参数，或者设置参数值为空字符串，则从目录“/”所挂载的虚拟磁盘文件读取。根据读取文件的权限不同，会需要用户使用一定的权限运行本程序。 | string 类型，默认为""                |
| process-num | n        | 指定使用多少个并发运行的 [dd](https://man7.org/linux/man-pages/man1/dd.1.html) 进程执行程序。                                                                           | uint8 类型，默认值为 1，范围为 1-255 |
| size        | s        | 指定读取多少数据。size 为 多个 dd 读数据的总量。                                                                                                                        |                                      |

#### 模拟磁盘读负载示例

```bash
chaosd attack disk add-payload read -s 1000G -n 7 -p /dev/zero
```

输出结果如下所示：

```bash
andrew@LAPTOP-NUS30NQD:~/chaosd/bin$ ./chaosd attack disk add-payload read -s 1000G -n 7 -p /dev/zero
[2021/05/20 13:54:31.323 +08:00] [INFO] [disk.go:128] ["5242880+0 records in\n5242880+0 records out\n5242880 bytes (5.2 MB, 5.0 MiB) copied, 4.13252 s, 1.3 MB/s\n"]
[2021/05/20 13:54:46.977 +08:00] [INFO] [disk.go:147] ["146285+0 records in\n146285+0 records out\n153390940160 bytes (153 GB, 143 GiB) copied, 15.6513 s, 9.8 GB/s\n"]
[2021/05/20 13:54:47.002 +08:00] [INFO] [disk.go:147] ["146285+0 records in\n146285+0 records out\n153390940160 bytes (153 GB, 143 GiB) copied, 15.6762 s, 9.8 GB/s\n"]
[2021/05/20 13:54:47.004 +08:00] [INFO] [disk.go:147] ["146285+0 records in\n146285+0 records out\n153390940160 bytes (153 GB, 143 GiB) copied, 15.6777 s, 9.8 GB/s\n"]
[2021/05/20 13:54:47.015 +08:00] [INFO] [disk.go:147] ["146285+0 records in\n146285+0 records out\n153390940160 bytes (153 GB, 143 GiB) copied, 15.6899 s, 9.8 GB/s\n"]
[2021/05/20 13:54:47.018 +08:00] [INFO] [disk.go:147] ["146285+0 records in\n146285+0 records out\n153390940160 bytes (153 GB, 143 GiB) copied, 15.6914 s, 9.8 GB/s\n"]
[2021/05/20 13:54:47.051 +08:00] [INFO] [disk.go:147] ["146285+0 records in\n146285+0 records out\n153390940160 bytes (153 GB, 143 GiB) copied, 15.7254 s, 9.8 GB/s\n"]
[2021/05/20 13:54:47.074 +08:00] [INFO] [disk.go:147] ["146285+0 records in\n146285+0 records out\n153390940160 bytes (153 GB, 143 GiB) copied, 15.7487 s, 9.7 GB/s\n"]
Read file /dev/zero successfully, uid: 4bc9b74a-5fe2-4038-b4f2-09ae95b57694
```

### 模拟磁盘写负载

#### 模拟磁盘写负载命令

```bash
chaosd attack disk add-payload write -h
```

输出结果如下所示：

```bash
write payload

Usage:
  chaosd attack disk add-payload write [flags]

Flags:
  -h, --help                help for write
  -p, --path string         'path' specifies the location to fill data in.If path not provided, payload will write into a temp file, temp file will be deleted after writing
  -n, --process-num uint8   'process-num' specifies the number of process work on writing , default 1, only 1-255 is valid value (default 1)
  -s, --size string         'size' specifies how many units of data will write into the file path.'unit' specifies the unit of data, support c=1, w=2, b=512, kB=1000, K=1024, MB=1000*1000,M=1024*1024, , GB=1000*1000*1000, G=1024*1024*1024 BYTESexample : 1M | 512kB

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### 模拟磁盘写负载相关配置说明

| 配置项      | 配置缩写 | 说明                                                                                                                                                                     | 值                                                                                                                                                                                                                  |
| :---------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| path        | p        | 指定所写数据的文件路径。如果没有设置此参数，或者设置参数值为空字符串，则会在程序执行目录下创建一个临时文件。根据写入文件的权限不同，会需要用户使用一定的权限运行本程序。 | string 类型，默认为 ""                                                                                                                                                                                              |
| process-num | n        | 指定使用多少个并发运行的 [dd](https://man7.org/linux/man-pages/man1/dd.1.html) 进程执行程序。                                                                            | uint8 类型。默认值为 1，范围为 1-255                                                                                                                                                                                |
| size        | s        | 指定写入多少数据，size 为 多个 dd 写数据的总量。                                                                                                                         | string 类型，默认为""，合法形式为一个整数加一个单位。例如：1M、512kB。支持的单位有 c=1、w=2、b=512、kB=1000、K=1024、MB=1000\*1000,M=1024\*1024、GB=1000\*1000\*1000、G=1024\*1024\*1024 BYTE 等。size 不能为 "" 。 |

#### 模拟磁盘写负载示例

```bash
chaosd attack disk add-payload write -s 2G -n 8
```

输出结果如下所示：

```bash
[2021/05/20 14:28:14.452 +08:00] [INFO] [disk.go:128] ["0+0 records in\n0+0 records out\n0 bytes copied, 4.3e-05 s, 0.0 kB/s\n"]
[2021/05/20 14:28:16.793 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.32841 s, 115 MB/s\n"]
[2021/05/20 14:28:16.793 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.3344 s, 115 MB/s\n"]
[2021/05/20 14:28:16.793 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.33312 s, 115 MB/s\n"]
[2021/05/20 14:28:16.793 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.33466 s, 115 MB/s\n"]
[2021/05/20 14:28:16.793 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.33189 s, 115 MB/s\n"]
[2021/05/20 14:28:16.793 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.33752 s, 115 MB/s\n"]
[2021/05/20 14:28:16.793 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.33295 s, 115 MB/s\n"]
[2021/05/20 14:28:16.794 +08:00] [INFO] [disk.go:147] ["256+0 records in\n256+0 records out\n268435456 bytes (268 MB, 256 MiB) copied, 2.3359 s, 115 MB/s\n"]
Write file /home/andrew/chaosd/bin/example255569279 successfully, uid: e66afd86-6f3e-43a0-b161-09447ed84856
```

### 模拟磁盘填充

#### 模拟磁盘填充命令

```bash
chaosd attack disk fill -h
```

输出结果如下所示：

```bash
fill disk

Usage:
  chaosd attack disk fill [flags]

Flags:
  -d, --destroy          destroy file after filled in or allocated
  -f, --fallocate        fill disk by fallocate instead of dd (default true)
  -h, --help             help for fill
  -p, --path string      'path' specifies the location to fill data in.If path not provided, a temp file will be generated and deleted immediately after data filled in or allocated
  -c, --percent string   'percent' how many percent data of disk will fill in the file path
  -s, --size string      'size' specifies how many units of data will fill in the file path.'unit' specifies the unit of data, support c=1, w=2, b=512, kB=1000, K=1024, MB=1000*1000,M=1024*1024, , GB=1000*1000*1000, G=1024*1024*1024 BYTESexample : 1M | 512kB

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

#### 模拟磁盘填充相关配置说明

| 配置项    | 配置缩写 | 说明                                                                                                                                                                     | 值                                                                                                                                                                                                                               |
| :-------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| destroy   | d        | 如果此参数为 true ，则在填充文件后立即删除填充文件                                                                                                                       | bool 类型，默认为 false。                                                                                                                                                                                                        |
| fallocate | f        | 如果此参数为 true ，则使用 linux 调用 fallocate 来快速申请磁盘空间，此时 size 必须大于 0。如果此参数为 false，则使用 linux 调用 dd 以相对较慢速度填充磁盘。              | bool 类型，默认为 true。                                                                                                                                                                                                         |
| path      | p        | 指定所写数据的文件路径。如果没有设置此参数，或者设置参数值为空字符串，则会在程序执行目录下创建一个临时文件。根据写入文件的权限不同，会需要用户使用一定的权限运行本程序。 | string 类型，默认为 ""                                                                                                                                                                                                           |
| percent   | c        | 指定填充多少百分比磁盘。                                                                                                                                                 | string 类型，默认为 ""，可以填入 uint 类型的正整数， size 不能和 percent 都为 ""                                                                                                                                                 |
| size      | s        | 指定写入多少数据。                                                                                                                                                       | string 类型，默认为""，合法形式为一个整数加一个单位。例如：1M、512kB。支持的单位有 c=1、w=2、b=512、kB=1000、K=1024、MB=1000\*1000,M=1024\*1024、GB=1000\*1000\*1000、G=1024\*1024\*1024 BYTE 等。size 不能和 percent 都为 "" 。 |

#### 模拟磁盘填充示例

```bash
chaosd attack disk fill -c 50 -d
```

输出结果如下所示：

```bash
[2021/05/20 14:30:02.943 +08:00] [INFO] [disk.go:215]
Fill file /home/andrew/chaosd/bin/example623832242 successfully, uid: 097b4214-8d8e-46ad-8768-c3e0d8cbb326
```

## 使用服务模式创建实验

### 服务模式模拟磁盘读负载

#### 模拟磁盘读负载相关参数说明

| 参数      | 说明        | 值                                   |
| :---------- |:---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| action | 实验的行为 | 设置为 "read-payload" |
| path        | 指定所读数据的文件路径。如果没有设置此参数，或者设置参数值为空字符串，则从目录“/”所挂载的虚拟磁盘文件读取。根据读取文件的权限不同，会需要用户使用一定的权限运行本程序。 | string 类型，默认为""                |
| process-num | 指定使用多少个并发运行的 [dd](https://man7.org/linux/man-pages/man1/dd.1.html) 进程执行程序。        | uint8 类型，默认值为 1，范围为 1-255 |
| size       | 指定读取多少数据。size 为 多个 dd 读数据的总量。                       | string 类型，默认为""，合法形式为一个整数加一个单位。例如：1M、512kB。支持的单位有 c=1、w=2、b=512、kB=1000、K=1024、MB=1000\*1000,M=1024\*1024、GB=1000\*1000\*1000、G=1024\*1024\*1024 BYTE 等。size 不能和 percent 都为 "" 。    |

#### 服务模式模拟磁盘读负载示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/disk -H "Content-Type:application/json" -d '{"action":"read-payload","path":"/dev/zero", "process-num":7,"size":"1000G"}'
```

输出结果如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

读负载为一次性操作，实验不需要恢复。

### 服务模式模拟磁盘写负载

#### 模拟磁盘写负载相关参数说明

| 参数      | 说明   | 值      |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| action | 实验的行为 | 设置为 "write-payload" |
| path        | 指定所写数据的文件路径。如果没有设置此参数，或者设置参数值为空字符串，则会在程序执行目录下创建一个临时文件。根据写入文件的权限不同，会需要用户使用一定的权限运行本程序。 | string 类型，默认为 ""       |
| process-num | 指定使用多少个并发运行的 [dd](https://man7.org/linux/man-pages/man1/dd.1.html) 进程执行程序。                   | uint8 类型。默认值为 1，范围为 1-255                    |
| size       | 指定写入多少数据，size 为 多个 dd 写数据的总量。             | string 类型，默认为""，合法形式为一个整数加一个单位。例如：1M、512kB。支持的单位有 c=1、w=2、b=512、kB=1000、K=1024、MB=1000\*1000,M=1024\*1024、GB=1000\*1000\*1000、G=1024\*1024\*1024 BYTE 等。size 不能为 "" 。 |

#### 服务模式模拟磁盘写负载示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/disk -H "Content-Type:application/json" -d '{"action":"write-payload","path":"/tmp/test", "process-num":7,"size":"1000G"}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

运行以下命令来结束 uid 对应的实验：

```bash
curl -X DELETE 172.16.112.130:31767/api/attack/a551206c-960d-4ac5-9056-518e512d4d0d
```

### 服务模式模拟磁盘填充

#### 模拟磁盘填充相关参数说明

| 参数    | 说明      | 值    |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action | 实验的行为 | 设置为 "fill" |
| destroy   | 如果此参数为 true ，则在填充文件后立即删除填充文件              | bool 类型，默认为 false。        |
| fill_by_fallocate | 如果此参数为 true ，则使用 linux 调用 fallocate 来快速申请磁盘空间，此时 size 必须大于 0。如果此参数为 false，则使用 linux 调用 dd 以相对较慢速度填充磁盘。              | bool 类型，默认为 true。                                                |
| path     | 指定所写数据的文件路径。如果没有设置此参数，或者设置参数值为空字符串，则会在程序执行目录下创建一个临时文件。根据写入文件的权限不同，会需要用户使用一定的权限运行本程序。 | string 类型，默认为 ""       |  
| percent   | 指定填充多少百分比磁盘。                                             | string 类型，默认为 ""，可以填入 uint 类型的正整数，size 不能和 percent 都为 ""      |
| size      | 指定写入多少数据。    | string 类型，默认为""，合法形式为一个整数加一个单位。例如：1M、512kB。支持的单位有 c=1、w=2、b=512、kB=1000、K=1024、MB=1000\*1000,M=1024\*1024、GB=1000\*1000\*1000、G=1024\*1024\*1024 BYTE 等。size 不能和 percent 都为 "" 。 |

#### 服务模式模拟磁盘填充示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/disk -H "Content-Type:application/json" -d '{"action":"fill","path":"/tmp/test", "fill_by_fallocate":true,"percent":"50"}'
```

输出如下所示：

```bash
{"status":200,"message":"attack successfully","uid":"a551206c-960d-4ac5-9056-518e512d4d0d"}
```

运行以下命令来结束 uid 对应的实验：

```bash
curl -X DELETE 172.16.112.130:31767/api/attack/a551206c-960d-4ac5-9056-518e512d4d0d
```
