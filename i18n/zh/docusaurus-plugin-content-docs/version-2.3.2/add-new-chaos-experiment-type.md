---
title: 新增混沌实验类型
---

本文档介绍如何开发一种新的混沌实验类型。

以开发一种名为 HelloWorldChaos 的混沌实验类型为例，它的功能是向日志中输出一行 "Hello world!"。为了完成这一目标，你需要完成以下步骤：

- 第 1 步：定义混沌实验的结构类型
- 第 2 步：注册 CRD
- 第 3 步：注册混沌实验的处理函数
- 第 4 步：编译 Docker 镜像
- 第 5 步：运行混沌实验

## 第 1 步：定义混沌实验的结构类型

1. 在 API 目录 `api/v1alpha1` 中新建一个名为 `helloworldchaos_types.go` 的文件，写入以下内容:

   ```go
   package v1alpha1

   import (
       metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
   )

   // +kubebuilder:object:root=true
   // +chaos-mesh:experiment
   // +chaos-mesh:oneshot=true

   // HelloWorldChaos is the Schema for the helloworldchaos API
   type HelloWorldChaos struct {
       metav1.TypeMeta   `json:",inline"`
       metav1.ObjectMeta `json:"metadata,omitempty"`

       Spec   HelloWorldChaosSpec   `json:"spec"`
       Status HelloWorldChaosStatus `json:"status,omitempty"`
   }

   // HelloWorldChaosSpec is the content of the specification for a HelloWorldChaos
   type HelloWorldChaosSpec struct {
       // ContainerSelector specifies target
       ContainerSelector `json:",inline"`

       // Duration represents the duration of the chaos action
       // +optional
       Duration *string `json:"duration,omitempty"`
   }

   // HelloWorldChaosStatus represents the status of a HelloWorldChaos
   type HelloWorldChaosStatus struct {
       ChaosStatus `json:",inline"`
   }

   // GetSelectorSpecs is a getter for selectors
   func (obj *HelloWorldChaos) GetSelectorSpecs() map[string]interface{} {
       return map[string]interface{}{
           ".": &obj.Spec.ContainerSelector,
       }
   }
   ```

   这个文件定义了 HelloWorldChaos 的结构类型，它可以用一个 YAML 文件描述:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: HelloWorldChaos
   metadata:
     name: <资源名>
     namespace: <命名空间名>
   spec:
     duration: <持续时间>
   status:
     experiment: <实验状态>
     ...
   ```

2. 在 Chaos Mesh 根目录下运行 `make generate`，为 HelloWorldChaos 生成一些用于编译 Chaos Mesh 的辅助代码。

## 第 2 步：注册 CRD

在 Kubernetes API 中注册 HelloWorldChaos 的 CRD，使 HelloWorldChaos 成为一种 Kubernetes 自定义资源。

1. 在根目录下运行 `make yaml`。

   生成的 YAML 文件位于 `config/crd/bases/chaos-mesh.org_helloworldchaos.yaml`。

2. 为将这个 YAML 文件合并入 `manifests/crd.yaml` 中，修改 `config/crd/kustomization.yaml`，在其中加入新的一行:

   ```yaml
   resources:
     - bases/chaos-mesh.org_podchaos.yaml
     - bases/chaos-mesh.org_networkchaos.yaml
     - bases/chaos-mesh.org_iochaos.yaml
     - bases/chaos-mesh.org_helloworldchaos.yaml # 新增一行
   ```

3. 再次运行 `make yaml`，HelloWorldChaos 的定义就会出现在 `manifests/crd.yaml` 里。 如需确认，你可以使用 `git diff` 命令。

## 第 3 步：注册混沌实验的处理函数

1. 创建一个新文件 `controllers/chaosimpl/helloworldchaos/types.go` 并写入如下内容：

   ```go
   package helloworldchaos

   import (
       "context"

       "github.com/go-logr/logr"
       "go.uber.org/fx"
       "sigs.k8s.io/controller-runtime/pkg/client"

       "github.com/chaos-mesh/chaos-mesh/api/v1alpha1"
       "github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/utils"
       "github.com/chaos-mesh/chaos-mesh/controllers/common"
       "github.com/chaos-mesh/chaos-mesh/controllers/utils/chaosdaemon"
   )

   type Impl struct {
       client.Client
       Log logr.Logger
       decoder *utils.ContainerRecordDecoder
   }

   // Apply applies HelloWorldChaos
   func (impl *Impl) Apply(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
       impl.Log.Info("Hello world!")
       return v1alpha1.Injected, nil
   }

   // Recover means the reconciler recovers the chaos action
   func (impl *Impl) Recover(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
       impl.Log.Info("Goodbye world!")
       return v1alpha1.NotInjected, nil
   }

   func NewImpl(c client.Client, log logr.Logger, decoder *utils.ContainerRecordDecoder) *common.ChaosImplPair {
       return &common.ChaosImplPair{
           Name:   "helloworldchaos",
           Object: &v1alpha1.HelloWorldChaos{},
           Impl: &Impl{
               Client: c,
               Log:    log.WithName("helloworldchaos"),
               decoder: decoder,
           },
           ObjectList: &v1alpha1.HelloWorldChaosList{},
       }
   }

   var Module = fx.Provide(
       fx.Annotated{
           Group:  "impl",
           Target: NewImpl,
       },
   )

   ```

2. Chaos Mesh 使用 [fx](https://github.com/uber-go/fx) 这个库来进行依赖注入。为了注册进 Controller Manager，需要在 `controllers/chaosimpl/fx.go` 中加入一行：

   ```go
       ...
       gcpchaos.Module,
       stresschaos.Module,
       jvmchaos.Module,
       timechaos.Module,
       helloworldchaos.Module // 新增一行，注意处理 import
   ```

   以及在 `controllers/types/types.go` 中加入：

   ```go
       ...
       fx.Annotated{
           Group: "objs",
           Target: Object{
               Name:   "timechaos",
               Object: &v1alpha1.TimeChaos{},
           },
       },

       fx.Annotated{
           Group: "objs",
           Target: Object{
               Name:   "gcpchaos",
               Object: &v1alpha1.GCPChaos{},
           },
       },

       fx.Annotated{
           Group: "objs",
           Target: Object{
               Name:   "helloworldchaos",
               Object: &v1alpha1.HelloWorldChaos{},
           },
       },
   ```

## 第 4 步：编译 Docker 镜像

1. 在完成了前面所有步骤后，你可以尝试编译镜像：

   ```bash
   make
   ```

2. 将镜像推送到本地的 Docker Registry 中：

   ```bash
   make docker-push
   ```

3. 如果你的 Kubernetes 集群部署在 kind 上，则还需要将镜像加载进 kind 中：

   ```bash
   kind load docker-image localhost:5000/chaos-mesh/chaos-mesh:latest
   kind load docker-image localhost:5000/chaos-mesh/chaos-daemon:latest
   kind load docker-image localhost:5000/chaos-mesh/chaos-dashboard:latest
   ```

## 第 5 步：运行混沌实验

在这一步中，你需要部署修改版的 Chaos Mesh 并测试 HelloWorldChaos。

在你部署 Chaos Mesh 之前（使用 `helm install` 或 `helm upgrade`），请修改 helm 模板的 `helm/chaos-mesh/values.yaml`，把镜像更换成你本地 Docker Registry 中的镜像。

Chaos Mesh 的模板使用 `chaos-mesh/chaos-mesh:latest` 作为默认 Registry，你需要把它换成 `DOCKER_REGISTRY` 环境变量的值（默认为 `localhost:5000`），示例如下：

```yaml
controllerManager:
  image: localhost:5000/chaos-mesh/chaos-mesh:latest
  ...
