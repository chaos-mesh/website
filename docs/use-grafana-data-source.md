---
title: Use Grafana Data Source Plugin for Observations
---

This document describes how to install the Data Source plugin locally in Grafana and make observations using Grafana Data Source.

:::note

- Grafana should be in 7.0.0 or later versions.
- The Data Source plugin cannot be installed through `grafana-cli` at this time, because Grafana has not yet accepted the plugin submission for Chaos Mesh Data Source.

:::

## Install Data Source Plugin

You can install the Data Source plugin locally in Grafana by following these steps:

1. Download the plugin zip package with the following command, or visit <https://github.com/chaos-mesh/datasource/releases> to download the package:

   ```shell
   curl -LO https://github.com/chaos-mesh/datasource/releases/download/v2.1.0/chaosmeshorg-datasource-2.1.0.zip
   ```

   After downloading, extract the plugin to the Grafana plugin directory:

   ```shell
   unzip chaosmeshorg-datasource-2.1.0.zip -d YOUR_PLUGIN_DIR
   ```

   :::tip

   To find the plugin directory, refer to <https://grafana.com/docs/grafana/latest/plugins/installation/#install-a-packaged-plugin>.

   :::

2. Update and save the configuration file `grafana.ini` of Grafana. Then, add the plugin to `allow_loading_unsigned_plugins` to ensure that Grafana can load the unsigned plugin:

   ```ini
   [plugins]
     allow_loading_unsigned_plugins = chaosmeshorg-datasource
   ```

   :::tip

   To find the configuration file, refer to <https://grafana.com/docs/grafana/latest/administration/configuration/#config-file-locations>.

   :::

3. Finally, restart Grafana to load the Data Source plugin.

## Set up Data Source Plugin

1. After you have successfully installed the Data Source plugin locally in Grafana, go to **Configuration -> Data sources** and add Chaos Mesh to there, then visit the following configuration page:

   ![Configuration page](img/grafana/settings.png)

   On this page, only the `URL` field needs to be filled in, and the other fields can be ignored.

   Suppose that you have installed Chaos Mesh locally. In this case, Dashboard exports the API on port `2333` by default. Therefore, if you have not changed anything, you can write `http://localhost:2333` in `URL`.

2. Then use the `port-forward` command to make the API externally accessible:

   ```shell
   kubectl port-forward -n chaos-testing svc/chaos-dashboard 2333:2333
   ```

3. Click **Save & Test** to test the connection. If it shows a successful notification, the set-up is complete.

## Query

The Data Source plugin observes Chaos Mesh from the perspective of events. The following options are responsible for filtering different events:

- `Object ID`: Filter by object UUID
- `Namespace`: Filter by different namespace
- `Name`: Filter by object name
- `Kind`: Filter by kind (PodChaos, Schedule, and so on)
- `Limit`: Limit the number of events

The settings for these options are passed as parameters to the `/api/events` API.

## Annotations

You can integrate Chaos Mesh events into the panel by setting up Annotations. For example:

! [Annotations](img/grafana/annotations.png)

For information on how to fill in the fields in annotations, refer to [Query](#query).

## Variables

You can query Chaos Mesh for events dynamically by setting different variables.

![Variables](https://raw.githubusercontent.com/chaos-mesh/datasource/master/src/img/variables.png)

The types of variables provided by the plugin are as follows:

- `Namespace`: After your selection, all available namespaces are displayed directly at the bottom of the page under `Preview of values`.
- `Kind`: Same as **Namespace**. It can get all kinds.
- `Experiment`: Same as **Namespace**. It can get the names of all experiments.
- `Schedule`: Same as **Namespace**. It can get the names of all schedules.

## Questions and feedback

If you encounter problems during installation or set-up, you are welcome to ask questions to the community at [CNCF Slack](https://cloud-native.slack.com/archives/C0193VAV272), or create an [GitHub issue](https://github.com/chaos-mesh/datasource/issues) to communicate with the Chaos Mesh team.

## What's next

If you want to learn more details about the Data Source plugin, feel free to check out the source code for the plugin at [chaos-mesh/datasource](https://github.com/chaos-mesh/datasource).
