---
title: Simulate File I/O Faults
---

This document describes how to create IOChaos experiments in Chaos Mesh.

## IOChaos introduction

IOChaos is a type of fault in Chaos Mesh. By creating an IOChaos experiment, you can simulate a scenario of file system fault. Currently, IOChaos supports the following fault types:

- `latency`: delays file system calls
- `fault`: returns an error for filesystem calls
- `attrOverride`: modifies file properties
- `mistake`: makes the file read or write a wrong value

For specific features, refer to [Create experiments using the YAML files](#create-experiments-using-the-yaml-files).

## Notes

1. Before creating an IOChaos experiment, make sure there is no Control Manager of Chaos Mesh running on the target Pod.

2. IOChaos may damage your data. Use IOChaos **with caution** in the production environment.

## Create experiments using Chaos Dashboard

1. Open Chaos Dashboard, and click **NEW EXPERIMENT** on the page to create a new experiment:

   ![Create a New Experiment](./img/create-new-exp.png)

2. In the **Choose a Target** area, choose **FILE SYSTEM INJECTION** and select a specific fault type, such as **LATENCY**.

   ![ioChaos Experiments](./img/iochaos-exp.png)

3. Fill out the experiment information, and specify the experiment scope and the scheduled experiment duration.

   ![Experiment Information](./img/exp-info.png)

4. Submit the experiment information.

## Create experiments using the YAML files

### Latency example

1. Write the experiment configuration to the `io-latency.yaml` file, as shown below:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: IOChaos
metadata:
  name: io-latency-example
  namespace: chaos-testing
spec:
  action: latency
  mode: one
  selector:
    labelSelectors:
      app: etcd
  volumePath: /var/run/etcd
  path: '/var/run/etcd/**/*'
  delay: '100ms'
  percent: 50
  duration: '400s'
```

In this configuration example, Chaos Mesh injects a delay into the directory `/var/run/etcd` and causes latency of 100 milliseconds to all file system operations (including read, writing, list contents, and so on) in this directory.

2. After the configuration file is prepared, use `kubectl` to create an experiment:

```bash
kubectl apply -f ./io-latency.yaml
```

### Fault example

1. Write the experiment configuration to the `io-fault.yaml` file, as shown below:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: IOChaos
metadata:
  name: io-fault-example
  namespace: chaos-testing
spec:
  action: fault
  mode: one
  selector:
    labelSelectors:
      app: etcd
  volumePath: /var/run/etcd
  path: /var/run/etcd/**/*
  errno: 5
  percent: 50
  duration: '400s'
```

In this example, Chaos Mesh injects a file fault into the directory `/var/run/etcd`, which gives a 50% probability of failure in all file system operations under this directory and returns error code 5 (Input/output error).

2. After the configuration file is prepared, use `kubectl` to create an experiment:

```bash
kubectl apply -f ./io-fault.yaml
```

### attrOverride example

1. Write the experiment configuration to the `io-attr.yaml` file:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: IOChaos
metadata:
  name: io-attr-example
  namespace: chaos-testing
spec:
  action: attrOverride
  mode: one
  selector:
    labelSelectors:
      app: etcd
  volumePath: /var/run/etcd
  path: /var/run/etcd/**/*
  attr:
    perm: 72
  percent: 10
  duration: '400s'
```

In this configuration example, Chaos Mesh injects `/var/run/etcd` directories `attrOverride` fault, giving a 10% probability that all file system operations in this directory will change the target file permissions to 72 (110 in octal), which will allow files to be executed only by the owner and their group and not authorized to perform other actions.

2. After the configuration file is prepared, use `kubectl` to create an experiment:

```bash
kubectl apply -f ./io-attr.yaml
```

### Mistake example

1. Write the experiment configuration to the `io-mistake.yaml` file:

```yaml
apiVersion: chaos-mesh. rg/v1alpha1
ind: IOChaos
metadata:
  name: io-mistake-example
  namespace: chaos-testing
special:
  action: mistake
  mode: one
  selector:
    labelSelectors:
      app: etcd
  volumePath: /var/run/etcd
  path: /var/run/etcd/**/*
  mistake:
    filling: zero
    maxOccurrences: 1
    maxLength: 10
  methods:
    - READ
    - WRITE
  percent: 10
  duration: '400s'
```

In this configuration example, Chaos Mesh injects read and write faults into the directory `/var/run/etcd`, which gives a 10% probability of failure in the read and write operations under this directory. During this process, one random position with a maximum length of 10 bytes will be replaced with 0 bytes.

2. After the configuration file is prepared, use `kubectl` to create an experiment:

```bash
kubectl apply -f ./io-mistake.yaml
```

### Field description

#### General fields

| Parameter     | Type     | Description                                                                                                                                                                                                                                                                                                                                                | Default value                  | Required | Example             |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------- | ------------------- |
| action        | string   | Indicates the specific type of faults. Only latency, fault, attrOverride, and mistake are supported.                                                                                                                                                                                                                                                       |                                | Yes      | latency             |
| mode          | string   | Specifies the mode of the experiment. The mode options include `one` (selecting a Pod at random), `all` (selecting all eligible Pods), `fixed` (selecting a specified number of eligible Pods), `fixed-percent` (selecting a specified percentage of the eligible Pods), and `random-max-percent` (selecting the maximum percentage of the eligible Pods). | None                           | Yes      | 1                   |
| selector      | struct   | Specifies the target Pod. For details, refer to [Define the experiment scope](./define-chaos-experiment-scope.md).                                                                                                                                                                                                                                         | None                           | Yes      |                     |
| value         | string   | Provides parameters for the `mode` configuration, depending on `mode`. For example, when `mode` is set to `fixed-percent`, `value` specifies the percentage of Pods.                                                                                                                                                                                       |                                | No       | 2                   |
| volumePath    | string   | The mount point of volume in the target container. Must be the root directory of the mount.                                                                                                                                                                                                                                                                |                                | Yes      | /var/run/etcd       |
| path          | string   | The valid range of fault injections, either a wildcard or a single file.                                                                                                                                                                                                                                                                                   | Valid for all files by default | No       | /var/run/etcd/\*_/_ |
| methods       | string[] | Type of the file system call that requires injecting fault. For more information about supported types, refer to [Appendix A](#appendix-a: methods-type).                                                                                                                                                                                                  | All Types                      | No       | READ                |
| percent       | int      | Probability of failure per operation, in %.                                                                                                                                                                                                                                                                                                                | 100                            | No       | 100                 |
| ContainerName | string   | Specifies the name of the container into which the fault is injected.                                                                                                                                                                                                                                                                                      |                                | No       |                     |
| duration      | string   | Specifies the duration of the experiment.                                                                                                                                                                                                                                                                                                                  |                                | Yes      | 30s                 |

#### Fields related to action

The following are specific information about fields corresponding to action:

- latency

  | Parameter | Type   | Description         | Default value | Required | Example |
  | --------- | ------ | ------------------- | ------------- | -------- | ------- |
  | delay     | string | Specific delay time |               | Yes      | 100 ms  |

- fault

  | Parameter | Type | Description           | Default value | Required | Example |
  | --------- | ---- | --------------------- | ------------- | -------- | ------- |
  | errno     | int  | returned error number |               | Yes      | 22      |

  For common error numbers, see [Appendix B](#appendix-b:common-error-numbers).

- attrOverride

  | Parameter | Type             | Description                      | Default value | Required | Example    |
  | --------- | ---------------- | -------------------------------- | ------------- | -------- | ---------- |
  | attr      | AttrOverrideSpec | Specific property override rules |               | Yes      | As follows |

  AttrOverrideSpec is defined as follows:

  | Parameter | Type     | Description                                                                            | Default value | Required | Example           |
  | --------- | -------- | -------------------------------------------------------------------------------------- | ------------- | -------- | ----------------- |
  | ino       | int      | ino number                                                                             |               | No       |                   |
  | size      | int      | File size                                                                              |               | No       |                   |
  | blocks    | int      | Number of blocks that the file uses                                                    |               | No       |                   |
  | atime     | TimeSpec | Last access time                                                                       |               | No       |                   |
  | mtime     | TimeSpec | Last modified time                                                                     |               | No       |                   |
  | ctime     | TimeSpec | Last status change time                                                                |               | No       |                   |
  | kind      | string   | File type, see [fuser::FileType](https://docs.rs/fuser/0.7.0/fuser/enum.FileType.html) |               | No       |                   |
  | perm      | int      | File permissions in decimal                                                            |               | No       | 72 (110 in octal) |
  | nlink     | int      | Number of hard links                                                                   |               | No       |                   |
  | uid       | int      | User ID of the owner                                                                   |               | No       |                   |
  | gid       | int      | Group ID of the owner                                                                  |               | No       |                   |
  | rdev      | int      | Device ID                                                                              |               | No       |                   |

  TimeSpec is defined as follows:

  | Parameter | Type | Description              | Default value | Required | Example |
  | --------- | ---- | ------------------------ | ------------- | -------- | ------- |
  | sec       | int  | timestamp in seconds     |               | No       |         |
  | nsec      | int  | Timestamp in nanoseconds |               | No       |         |

  For the specific meaning of parameters, you can refer to [man stat](https://man7.org/linux/man-pages/man2/lstat.2.html).

- mistake

  | Parameter | Type        | Description          | Default value | Required | Example |
  | --------- | ----------- | -------------------- | ------------- | -------- | ------- |
  | mistake   | MistakeSpec | Specific error rules |               | Yes      |         |

  MistakeSpec is defined as follows:

  | Parameter      | Type   | Description                                                                                  | Default value | Required | Example |
  | -------------- | ------ | -------------------------------------------------------------------------------------------- | ------------- | -------- | ------- |
  | filling        | string | The wrong data to be filled. Only zero (fill 0) or random (fill random bytes) are supported. |               | Yes      |         |
  | maxOccurrences | int    | Maximum number of errors in each operation.                                                  |               | Yes      | 1       |
  | maxLength      | int    | Maximum length of each error (in bytes).                                                     |               | Yes      | 1       |

::warning It is suggested that you only use mistake on READ and WRITE file system calls. Using mistake on other file system calls may lead to unexpected consequences, including but not limited to file system damage and program crashes. :::

## Local debugging

If you are not sure about the effect of a certain Chaos, you can use [toda](https://github.com/chaos-mesh/toda) to test the feature locally. Chaos Mesh also uses toda to implement IOChaos.

## Appendix A: methods type

- lookup
- forget
- getattr
- setattr
- readlink
- mknod
- mkdir
- unlink
- rmdir
- symlink
- rename
- link
- open
- read
- write
- flush
- release
- fsync
- opendir
- readdir
- releasedir
- fsyncdir
- statfs
- setxattr
- getxattr
- listxattr
- removexatr
- access
- create
- getlk
- setlk
- bmap

For more information, refer to [fuser::Filesystem](https://docs.rs/fuser/0.7.0/fuser/trait.Filesystem.html).

## Appendix B: Common Error Numbers

- 1: Operation not permitted
- 2: No such file or directory
- 5: I/O error
- 6: No such device or address
- 12: Out of memory
- 16: Device or resource busy
- 17: File exists
- 20: Not a directory
- 22: Invalid argument
- 24: Too many open files
- 28: No space left on device

For more information, refer to [Linux source code](https://raw.githubusercontent.com/torvalds/linux/master/include/uapi/asm-generic/errno-base.h).
