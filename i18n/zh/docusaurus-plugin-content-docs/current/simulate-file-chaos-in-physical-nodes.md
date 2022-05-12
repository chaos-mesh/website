---
title: 模拟文件故障
---

本文主要介绍如何使用 Chaosd 模拟文件故障场景，包括新增文件、写文件、删除文件、修改文件权限、重命名文件、替换文件数据等。

## 使用命令行模式创建实验

本节介绍如何在命令行模式中创建文件故障实验。

在创建文件故障实验前，可运行以下命令行查看 Chaosd 支持的文件故障类型：

```bash
chaosd attack file -h
```

输出结果如下所示：

```bash
File attack related commands

Usage:
  chaosd attack file [command]

Available Commands:
  append      append file
  create      create file
  delete      delete file
  modify      modify file privilege
  rename      rename file
  replace     replace data in file

Flags:
  -h, --help   help for file

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID

Use "chaosd attack file [command] --help" for more information about a command.
```

### 使用命令行模式写文件

通过该功能以追加的方式将数据写到文件的末尾。

#### 写文件命令

具体命令如下所示：

```bash
chaosd attack file append -h
```

输出结果如下所示：

```bash
append file

Usage:
  chaosd attack file append [flags]

Flags:
  -c, --count int          append count with default value is 1 (default 1)
  -d, --data string        append data
  -f, --file-name string   append data to the file
  -h, --help               help for append

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### 写文件相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `count` | c | 写数据的次数 | Int，默认值为 1 |
| `data` | d | 要写入文件的数据 | String，例如 "test"，必须要设置 |
| `file-name` | f | 要写入数据的文件路径 | String，例如 "/tmp/test.txt"，必须要设置 |

#### 使用命令行模式写文件示例

```bash
chaosd attack file append --count 2 --data "test" --file-name /tmp/test.txt
```

### 使用命令行模式创建文件

通过该功能可以创建新的文件或者目录。

#### 创建文件命令

具体命令如下所示：

```bash
chaosd attack file create -h
```

输出结果如下所示：

```bash
create file

Usage:
  chaosd attack file create [flags]

Flags:
  -d, --dir-name string    the name of directory to be created
  -f, --file-name string   the name of file to be created
  -h, --help               help for create

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### 创建文件相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `dir-name` | d | 创建的目录名称 | String，例如 "/tmp/test"，`dir-name` 和 `file-name` 必须要设置其中一个 |
| `file-name` | f | 创建的文件名称 | String，例如 "/tmp/test.txt"，`dir-name` 和 `file-name` 必须要设置其中一个 |

#### 使用命令行模式创建文件示例

```bash
chaosd attack file create --file-name "/tmp/test.txt"
```

### 使用命令行模式删除文件

使用该功能删除文件或者目录。

#### 删除文件命令

具体命令如下所示：

```bash
chaosd attack file delete -h
```

输出结果如下所示：

```bash
delete file

Usage:
  chaosd attack file delete [flags]

Flags:
  -d, --dir-name string    the directory to be deleted
  -f, --file-name string   the file to be deleted
  -h, --help               help for delete

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### 删除文件相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `dir-name` | d | 删除的目录名称 | String，例如 "/tmp/test"，`dir-name` 和 `file-name` 必须要设置其中一个 |
| `file-name` | f | 删除的文件名称 | String，例如 "/tmp/test.txt"，`dir-name` 和 `file-name` 必须要设置其中一个 |

#### 使用命令行模式删除文件示例

```bash
chaosd attack file delete --file-name "/tmp/test.txt"
```

### 使用命令行模式修改文件权限

使用该功能修改文件的权限。

#### 修改文件权限命令

具体命令如下所示：

```bash
chaosd attack file modify -h
```

输出结果如下所示：

```bash
modify file privilege

Usage:
  chaosd attack file modify [flags]

Flags:
  -f, --file-name string   file to be change privilege
  -h, --help               help for modify
  -p, --privilege uint32   privilege to be update

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### 修改文件权限相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `file-name` | f | 要修改权限的文件名称 | String，例如 "/tmp/test.txt"，必须要设置 |
| `privilege` | p | 将文件权限修改为该值 | Int，例如 777，必须要设置 |

#### 使用命令行模式修改文件权限示例

```bash
chaosd attack file modify --file-name /tmp/test.txt --privilege 777
```

### 使用命令行模式重命名文件

使用该功能重命名文件。

#### 重命名文件命令

具体命令如下所示：

```bash
chaosd attack file rename -h
```

输出结果如下所示：

```bash
rename file

Usage:
  chaosd attack file rename [flags]

Flags:
  -d, --dest-file string     the destination file/dir of rename
  -h, --help                 help for rename
  -s, --source-file string   the source file/dir of rename

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### 重命名文件相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `dest-file` | d | 将文件重命名为该值 | String，例如 "/tmp/test2.txt"，必须要设置 |
| `source-file` | s | 要重命名的文件名称 | String，例如 "/tmp/test.txt"，必须要设置 |

#### 使用命令行模式重命名文件示例

```bash
chaosd attack file rename --source-file /tmp/test.txt --dest-file /tmp/test2.txt
```

### 使用命令行模式替换文件内容

使用该功能替换文件中的内容。

#### 替换文件内容命令

具体命令如下所示：

```bash
chaosd attack file replace -h
```

输出结果如下所示：

```bash
replace data in file

