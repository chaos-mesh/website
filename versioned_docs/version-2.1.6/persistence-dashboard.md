---
title: Persistence Chaos Dashboard
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

This document describes how to make Chaos Dashboard persistence.

Chaos Dashboard support `SQLite`, `MySQL` and `PostgreSQL` as database backends for persistence.

## SQLite (default)

Chaos Dashboard uses `SQLite` as the default database engine, and it is recommended to enable [PV (Persistent Volumes)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). To enable PV, set `dashboard.persistentVolume.enabled` to `true`. You can find related configurations on [`value.yaml`](https://github.com/chaos-mesh/chaos-mesh/blob/master/helm/chaos-mesh/values.yaml#L255-L282) as follows:

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

If Chaos Dashboard component restarts without PV, the data of Chaos Dashboard will be lost and can't be retrieved.

:::

## MySQL

Chaos Dashboard supports MySQL 5.6 and higher versions as the database engine. The below example demonstrates MySQL database configuration. For details about connection string configuration, refer to the [MySQL-Driver for Go](https://github.com/go-sql-driver/mysql#dsn-data-source-name).

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.DATABASE_DRIVER=mysql --set dashboard.env.DATABASE_DATASOURCE=root:password@tcp(1.2.3.4:3306)/chaos-mesh?parseTime=true
</PickHelmVersion>

## PostgreSQL

Chaos Dashboard supports PostgreSQL 9.6 and higher versions as the database engine. The below example demonstrates PostgreSQL database configuration. For details about connection string configuration, refer to [libpq connect](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-CONNSTRING).

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.DATABASE_DRIVER=postgres --set dashboard.env.DATABASE_DATASOURCE=postgres://root:password@1.2.3.4:5432/postgres?sslmode=disable
</PickHelmVersion>

## Set TTL (Time To Live) for Chaos Dashboard data

Chaos Dashboard supports setting the expiration time of Chaos Dashboard data. The default `Event` related data expires by `168h`, and the `Experiment` related data defaults to `336h`. If you need to modify it, you can set `dashboard.env.TTL_EVENT` and `dashboard.env.TTL_EXPERIMENT` parameters, like:

<PickHelmVersion>
helm install chaos-mesh chaos-mesh/chaos-mesh -n=chaos-testing --version latest --set dashboard.env.TTL_EVENT=168h --set dashboard.env.TTL_EXPERIMENT=336h
</PickHelmVersion>
