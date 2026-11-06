---
title: Simulate Host Faults
---

This document introduces how to simulate host shutdown faults using Chaosd.

## View the help information of host shutdown experiments

Before creating a fault experiment, you can run the following command to view the help information of host shutdown experiments:

```bash
chaosd attack host shutdown -h
```

## Create a host shutdown experiment

To create a host shutdown experiment, run the following command:

```bash
chaosd attack host shutdown
```

After executing this command, your host will shut down after all processes are closed.