chaosDaemon:
  image: localhost:5000/chaos-mesh/chaos-daemon:latest
  ...
dashboard:
  image: localhost:5000/chaos-mesh/chaos-dashboard:latest
  ...
```

完成上述模板修改后，请尝试运行 HelloWorldChaos。

1. 将 CRD 注册进集群：

   ```bash
   kubectl create -f manifests/crd.yaml
   ```

   可以看到 HelloWorldChaos 已经被创建：

   ```log
   customresourcedefinition.apiextensions.k8s.io/helloworldchaos.chaos-mesh.org created
   ```

   现在可以查看 HelloWorldChaos 的 CRD：

   ```bash
   kubectl get crd helloworldchaos.chaos-mesh.org
   ```

2. 安装 Chaos Mesh：

   ```bash
   helm install chaos-mesh helm/chaos-mesh --namespace=chaos-mesh --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
   ```

   验证一下安装是否成功，查询 `chaos-testing` 命名空间的 Pod:

   ```bash
   kubectl get pods --namespace chaos-mesh -l app.kubernetes.io/instance=chaos-mesh
   ```

   :::note 注意

   `--set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock` 是用来在 kind 上运行 NetworkChaos 的。

   :::

3. 部署用于测试的目标 Pod：

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/chaos-mesh/apps/master/ping/busybox-statefulset.yaml
   ```

   请确保用于测试的目标 Pod 可以正常运行。

4. 创建一个名为 `chaos.yaml` 的文件，写入以下内容：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: HelloWorldChaos
   metadata:
     name: hello-world
     namespace: chaos-mesh
   spec:
     selector:
       namespaces:
         - busybox
     mode: one
     duration: 1h
   ```

5. 运行混沌实验：

   ```bash
   kubectl apply -f /path/to/chaos.yaml
   ```

   ```bash
   kubectl get HelloWorldChaos -n chaos-mesh
   ```

   现在查看 `chaos-controller-manager` 的日志，就会看到 `Hello World!`：

   ```bash
   kubectl logs chaos-controller-manager-{pod-post-fix} -n chaos-mesh
   ```

   显示日志如下：

   ```log
   2021-06-24T06:42:26.858Z        INFO    records apply chaos     {"id": "chaos-testing/chaos-daemon-vsmc5"}
   2021-06-24T06:42:26.858Z        INFO    helloworldchaos Hello World!
   ```

   :::note 注意

   `{pod-post-fix}` 是一个随机串。你可以运行 `kubectl get pod -n chaos-mesh` 来查看它。

   :::

## 探索更多

如果你在新增混沌实验类型的过程中遇到了问题，请在 GitHub 创建一个 [issue](https://github.com/chaos-mesh/chaos-mesh/issues) 向 Chaos Mesh 团队反馈。

如果你想进一步尝试开发工作，请参阅 [拓展 Chaos Daemon 接口](extend-chaos-daemon-interface.md)。
