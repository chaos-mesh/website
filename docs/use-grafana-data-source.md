---
title: Use Grafana Data Source for Observations
---

:::note

The minimum Grafana version that can use the plugin is `7.0.0`. (Require Grafana >= `7.0.0`)

:::

:::note

Because Grafana is not yet accepting the plugin submission for Chaos Mesh Data Source, it can't be installed using `grafana-cli` at this time.

The following steps show how to install the Data Source plugin locally.

:::

## Install

Download the plugin zip package with the following command or go to <https://github.com/chaos-mesh/datasource/releases> to download:

```shell
curl -LO https://github.com/chaos-mesh/datasource/releases/download/v2.1.0/chaosmeshorg-datasource-2.1.0.zip
```

After downloading, unzip:

```shell
unzip chaosmeshorg-datasource-2.1.0.zip -d YOUR_PLUGIN_DIR
```

:::tip

Refer to <https://grafana.com/docs/grafana/latest/plugins/installation/#install-a-packaged-plugin> to find the plugin dir.

:::

Then update and save the `grafana.ini` file:

```ini
[plugins]
  allow_loading_unsigned_plugins = chaosmeshorg-datasource
```

Finally, restart Grafana to load the plugin.

## Setup

Once installed, go to **Configuration -> Data sources** and add Chaos Mesh, then go to the configuration page:

![Configuration page](img/grafana/settings.png)

Only the `URL` field needs to be filled in, the other fields can be ignored.

Assuming you have Chaos Mesh installed locally, Dashboard will export the API on port `2333` by default. So, if you haven't changed anything, you can just fill in `http://localhost:2333`.

Then use the `port-forward` command to activate:

```shell
kubectl port-forward -n chaos-testing svc/chaos-dashboard 2333:2333
```

Finally, click **Save & Test** to test the connection. If it shows a successful notification, the setup is complete.

## Query

The Data Source plugin looks at the Chaos Mesh through the lens of events, and the following options are responsible for filtering the different events:

- **Object ID** - Filter by object uuid
- **Namespace** - Filter by different namespace
- **Name** - Filter by object name
- **Kind** - Filter by kind (PodChaos, Schedule...)
- **Limit** - Limit the number of events

They will be passed as parameters to the `/api/events` API.

## Annotations

You can integrate Chaos Mesh's events into the panel via Annotations, the following is a sample creation:

! [Annotations](img/grafana/annotations.png)

Please refer to the contents of [Query](#query) to fill in the corresponding fields.

## Variables

If you choose the type to `Query` and select the data source to `Chaos Mesh`, you can retrieve the variables by different metrics:

![Variables](https://raw.githubusercontent.com/chaos-mesh/datasource/master/src/img/variables.png)

- Namespace

  After selection, all available namespaces will show in **Preview of values** directly. Without other operations.

- Kind

  Same as **Namespace**. Get all kinds.

- Experiment

  Same as **Namespace**. Get the names of all experiments.

- Schedule

  Same as **Namespace**. Get the names of all schedules.

## Problems encountered

You can ask the community questions at [CNCF Slack](https://cloud-native.slack.com/archives/C0193VAV272) or go to <https://github.com/chaos-mesh/datasource/issues> to submit issues.

## More

To learn more, please go to [chaos-mesh/datasource](https://github.com/chaos-mesh/datasource) for more details.
