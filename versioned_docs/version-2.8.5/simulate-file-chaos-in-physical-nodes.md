---
title: Simulate File Faults
---

This document describes how to use Chaosd to simulate file faults, including creating files, appending data to files, deleting files, modifying file permissions, renaming files, and replacing file data.

## Create experiments using command-line mode

This section describes how to create file fault experiments using command-line mode.

Before creating a file fault experiment, you can run the following command to check the file fault types supported by Chaosd:

```bash
chaosd attack file -h
```

The output is as follows:

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

### Append data to a file using the command-line mode

This function appends data to the end of a file.

#### Command for appending data

The command is as follows:

```bash
chaosd attack file append -h
```

The output is as follows:

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

#### Configuration description for appending data

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| `count` | c | The number of times to write the data | int, default `1` |
| `data` | d | The data to be written to the file | string, such as `"test"`, required |
| `file-name` | f | The path of the file to which the data is written | string, such as `"/tmp/test.txt"`, required |

#### Example for appending data using the command-line mode

```bash
chaosd attack file append --count 2 --data "test" --file-name /tmp/test.txt
```

### Create a file using the command-line mode

This function creates a new file or directory.

#### Command for creating a file

The command is as follows:

```bash
chaosd attack file create -h
```

The output is as follows:

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

#### Configuration description for creating a file

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| `dir-name` | d | The name of the directory to be created | string, such as `"/tmp/test"`. You must set either `dir-name` or `file-name`. |
| `file-name` | f | The name of the file to be created | string, such as `"/tmp/test.txt"`. You must set either `dir-name` or `file-name`. |

#### Example for creating a file using the command-line mode

```bash
chaosd attack file create --file-name "/tmp/test.txt"
```

### Delete a file using the command-line mode

This function deletes a file or directory.

#### Command for deleting a file

The command is as follows:

```bash
chaosd attack file delete -h
```

The output is as follows:

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

#### Configuration description for deleting a file

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| `dir-name` | d | The name of the directory to be deleted | string, such as `"/tmp/test"`. You must set either `dir-name` or `file-name`. |
| `file-name` | f | The name of the file to be deleted | string, such as `"/tmp/test.txt"`. You must set either `dir-name` or `file-name`. |

#### Example for deleting a file using the command-line mode

```bash
chaosd attack file delete --file-name "/tmp/test.txt"
```

### Modify file permissions using the command-line mode

This function modifies the permissions of a file.

#### Command for modifying file permissions

The command is as follows:

```bash
chaosd attack file modify -h
```

The output is as follows:

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

#### Configuration description for modifying file permissions

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| `file-name` | f | The name of the file whose permissions are to be modified | string, such as `"/tmp/test.txt"`, required |
| `privilege` | p | The new file permissions | uint32, such as `777`, required |

#### Example for modifying file permissions using the command-line mode

```bash
chaosd attack file modify --file-name /tmp/test.txt --privilege 777
```

### Rename a file using the command-line mode

This function renames a file.

#### Command for renaming a file

The command is as follows:

```bash
chaosd attack file rename -h
```

The output is as follows:

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

#### Configuration description for renaming a file

| Configuration item | Abbreviation | Description               | Value                                        |
| :----------------- | :----------- | :------------------------ | :------------------------------------------- |
| `dest-file`        | d            | The destination file name | string, such as `"/tmp/test2.txt"`, required |
| `source-file`      | s            | The source file name      | string, such as `"/tmp/test.txt"`, required  |

#### Example for renaming a file using the command-line mode

```bash
chaosd attack file rename --source-file /tmp/test.txt --dest-file /tmp/test2.txt
```

### Replace file data using the command-line mode

This function replaces data in a file.

#### Command for replacing file data

The command is as follows:

```bash
chaosd attack file replace -h
```

The output is as follows:

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

#### Configuration description for replacing file data

| Configuration item | Abbreviation | Description | Value |
| :-- | :-- | :-- | :-- |
| `dest-string` | d | The value to replace the content in the file with | string, such as `"text"`, required |
| `file-name` | f | The name of the file whose content is to be replaced | string, such as `"/tmp/test.txt"`, required |
| `line` | l | The line of the file to replace | int, default `0`, which means replacing the data in all lines that match `origin-string` |
| `origin-string` | o | The data in the file to be replaced | string, such as `"test"`, required |

#### Example for replacing file data using the command-line mode

```bash
chaosd attack file replace --origin-string test --dest-string text --file-name /tmp/test.txt --line 1
```
