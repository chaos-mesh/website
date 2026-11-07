---
title: Simulate Host Faults
---

This document describes how to shut down or reboot a Linux host using Chaosd, through the command line or HTTP service.

:::warning

Host faults affect the entire host, including Chaosd and your remote connection. Run Chaosd with permission to shut down or reboot the host, usually as root.

Shutdown and reboot cannot be recovered by Chaosd. Neither `chaosd recover <UID>` nor `DELETE /api/attack/{uid}` can undo these operations. Setting `duration` does not automatically power the host back on or reverse a reboot. Arrange a way to power the host back on before testing shutdown.

:::

## Create a host fault using the command line

View the supported host actions and their help information:

```bash
chaosd attack host --help
chaosd attack host shutdown --help
chaosd attack host reboot --help
```

### Shut down the host

```bash
chaosd attack host shutdown
```

Chaosd invokes the system's `shutdown` command. Shutdown timing follows the behavior of that command on the host.

### Reboot the host

```bash
chaosd attack host reboot
```

Chaosd invokes the system's `reboot` command.

## Create a host fault using the HTTP service

:::note

The host HTTP endpoint is available starting with **Chaosd v1.6.0**. Chaosd v1.5.0 does not expose this endpoint.

Host faults are available directly through Chaosd. Chaos Mesh's `PhysicalMachineChaos` does not currently provide shutdown or reboot actions.

:::

Start Chaosd on the host where you want to inject the fault:

```bash
chaosd server --host 127.0.0.1 --port 31767
```

The following examples send requests from the same host. For remote access, see [Deploy Chaosd server](simulate-physical-machine-chaos.md#deploy-chaosd-server) for TLS and client certificate configuration.

Send a `POST` request to `/api/attack/host` with a JSON body. The `action` field is required and accepts `shutdown` or `reboot`. The optional `uid` field identifies the experiment. If omitted, Chaosd generates a UID. You do not need to specify `kind`.

### Shut down the host

```bash
curl -X POST 'http://127.0.0.1:31767/api/attack/host' \
  -H 'Content-Type: application/json' \
  -d '{"action":"shutdown"}'
```

### Reboot the host

```bash
curl -X POST 'http://127.0.0.1:31767/api/attack/host' \
  -H 'Content-Type: application/json' \
  -d '{"action":"reboot"}'
```

The connection might close as the host shuts down or reboots, before you receive an HTTP response.
