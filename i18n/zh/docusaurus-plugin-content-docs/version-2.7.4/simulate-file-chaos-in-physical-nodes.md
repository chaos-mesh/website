---
title: 模拟文件故障
---

本文主要介绍如何使用 Chaosd 模拟文件故障场景，包括创建文件、向文件追加数据、删除文件、修改文件权限、重命名文件以及替换文件数据等。

## 使用命令行模式创建实验

本节介绍如何在命令行模式中创建文件故障实验。

在创建文件故障实验前，可运行以下命令行查看 Chaosd 支持的文件故障类型：

```bash
chaosd attack file -h
```

### 使用命令行模式向文件追加数据

通过该功能以追加的方式将数据写到文件的末尾。

#### 追加数据命令

具体命令如下所示：

```bash
chaosd attack file append -h
```

#### 追加数据相关配置说明

| 配置项      | 配置缩写 | 说明                 | 值                                         |
| :---------- | :------- | :------------------- | :----------------------------------------- |
| `count`     | c        | 写数据的次数         | int，默认值为 `1`                          |
| `data`      | d        | 要写入文件的数据     | string，例如 `"test"`，必须要设置          |
| `file-name` | f        | 要写入数据的文件路径 | string，例如 `"/tmp/test.txt"`，必须要设置 |

#### 使用命令行模式向文件追加数据示例

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

#### 创建文件相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `dir-name` | d | 创建的目录名称 | string，例如 `"/tmp/test"`，`dir-name` 和 `file-name` 必须要设置其中一个 |
| `file-name` | f | 创建的文件名称 | string，例如 `"/tmp/test.txt"`，`dir-name` 和 `file-name` 必须要设置其中一个 |

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

#### 删除文件相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `dir-name` | d | 删除的目录名称 | string，例如 `"/tmp/test"`，`dir-name` 和 `file-name` 必须要设置其中一个 |
| `file-name` | f | 删除的文件名称 | string，例如 `"/tmp/test.txt"`，`dir-name` 和 `file-name` 必须要设置其中一个 |

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

#### 修改文件权限相关配置说明

| 配置项      | 配置缩写 | 说明                 | 值                                         |
| :---------- | :------- | :------------------- | :----------------------------------------- |
| `file-name` | f        | 要修改权限的文件名称 | string，例如 `"/tmp/test.txt"`，必须要设置 |
| `privilege` | p        | 将文件权限修改为该值 | uint32，例如 `777`，必须要设置             |

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

#### 重命名文件相关配置说明

| 配置项        | 配置缩写 | 说明         | 值                                          |
| :------------ | :------- | :----------- | :------------------------------------------ |
| `dest-file`   | d        | 目标文件名称 | string，例如 `"/tmp/test2.txt"`，必须要设置 |
| `source-file` | s        | 源文件名称   | string，例如 `"/tmp/test.txt"`，必须要设置  |

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

#### 替换文件内容相关配置说明

| 配置项 | 配置缩写 | 说明 | 值 |
| :-- | :-- | :-- | :-- |
| `dest-string` | d | 将文件中的内容替换为该值 | string，例如 `"text"`，必须要设置 |
| `file-name` | f | 要替换内容的文件名称 | string，例如 `"/tmp/test.txt"`，必须要设置 |
| `line` | l | 替换文件中哪一行的数据 | int，默认为 `0`，表示替换所有能匹配到 `origin-string` 的行的数据 |
| `origin-string` | o | 文件中要替换的数据 | string，例如 `"test"`，必须要设置 |

#### 使用命令行模式替换文件内容示例

```bash
chaosd attack file replace --origin-string test --dest-string text --file-name /tmp/test.txt --line 1
```
