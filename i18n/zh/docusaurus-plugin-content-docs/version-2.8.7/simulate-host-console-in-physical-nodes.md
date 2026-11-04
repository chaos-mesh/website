---
title: 模拟主机故障
---

本文介绍如何使用 Chaosd 模拟主机关机故障。

## 查看主机关机实验的帮助信息

在创建故障实验前，可运行以下命令查看主机关机实验的帮助信息：

```bash
chaosd attack host shutdown -h
```

## 创建主机关机实验

要创建主机关机实验，运行以下命令：

```bash
chaosd attack host shutdown
```

输出示例如下：

```bash
chaosd attack host shutdown
Shutdown successfully, uid: 4bc9b74a-5fe2-4038-b4f3-09ae95b57694
```

执行该命令后，你的主机将在所有进程关闭后关机。
