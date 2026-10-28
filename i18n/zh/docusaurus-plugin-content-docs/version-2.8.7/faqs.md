---
title: 常见问题解答 (FAQ)
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

### 如果我没有部署 Kubernetes 集群，能否使用 Chaos Mesh 创建混沌实验？

不能。你可以改用 [chaosd](https://github.com/chaos-mesh/chaosd/) 在不依赖 Kubernetes 的情况下注入故障。

### 我已经成功部署 Chaos Mesh 并创建了 PodChaos 实验，但创建 NetworkChaos/TimeChaos 实验仍然失败。日志如下：

```console
2020-06-18T02:49:15.160Z ERROR controllers.TimeChaos failed to apply chaos on all pods {"reconciler": "timechaos", "error": "rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing dial tcp xx.xx.xx.xx:xxxx: connect: connection refused\""}
```

原因是 `chaos-controller-manager` 无法连接到 `chaos-daemon`。你需要先检查 Pod 网络及其[策略](https://kubernetes.io/docs/concepts/services-networking/network-policies/)。

如果一切正常，你可以尝试通过以下方式使用 `hostNetwork` 参数解决此问题：

<PickHelmVersion>{`helm upgrade chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --version latest --set chaosDaemon.hostNetwork=true`}</PickHelmVersion>

参考文档：https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#hostport-services-do-not-work

### Google Cloud 默认管理员账号无法创建混沌实验。如何解决？

Google Cloud 默认管理员账号无法通过 `AdmissionReview` 校验。你需要创建一个管理员角色，并将其绑定到你的账号，以授权该账号创建混沌实验。例如：

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: role-cluster-manager-pdmas
rules:
  - apiGroups: ['']
    resources: ['pods', 'namespaces']
    verbs: ['get', 'watch', 'list']
  - apiGroups:
      - chaos-mesh.org
    resources: ['*']
    verbs: ['get', 'list', 'watch', 'create', 'delete', 'patch', 'update']
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: cluster-manager-binding
  namespace: chaos-mesh
subjects:
  # Google Cloud 用户账号
  - kind: User
    name: USER_ACCOUNT
roleRef:
  kind: ClusterRole
  name: role-cluster-manager-pdmas
  apiGroup: rbac.authorization.k8s.io
```

上述 `USER_ACCOUNT` 应为你的 Google Cloud 用户邮箱。

### 出现类似 `version 1.41 is too new. The maximum supported API version is 1.39` 的错误

这表明 Docker daemon 可接受的最大 API 版本为 `1.39`，但 `chaos-daemon` 中的客户端默认使用 `1.41`。你可以选择以下任一方式解决此问题：

1. 将 Docker 升级到更新的版本。
2. 使用 `--set chaosDaemon.env.DOCKER_API_VERSION=1.39` 进行 Helm 安装/升级。

## DNSChaos

### 在 OpenShift 中运行 DNSChaos 时，因授权问题导致操作被阻止

如果错误信息类似以下内容：

```bash
Error creating: pods "chaos-dns-server-123aa56123-" is forbidden: unable to validate against any security context constraint: [spec.containers[0].securityContext.capabilities.add: Invalid value: "NET_BIND_SERVICE": capability may not be added]
```

你需要为 `chaos-dns-server` 添加特权 Security Context Constraints (SCC)。

```bash
oc adm policy add-scc-to-user privileged -n chaos-mesh -z chaos-dns-server
```

## 安装

### 在 OpenShift 中安装 Chaos Mesh 时，因授权问题导致安装过程被阻止

如果错误信息类似以下内容：

```bash
Error creating: pods "chaos-daemon-" is forbidden: unable
 to validate against any security context constraint: [spec.securityContext.hostNetwork:
 Invalid value: true: Host network is not allowed to be used spec.securityContext.hostPID:
 Invalid value: true: Host PID is not allowed to be used spec.securityContext.hostIPC:
 Invalid value: true: Host IPC is not allowed to be used securityContext.runAsUser:
 Invalid value: "hostPath": hostPath volumes are not allowed to be used spec.containers[0].securityContext.volumes[1]:
 Invalid value: true: Host network is not allowed to be used spec.containers[0].securityContext.containers[0].hostPort:
 Invalid value: 31767: Host ports are not allowed to be used spec.containers[0].securityContext.hostPID:
 Invalid value: true: Host PID is not allowed to be used spec.containers[0].securityContext.hostIPC:
......]
```

你需要为 `chaos-daemon` 服务账号添加特权 SCC。

```bash
oc adm policy add-scc-to-user privileged -n chaos-mesh -z chaos-daemon
```

### 安装 Chaos Mesh 失败，提示信息为：no matches for kind "CustomResourceDefinition" in version "apiextensions.k8s.io/v1"

当你将 Chaos Mesh 安装在 Kubernetes v1.15 或更早版本时会出现此问题。我们默认使用 `apiextensions.k8s.io/v1`，但该 API 版本是在 Kubernetes v1.16 中引入的。

当你将 Chaos Mesh 安装在低于 v1.16 的 Kubernetes 上时，需要遵循以下步骤：

1. 通过 `https://mirrors.chaos-mesh.org/<chaos-mesh-version>/crd-v1beta1.yaml` 手动创建 CRD。
2. 添加 `--validate=false`。如果不设置此标志，可能会因 CRD 的破坏性变更引发兼容性问题。例如，`kubectl create -f https://mirrors.chaos-mesh.org/v2.1.0/crd-v1beta1.yaml --validate=false`。
3. 使用 Helm 完成剩余的安装流程，并在 `helm install` 命令中追加 `--skip-crds`。

我们建议你参考 Kubernetes [版本偏差策略](https://kubernetes.io/releases/version-skew-policy/)升级 Kubernetes 集群。

## Chaosd

### 运行失败，错误信息：attempt to write a readonly database

无论是使用命令模式还是服务模式运行 chaosd，如果当前用户无法写入 chaosd 使用的 SQLite 数据库文件，就会出现此错误。默认情况下，数据库文件位于 chaosd 的安装目录中，路径为 `/usr/local/chaosd-v$VERSION-$OS-$ARCH/chaosd.db`（例如 `/usr/local/chaosd-v1.4.0-linux-amd64/chaosd.db`）。

要解决此问题，你需要为数据库文件授予写权限：

```bash
# 将路径替换为你实际的 chaosd 安装目录
sudo chmod 666 /usr/local/chaosd-v*/chaosd.db
# 同时确保目录可写
sudo chmod 775 /usr/local/chaosd-v*/
```

或者，你可以使用适当的权限运行 chaosd，或将数据库文件的所有权更改为当前用户。

### 涉及 tc 和 iptables 的网络故障实验需要使用 sudo 执行

在创建使用 `tc`（流量控制）或 `iptables` 的网络混沌实验时，必须使用 `sudo` 或 root 权限执行 chaosd 命令。如果没有适当的权限，混沌攻击将无法应用，恢复操作也会失败。

需要 sudo 权限的网络混沌实验包括：

- 网络延迟、丢包、重复或损坏
- 网络带宽限制
- 网络分区

运行这些实验的方法：

```bash
# 命令模式
sudo chaosd attack network delay --device eth0 --latency 100ms

# 服务模式 - 使用 sudo 启动服务
sudo chaosd server
```

如果不使用 sudo，在尝试修改网络配置时可能会看到类似 "permission denied" 或 "operation not permitted" 的错误。
