# 访问 Chaos Dashboard

安装完成后，Dashboard 由安装命名空间（默认为 `chaos-mesh`）中的 `chaos-dashboard` Service 暴露，UI 使用端口 **2333**。

## 方式一：`kubectl port-forward`（适用于任何集群）

```bash
kubectl port-forward -n chaos-mesh svc/chaos-dashboard 2333:2333
```

在浏览器中打开 http://localhost:2333/。

## 方式二：NodePort

如果 Service 类型为 `NodePort`，可以先查询分配到的端口，然后通过节点 IP 访问：

```bash
kubectl get svc -n chaos-mesh chaos-dashboard
```

输出示例：

```txt
NAME              TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
chaos-dashboard   NodePort   10.43.196.70   <none>        2333:31643/TCP   13m
```

然后访问 `http://<node-ip>:31643/`（即 `PORT(S)` 中冒号后面的端口）。

在节点直接监听宿主机网络的单节点环境中（例如 k3s），`http://localhost:<node-port>/` 可能可以直接访问。而对于 **kind**，除非在创建集群时配置了相应的 `extraPortMappings`，否则 NodePort 不会发布到 localhost 上，因此在 kind 上建议使用方式一（`kubectl port-forward`）。

## 后续步骤

- 生成 token 并登录：[管理用户权限](./manage-user-permissions.md)。
- 将 Dashboard 暴露到集群之外：[使用 Ingress 暴露 Chaos Dashboard](./expose-dashboard-with-ingress.md)。
