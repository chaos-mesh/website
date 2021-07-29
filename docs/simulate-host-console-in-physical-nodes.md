---
title: Simulate Host Faults
sidebar_label: Simulate Host Faults
---

This document introduces how to simulate host shutdown faults using Chaosd.

## View the help information of host shutdown experiments

Before creating a fault experiment, you can run the following command to view the help information of host shutdown experiments:

```bash
chaosd attack host shutdown -h
```

The output is as follows:

```bash
shutdowns system, this action will trigger shutdown of the host machine

Usage:
  chaosd attack host shutdown [flags]

Flags:
  -h, --help   help for shutdown

Global Flags:
      --log-level string   the log level of chaosd, the value can be 'debug', 'info', 'warn' and 'error'
```

## Create a host shutdown experiment

To create a host shutdown experiment, run the following command:

```bash
chaosd attack host shutdown
```

The example output is as follows:

```bash
chaosd attack host shutdown
Shutdown successfully, uid: 4bc9b74a-5fe2-4038-b4f3-09ae95b57694
```

After executing this command, your host will shut down after all processes are closed.
