要检查 Chaos Mesh 的运行情况，请执行以下命令：

```bash
kubectl get pods -n chaos-mesh -l app.kubernetes.io/instance=chaos-mesh
```

以下是预期输出：

```txt
NAME                                       READY   STATUS    RESTARTS   AGE
chaos-controller-manager-7b8c86cc9-44dzf   1/1     Running   0          17m
chaos-controller-manager-7b8c86cc9-mxw99   1/1     Running   0          17m
chaos-controller-manager-7b8c86cc9-xmc5v   1/1     Running   0          17m
chaos-daemon-sg2k2                         1/1     Running   0          17m
chaos-dashboard-b9dbc6b68-hln25            1/1     Running   0          17m
chaos-dns-server-546675d89d-qkjqq          1/1     Running   0          17m
```

如果你的实际输出与预期输出相符，则表示 Chaos Mesh 已经成功安装。

:::note 注意

如果实际输出的 `STATUS` 状态不是 `Running`，则可以运行以下命令查看 Pod 的详细信息，然后依据错误提示排查并解决问题。

```bash
# 以 chaos-controller 为例
kubectl describe po -n chaos-mesh chaos-controller-manager-7b8c86cc9-44dzf
```

:::

:::note 注意

如果 leader election 是关闭的，`chaos-controller-manager` 应只有 1 个实例。

```txt
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-676d8567c7-ndr5j   1/1     Running   0          24m
chaos-daemon-6l55b                          1/1     Running   0          24m
chaos-dashboard-b9dbc6b68-hln25             1/1     Running   0          44m
chaos-dns-server-546675d89d-qkjqq           1/1     Running   0          44m
```

:::
