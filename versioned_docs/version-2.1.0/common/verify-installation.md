To check the running status of Chaos Mesh, execute the following command:

```sh
kubectl get po -n chaos-testing
```

The expected output is as follows:

```sh
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-69fd5c46c8-xlqpc   3/3     Running   0          2d5h
chaos-daemon-jb8xh                          1/1     Running   0          2d5h
chaos-dashboard-98c4c5f97-tx5ds             1/1     Running   0          2d5h
```

If your actual output is similar to the expected output with `NAME`, `READY`, `STATUS`, `RESTARTS`, and `AGE`, it means that Helm is installed successfully.

:::note

If the `STATUS` of your actual output is not `Running`, then execute the following command to check the Pod details, and troubleshoot issues according to the error information.

```sh
# Take the chaos-controller as an example
kubectl describe po -n chaos-testing chaos-controller-manager-69fd5c46c8-xlqpc
```

:::

:::note

If `leader-election` feature is turned off manually, `chaos-controller-manager` should only have 1 replication.

```sh
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-69fd5c46c8-xlqpc   1/1     Running   0          2d5h
chaos-daemon-jb8xh                          1/1     Running   0          2d5h
chaos-dashboard-98c4c5f97-tx5ds             1/1     Running   0          2d5h
```

:::
