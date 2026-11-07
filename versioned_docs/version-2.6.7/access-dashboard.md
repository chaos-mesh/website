# Access the Chaos Dashboard

After installation, the Dashboard is exposed by the `chaos-dashboard` Service in the install namespace (default `chaos-mesh`). Port **2333** serves the UI.

## Option 1: `kubectl port-forward` (works on any cluster)

```bash
kubectl port-forward -n chaos-mesh svc/chaos-dashboard 2333:2333
```

Open http://localhost:2333/ in your browser.

## Option 2: NodePort

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

## Next steps

- Generate a token and sign in: [Manage User Permissions](./manage-user-permissions.md).
- Expose the Dashboard outside the cluster: [Expose Dashboard with Ingress](./expose-dashboard-with-ingress.md).
