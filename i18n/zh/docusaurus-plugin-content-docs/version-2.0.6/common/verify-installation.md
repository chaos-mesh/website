要查看 Chaos Mesh 的运行情况，请执行以下命令：

```bash
kubectl get po -n chaos-testing
```

以下是预期输出：

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-69fd5c46c8-xlqpc   1/1     Running   0          2d5h
chaos-daemon-jb8xh                          1/1     Running   0          2d5h
chaos-dashboard-98c4c5f97-tx5ds             1/1     Running   0          2d5h
```

如果你的实际输出与预期输出相符，表示 Chaos Mesh 已经成功安装。

:::note 注意

如果实际输出的 `STATUS` 状态不是 `Running`，则需要运行以下命令查看 Pod 的详细信息，然后依据错误提示排查并解决问题。

```bash
# 以 chaos-controller 为例
kubectl describe po -n chaos-testing chaos-controller-manager-69fd5c46c8-xlqpc
```

:::
