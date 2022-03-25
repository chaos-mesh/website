---
title: Persistence Chaos Dashboard
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

This document describes how to persistence Chaos Dashboard.

Chaos Dashboard support `SQLite`, `MySQL` and `Postgres` as database backend for persistence.

## SQLite (Default Database Engine)

Chaos Dashboard uses `SQLite` as the default database engine, and it is recommended to enable [`PV(Persistent Volumes)`](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). To enable PV, specify `dashboard.persistentVolume.enabled` to `true`. You can find the related configurations on [`value.yaml`](https://github.com/chaos-mesh/chaos-mesh/blob/release-2.1/helm/chaos-mesh/values.yaml#L251-L279) as flower:

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

:::warning

If Chaos Dashboard component restarts without `PV`, the data of Chaos Dashboard will be list and can't be retrieved.

:::

## MySQL

Chaos Dashboard supports MySQL 5.6 and higher as the database engine. The below example demonstrates MySQL database configuration. Please reference the official driver [documentation](https://github.com/go-sql-driver/mysql#dsn-data-source-name) for connection string configuration details.

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.DATABASE_DRIVER=mysql --set dashboard.env.DATABASE_DATASOURCE=root:password@tcp(1.2.3.4:3306)/chaos-mesh?parseTime=true
</PickHelmVersion>

## Postgres

Chaos Dashboard supports Postgres 9.6 and higher as the database engine. The below example demonstrates Postgres database configuration. Please reference the official driver [documentation](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-CONNSTRING) for connection string configuration details.

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.DATABASE_DRIVER=postgres --set dashboard.env.DATABASE_DATASOURCE=postgres://root:password@1.2.3.4:5432/postgres?sslmode=disable
</PickHelmVersion>

## Set TTL(Time To Live) for Chaos Dashboard Data

Chaos Dashboard supports setting the expiration time of Chaos Dashboard data. The default `Event` related data expires by `168h`, and the `Experiment` related data defaults to `336h`. If you need to modify it, you can set `dashboard.env.TTL_EVENT` and `dashboard.env` .TTL_EXPERIMENT` parameter, like:

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.TTL_EVENT=168h --set dashboard.env.TTL_EXPERIMENT=336h
</PickHelmVersion>
# Working in Progress
