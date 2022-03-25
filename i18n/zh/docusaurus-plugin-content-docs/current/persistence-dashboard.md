---
title: 持久化 Chaos Dashboard 数据
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

本文档介绍如何持久化 Chaos Dashboard 数据。

Chaos Dashboard 支持 `SQLite`、`MySQL` 和 `Postgres` 作为后端数据存储。

## SQLite (默认存储)

Chaos Dashboard 默认使用 `SQLite` 作为后端存储，并推荐为 `SQLite` 配置单独的 [`PV(Persistent Volumes)`](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) 。如需要配置 `PV`, 请在安装的时候指定 `dashboard.persistentVolume.enabled` 为 `true` 和设置其他 `PV` 相关的配置，[`value.yaml`](https://github.com/chaos-mesh/chaos-mesh/blob/master/helm/chaos-mesh/values.yaml#L255-L282) 中 `PV` 相关的配置如下：

```yaml
dashboard:
  ...
  persistentVolume:
    # If you are using SQLite as your DB for Chaos Dashboard, it is recommended to enable persistence.
    # If enable, the chart will create a PersistenceVolumeClaim to store its state in. If you are
    # using a DB other than SQLite, set this to false to avoid allocating unused storage.
    # If set to false, Chaos Mesh will use an emptyDir instead, which is ephemeral.
    enabled: true

    # If you'd like to bring your own PVC for persisting chaos event, pass the name of the
    # created + ready PVC here. If set, this Chart will not create the default PVC.
    # Requires server.persistentVolume.enabled: true
    existingClaim: ""

    # Chaos Dashboard data Persistent Volume size.
    size: 8Gi

    # Chaos Dashboard data Persistent Volume Storage Class.
    # If defined, storageClassName: <storageClass>
    storageClassName: standard

    # Chaos Dashboard data Persistent Volume mount root path
    mountPath: /data

    # Subdirectory of Chaos Dashboard data Persistent Volume to mount
    # Useful if the volume's root directory is not empty
    subPath: ""
```

:::warning 注意

如果不配置 PV 的情况下，Chaos Dashboard 发生重启，数据将出现丢失，并且无法找回。

:::

## MySQL

Chaos Dashboard 支持使用 MySQL 5.6 或者更高版本作为后端存储。若想使用 MySQL 作为后端存储，可以在安装的时候设置 `dashboard.env.DATABASE_DRIVER` 和 `dashboard.env.DATABASE_DATASOURCE` 参数，具体参数配置请参考官方驱动[文档(https://github.com/go-sql-driver/mysql#dsn-data-source-name) 。

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.DATABASE_DRIVER=mysql --set dashboard.env.DATABASE_DATASOURCE=root:password@tcp(1.2.3.4:3306)/chaos-mesh?parseTime=true
</PickHelmVersion>

## Postgres

Chaos Dashboard 支持使用 Postgres 9.6 或者更高版本作为后端存储。若想使用 Postgres 作为后端存储，可以在安装的时候设置 `dashboard.env.DATABASE_DRIVER` 和 `dashboard.env.DATABASE_DATASOURCE` 参数, 具体参数配置请参考官方驱动[文档(https://github.com/go-sql-driver/mysql#dsn-data-source-name) 。

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.DATABASE_DRIVER=postgres --set dashboard.env.DATABASE_DATASOURCE=postgres://root:password@1.2.3.4:5432/postgres?sslmode=disable
</PickHelmVersion>

## 配置数据过期时间

Chaos Dashboard 支持配置数据的过期时间，默认 `Event` 相关数据默认 `168h` 过期，`Experiment` 相关数据默认 `336h` 过期，如需要修改，可以设置 `dashboard.env.TTL_EVENT` 和 `dashboard.env.TTL_EXPERIMENT` 参数，如：

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.TTL_EVENT=168h --set dashboard.env.TTL_EXPERIMENT=336h
</PickHelmVersion>