Usage:
  chaosd attack file replace [flags]

Flags:
  -d, --dest-string string     the destination string to replace the origin string
  -f, --file-name string       replace data in the file
  -h, --help                   help for replace
  -l, --line int               the line number to replace, default is 0, means replace all lines
  -o, --origin-string string   the origin string to be replaced

Global Flags:
      --log-level string   the log level of chaosd. The value can be 'debug', 'info', 'warn' and 'error'
      --uid string         the experiment ID
```

#### 替换文件内容相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `dest-string` | d | 将文件中的内容替换为该值 | String，例如 "text"，必须要设置 |
| `file-name` | f | 要替换内容的文件名称 | String，例如 "/tmp/test.txt"，必须要设置 |
| `line` | l | 替换文件中哪一行的数据 | Int，默认为 0，表示替换所有能匹配到 `origin-string` 的行的数据 |
| `origin-string` | o | 文件中要替换的数据 | String，例如 "test"，必须要设置 |

#### 使用命令行模式替换文件内容示例

```bash
./bin/chaosd attack file replace --origin-string test --dest-string text --file-name /tmp/test.txt --line 1
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

### 使用服务模式写文件

通过该功能以追加的方式将数据写到文件的末尾。

#### 写文件相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 `"append"` |
| `count` | 写数据的次数 | Int，默认值为 1 |
| `data` | 要写入文件的数据 | String，例如 "test"，必须要设置 |
| `file-name` | 要写入数据的文件路径 | String，例如 "/tmp/test.txt"，必须要设置 |

#### 使用服务模式写文件示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/file -H "Content-Type:application/json" -d '{"action":"append","file-name":"/tmp/test.txt","data":"test","count":2}'
```

### 使用服务模式创建文件

通过该功能可以创建新的文件或者目录。

#### 创建文件相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 `"create"` |
| `dir-name` | 创建的目录名称 | String，例如 "/tmp/test"，`dir-name` 和 `file-name` 必须要设置其中一个 |
| `file-name` | 创建的文件名称 | String，例如 "/tmp/test.txt"，`dir-name` 和 `file-name` 必须要设置其中一个 |

#### 使用服务模式创建文件示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/file -H "Content-Type:application/json" -d '{"action":"create","file-name":"/tmp/test.txt"}'
```

### 使用服务模式删除文件

使用该功能删除文件或者目录。

#### 删除文件相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 `"delete"` |
| `dir-name` | 删除的目录名称 | String，例如 "/tmp/test"，`dir-name` 和 `file-name` 必须要设置其中一个 |
| `file-name` | 删除的文件名称 | String，例如 "/tmp/test.txt"，`dir-name` 和 `file-name` 必须要设置其中一个 |

#### 使用服务模式删除文件示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/file -H "Content-Type:application/json" -d '{"action":"delete","file-name":"/tmp/test.txt"}'
```

### 使用服务模式修改文件权限

使用该功能修改文件的权限。

#### 修改文件权限相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 `"modify"` |
| `file-name` | 要修改权限的文件名称 | String，例如 "/tmp/test.txt"，必须要设置 |
| `privilege` | 将文件权限修改为该值 | Int，例如 777，必须要设置 |

#### 使用服务模式修改文件权限示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/file -H "Content-Type:application/json" -d '{"action":"modify","file-name":"/tmp/test.txt","privilege":777}'
```

### 使用服务模式重命名文件

使用该功能重命名文件。

#### 重命名文件相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 `"rename"` |
| `dest-file` | 将文件重命名为该值 | String，例如 "/tmp/test2.txt"，必须要设置 |
| `source-file` | 要重命名的文件名称 | String，例如 "/tmp/test.txt"，必须要设置 |

#### 使用服务模式重命名文件示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/file -H "Content-Type:application/json" -d '{"action":"rename","source-file":"/tmp/test.txt","dest-file":"/tmp/test2.txt"}'
```

### 使用服务模式替换文件内容

使用该功能替换文件中的内容。

#### 替换文件内容相关参数说明

| 参数 | 说明 | 值 |
| :-- | :-- | :-- |
| `action` | 实验的行为 | 设置为 `"replace"` |
| `dest-string` | 将文件中的内容替换为该值 | String，例如 "text"，必须要设置 |
| `file-name` | 要替换内容的文件名称 | String，例如 "/tmp/test.txt"，必须要设置 |
| `line` | 替换文件中哪一行的数据 | Int，默认为 0，表示替换所有能匹配到 `origin-string` 的行的数据 |
| `origin-string` | 文件中要替换的数据 | String，例如 "test"，必须要设置 |

#### 使用服务模式替换文件内容示例

```bash
curl -X POST 172.16.112.130:31767/api/attack/file -H "Content-Type:application/json" -d '{"action":"replace","origin-string":"test","dest-string":"text","file-name":"/tmp/test.txt","line":1}'
```
