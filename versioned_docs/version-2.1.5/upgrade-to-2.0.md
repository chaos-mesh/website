---
title: Upgrade to Chaos Mesh 2.0
---

This document provides detailed instruction for upgrading Chaos Mesh from 1.x to 2.0. Chaos Mesh 2.0 introduced some new features and fixed many issues. Because in Chaos Mesh 2.0, some code has been rebuilt, you need to perform extra actions for the upgrade.

## Upgrade tools

Because CRD has changed in Chaos Mesh 2.0, the YAML files for experiments from an earlier version of Chaos Mesh cannot be run on Chaos Mesh 2.0. If you want to continue using these YAML files, you need to export and update the YAML files and re-import them after upgrading Chaos Mesh.

To simplify the upgrade process, Chaos Mesh 2.0 provides the following upgrade tools:

- `migrate.sh`: used to automatically export and upgrade the YAML files, upgrade CRD, import upgraded YAML files.
- `schedule-migration`: used to update the earlier YAML files to the latest YAML files.

To get the upgrade tools, it is recommended to clone the Chaos Mesh project to your local repository and then execute the command `make schedule-migration.tar.gz`. Or you can download the project from [https://mirrors.chaos-mesh.org/v2.0.0/schedule-migration.tar.gz](https://mirrors.chaos-mesh.org/v2.0.0/schedule-migration.tar.gz). After the `tar.gz` package is downloaded, execute the following command and you can get the above two upgrade tools:

```bash
tar xvf ./schedule-migration.tar.gz
```

The `schedule-migration` tool in this package applies only to the Linux x86_64 platform. If you are using other operating systems or architectures, you need to compile the code by yourselves.

## Step 1: Export and upgrade an experiment

You can use the upgrade tool `migrate.sh` to automatically export and upgrade the experiment. Before running, make sure you have enough permissions to access the cluster.

If `migrate.sh` is in the current directory, place the `schedule-migration` tool in this directory. Then execute the following command to export and upgrade the experiment:

```bash
bash migrate.sh -e
```

Then many YAML files are generated in the current directory. These are the exported files of the experiments. The exported experiment files are automatically upgraded.

In addition, you can use the `schedule-migration` tool to upgrade the specified old version of YAML files:

```bash
./schedule-migration <path-to-old-yaml> <path-to-new-yaml>
```

In the YAML file path you have specified, you can get upgraded YAML files. After deleting the old resources, reapply the new YAML files to complete the update process.

## Step 2: Upgrade CRD

Before upgrading Chaos Mesh using Helm, to increase the success rate of the upgrade, execute the following command to manually upgrade CRD:

```bash
bash migrate.sh -c
```

You can see that CRD is deleted and re-added.

## Step 3: Upgrade Chaos Mesh

Because Chaos Mesh 2.0 contains many changes made from 1.x, it is recommended to uninstall 1.x first and then install 2.0. For specific installation steps, refer to [Install using Helm (production environment recommended)](production-installation-using-helm.md).

## Step 4: Import an experiment

Chaos Mesh 2.0 has made some changes on the experiment definition. Before you continue using it, you need to upgrade the experiment files of an earlier version.

In the same directory of exported experiment files, execute the following command to import the experiment:

```bash
bash migrate.sh -i
```

## Report issues

If you encounter any problems in the upgrade process, submit the output of your command to [slack](https://cloud-native.slack.com/archives/C0193VAV272) or create an [issue](https://github.com/pingcap/chaos-mesh/issues) on Github. Thanks for your feedback, and the Chaos Mesh team is happy to resolve your problems.
