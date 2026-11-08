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

### Append data to a file using the command-line mode

This function appends data to the end of a file.

#### Command for appending data

The command is as follows:

```bash
chaosd attack file append -h
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

## Create a file fault using the HTTP service

:::info

The file HTTP endpoint is available starting with **Chaosd v1.6.0**. Chaosd v1.5.0 supports file faults through the CLI only.

:::

Start Chaosd on the host that contains the target file:

```bash
chaosd server --host 127.0.0.1 --port 31767
```

Use an existing file that Chaosd has permission to modify. The following request changes the permissions of `/tmp/test.txt` to `600`:

```bash
curl -X POST 'http://127.0.0.1:31767/api/attack/file' \
  -H 'Content-Type: application/json' \
  -d '{"action":"modify","file-name":"/tmp/test.txt","privilege":600}'
```

`file-name` is the path on the Chaosd host. `privilege` is a JSON number containing permission digits without a leading zero, such as `600` or `644`. You do not need to specify `kind`.

Save the UID returned by the request. To restore the previous permissions, replace `<UID>` with that UID and send a recovery request:

```bash
curl -X DELETE 'http://127.0.0.1:31767/api/attack/<UID>'
```

For other recovery limits, see [Search and recover experiments](chaosd-search-recover.md).
