---
title: 升级至 Chaos Mesh 2.0
---

:::warning 警告

我们不再上传迁移文件，因为 Chaos Mesh 2.0 已经发布了很长时间，且这些文件已经很久没有修改过了。

:::

本文介绍从 Chaos Mesh 1.x 升级至 2.0 的详细步骤。Chaos Mesh 2.0 引入了一些新功能，并修复了许多问题。Chaos Mesh 2.0 重构了一部分代码，因此需要做一些额外的操作从 Chaos Mesh 1.x 升级到 2.0。

## 升级工具

CRD 在 Chaos Mesh 2.0 中发生了变化，旧版本实验的 YAML 文件无法在 Chaos Mesh 2.0 上运行。如果希望继续使用旧版本实验的 YAML 文件，则需要导出并升级这些文件，并在 Chaos Mesh 升级后重新导入。

为了简化升级过程，Chaos Mesh 2.0 提供了以下升级工具：

- `migrate.sh`：用于自动导出并升级实验 YAML 文件、升级 CRD、导入升级后的 YAML 文件。
- `schedule-migration`：用于将指定的旧版 YAML 文件更新为新版 YAML 文件。

要获取升级工具，建议将 Chaos Mesh 项目克隆至本地执行 `make schedule-migration.tar.gz`，或是从 https://mirrors.chaos-mesh.org/v2.0.0/schedule-migration.tar.gz 下载。使用以下命令将其解压，即可得到上述两个工具：

```bash
tar xvf ./schedule-migration.tar.gz
```

该压缩包打包的 `schedule-migration` 工具仅适用于 Linux x86_64 平台，其他操作系统 / 架构的用户需要自行编译。

## 第 1 步：导出并升级实验

你可以使用升级工具 `migrate.sh` 自动导出并升级实验。在运行之前，请确保当前用户有足够的权限访问集群。

假设 `migrate.sh` 位于当前目录下，并且 `schedule-migration` 工具也置于该目录下，请执行以下命令导出并升级实验：

```bash
bash migrate.sh -e
```

在当前目录下生成了许多 YAML 文件，这些就是被导出的实验文件。导出的实验文件已经被自动升级。

此外，你也可以使用 `schedule-migration` 工具只升级指定的旧版 YAML 文件，请运行以下命令：

```bash
./schedule-migration <path-to-old-yaml> <path-to-new-yaml>
```

在你指定的 YAML 文件路径，就可以获取升级后的新版 YAML 文件。在删除旧资源后重新应用新 YAML 文件即可完成更新。

## 第 2 步：升级 CRD

当使用 Helm 升级 Chaos Mesh 前，为了能最大程度保证升级成功，请运行以下命令手动升级 CRD：

```bash
bash migrate.sh -c
```

即可看到 CRD 被删除后重新添加。

## 第 3 步：升级 Chaos Mesh

由于 2.0 的改动较大，推荐在卸载 1.x 后重新进行安装。具体安装步骤，请参考[使用 Helm 安装（生产推荐）](production-installation-using-helm.md)。

## 第 4 步：导入实验

Chaos Mesh 2.0 对实验定义进行了一些修改，需要升级旧版实验文件后才能继续使用。

在导出的实验文件的同一目录下，请运行以下命令导入实验：

```bash
bash migrate.sh -i
```

## 问题反馈

如果在升级过程中遇到任何问题，请将命令行输出提交至 [slack](https://cloud-native.slack.com/archives/C0193VAV272) 或在 Github 上新建一个 [issue](https://github.com/pingcap/chaos-mesh/issues)。感谢你的反馈，Chaos Mesh 团队很乐意帮助解决。
