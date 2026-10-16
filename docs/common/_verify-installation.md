To check the running status of Chaos Mesh, execute the following command:

```sh
kubectl get pods -n chaos-mesh -l app.kubernetes.io/instance=chaos-mesh
```

The expected output is as follows:

```txt
NAME                                       READY   STATUS    RESTARTS   AGE
chaos-controller-manager-7b8c86cc9-44dzf   1/1     Running   0          17m
chaos-controller-manager-7b8c86cc9-mxw99   1/1     Running   0          17m
chaos-controller-manager-7b8c86cc9-xmc5v   1/1     Running   0          17m
chaos-daemon-sg2k2                         1/1     Running   0          17m
chaos-dashboard-b9dbc6b68-hln25            1/1     Running   0          17m
chaos-dns-server-546675d89d-qkjqq          1/1     Running   0          17m
```

If your actual output is similar to the expected output, then Chaos Mesh has been successfully installed.

:::note

If the `STATUS` of your actual output is not `Running`, then execute the following command to check the Pod details, and troubleshoot issues according to the error information.

```sh
# Take the chaos-controller as an example
kubectl describe po -n chaos-mesh chaos-controller-manager-7b8c86cc9-44dzf
```

:::

:::note

If leader election is turned off, `chaos-controller-manager` should only have 1 replication.

```txt
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-676d8567c7-ndr5j   1/1     Running   0          24m
chaos-daemon-6l55b                          1/1     Running   0          24m
chaos-dashboard-b9dbc6b68-hln25             1/1     Running   0          44m
chaos-dns-server-546675d89d-qkjqq           1/1     Running   0          44m
```

:::

## Access the Chaos Dashboard

After installation, the Dashboard is exposed by the `chaos-dashboard` Service in the install namespace (default `chaos-mesh`). Port **2333** serves the UI.

### Option 1: `kubectl port-forward` (works on any cluster)

```bash
kubectl port-forward -n chaos-mesh svc/chaos-dashboard 2333:2333
```

Open http://localhost:2333/ in your browser.

### Option 2: NodePort

If the Service type is `NodePort`, find the allocated port and open it on a node IP:

```bash
kubectl get svc -n chaos-mesh chaos-dashboard
```

Example output:

```txt
NAME              TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
chaos-dashboard   NodePort   10.43.196.70   <none>        2333:31643/TCP   13m
```

Then visit `http://<node-ip>:31643/` (use the port after the colon in `PORT(S)`).

On single-node setups where the node listens on the host (for example k3s), `http://localhost:<node-port>/` may work. With **kind**, NodePorts are not published on localhost unless you created the cluster with matching `extraPortMappings`; prefer Option 1 (`kubectl port-forward`) for kind.

### Next steps

- Generate a token and sign in: [Manage User Permissions](manage-user-permissions.md).
- Expose the Dashboard outside the cluster: [Expose Dashboard with Ingress](expose-dashboard-with-ingress.md).
