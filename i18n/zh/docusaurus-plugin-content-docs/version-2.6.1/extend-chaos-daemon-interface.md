---
title: 拓展 Chaos Daemon 接口
---

在[新增混沌实验类型](add-new-chaos-experiment-type.md)中，你实现了一种名为 HelloWorldChaos 的混沌实验，它的功能是在 Chaos Controller Manager 的日志中输出一行 "Hello world!"。为了让 HelloWorldChaos 真正有用，你还需要向 Chaos Daemon 添加接口，从而在目标 Pod 上注入一些故障。比方说，获取目标 Pod 中正在运行的进程信息。

:::note 提示

一些关于 Chaos Mesh 架构的知识对于帮助你理解这一文档非常有用，例如 [Chaos Mesh  架构](architecture.md)。

:::

本文档分为以下几部分：

- [选择器](#选择器)
- [实现 gRPC 接口](#实现-grpc-接口)
- [验证实验效果](#验证实验效果)
- [探索更多](#探索更多)

## 选择器

回顾一下你在 `api/v1alpha1/helloworldchaos_type.go` 中定义的 `HelloWorldSpec` 这一结构，其中包括了一项 `ContainerSelector`。

```go
// HelloWorldChaosSpec is the content of the specification for a HelloWorldChaos
type HelloWorldChaosSpec struct {
	// ContainerSelector specifies target
	ContainerSelector `json:",inline"`

	// Duration represents the duration of the chaos action
	// +optional
	Duration *string `json:"duration,omitempty"`
}

...

// GetSelectorSpecs is a getter for selectors
func (obj *HelloWorldChaos) GetSelectorSpecs() map[string]interface{} {
	return map[string]interface{}{
		".": &obj.Spec.ContainerSelector,
	}
}
```

在 Chaos Mesh 中，混沌实验通过选择器来定义试验范围。选择器可以限定目标的命名空间、注解、标签等。选择器也可以是一些更特殊的值（如 AWSChaos 中的 AWSSelector）。通常来说，每个混沌实验只需要一个选择器，但也有例外，比如 NetworkChaos 有时需要两个选择器作为网络分区的两个对象。

## 实现 gRPC 接口

为了让 Chaos Daemon 能接受 Chaos Controller Manager 的请求，需要给它们加上新的 gRPC 接口。

1. 在 `pkg/chaosdaemon/pb/chaosdaemon.proto` 中加上新的 RPC。

   ```proto
   service chaosDaemon {
       ...

       rpc ExecHelloWorldChaos(ExecHelloWorldRequest) returns (google.protobuf.Empty) {}
   }

   message ExecHelloWorldRequest {
       string container_id = 1;
   }
   ```

   更新了 proto 文件后，需要重新生成 Golang 代码。

   ```bash
   make proto
   ```

2. 在 Chaos Daemon 中实现 gRPC 服务。

   在 `pkg/chaosdaemon` 目录下新建一个名为 `helloworld_server.go` 的文件，写入以下内容：

   ```go
   package chaosdaemon

   import (
      "context"
      "fmt"

      "github.com/golang/protobuf/ptypes/empty"

      "github.com/chaos-mesh/chaos-mesh/pkg/bpm"
      "github.com/chaos-mesh/chaos-mesh/pkg/chaosdaemon/pb"
   )

   func (s *DaemonServer) ExecHelloWorldChaos(ctx context.Context, req *pb.ExecHelloWorldRequest) (*empty.Empty, error) {
      log := s.getLoggerFromContext(ctx)
      log.Info("ExecHelloWorldChaos", "request", req)

      pid, err := s.crClient.GetPidFromContainerID(ctx, req.ContainerId)
      if err != nil {
         return nil, err
      }

      cmd := bpm.DefaultProcessBuilder("sh", "-c", fmt.Sprintf("ps aux")).
         SetNS(pid, bpm.MountNS).
         SetContext(ctx).
         Build(ctx)
      out, err := cmd.Output()
      if err != nil {
         return nil, err
      }
      if len(out) != 0 {
         log.Info("cmd output", "output", string(out))
      }

      return &empty.Empty{}, nil
   }
   ```

   在 `chaos-daemon` 收到 `ExecHelloWorldChaos` 请求后, 它会输出当前容器的进程列表.

3. 在应用混沌实验中发送 gRPC 请求。

   每个混沌实验都有其生命周期，首先被应用，然后被恢复。有一些混沌实验无法被恢复（如 PodChaos 中的 PodKill，以及 HelloWorldChaos），我们称之为 OneShot 实验，你可以在 HelloWorldChaos 结构的定义上方找到一行 `+chaos-mesh:oneshot=true`。

   Chaos Controller Manager 需要在应用 HelloWorldChaos 时给 Chaos Daemon 发送请求。为此，你需要对 `controllers/chaosimpl/helloworldchaos/types.go` 稍作修改。

   ```go
   package helloworldchaos

   import (
      "context"

      "github.com/chaos-mesh/chaos-mesh/api/v1alpha1"
      impltypes "github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/types"
      "github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/utils"
      "github.com/chaos-mesh/chaos-mesh/pkg/chaosdaemon/pb"
      "github.com/go-logr/logr"
      "go.uber.org/fx"
      "sigs.k8s.io/controller-runtime/pkg/client"
   )

   type Impl struct {
      client.Client
      Log     logr.Logger
      decoder *utils.ContainerRecordDecoder
   }

   // Apply applies KernelChaos
   func (impl *Impl) Apply(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
      impl.Log.Info("Apply helloworld chaos")
      decodedContainer, err := impl.decoder.DecodeContainerRecord(ctx, records[index], obj)
      if err != nil {
         return v1alpha1.NotInjected, err
      }
      pbClient := decodedContainer.PbClient
      containerId := decodedContainer.ContainerId

      _, err = pbClient.ExecHelloWorldChaos(ctx, &pb.ExecHelloWorldRequest{
      	ContainerId: containerId,
      })
      if err != nil {
         return v1alpha1.NotInjected, err
      }

      return v1alpha1.Injected, nil
   }

   // Recover means the reconciler recovers the chaos action
   func (impl *Impl) Recover(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
      mpl.Log.Info("Recover helloworld chaos")
      return v1alpha1.NotInjected, nil
   }

   func NewImpl(c client.Client, log logr.Logger, decoder *utils.ContainerRecordDecoder) *impltypes.ChaosImplPair {
      return &impltypes.ChaosImplPair{
         Name:   "helloworldchaos",
         Object: &v1alpha1.HelloWorldChaos{},
         Impl: &Impl{
            Client:  c,
            Log:     log.WithName("helloworldchaos"),
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

   :::note 提示

   在 HelloWorldChaos 中，恢复过程什么都没有做。这是因为 HelloWorldChaos 是一个 OneShot 实验。如果你的新实验需要恢复，你应该在其中实现相关逻辑。

   :::

## 验证实验效果

要验证实验效果，请进行以下操作：

1. 重新编译 Docker 镜像，并推送到本地 Registry 上，然后加载进 kind（如果你使用 kind）：

   ```bash
   make image
   make docker-push
   kind load docker-image localhost:5000/pingcap/chaos-mesh:latest
   kind load docker-image localhost:5000/pingcap/chaos-daemon:latest
   kind load docker-image localhost:5000/pingcap/chaos-dashboard:latest
   ```

2. 更新 Chaos Mesh：

   ```bash
   helm upgrade chaos-mesh helm/chaos-mesh --namespace=chaos-mesh
   ```

3. 部署用于测试的目标 Pod（如果你已经在之前部署了这个 Pod，请跳过这一步）：

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/chaos-mesh/apps/master/ping/busybox-statefulset.yaml
   ```

4. 新建一个 YAML 文件，写入：

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: HelloWorldChaos
   metadata:
     name: busybox-helloworld-chaos
   spec:
     selector:
       namespaces:
         - busybox
     mode: all
     duration: 1h
   ```

5. 应用混沌实验：

   ```bash
   kubectl apply -f /path/to/helloworld.yaml
   ```

6. 验证实验结果。有几份日志需要确认：

   - 查看 Chaos Controller Manager 的日志:

     ```bash
     kubectl logs chaos-controller-manager-{pod-post-fix} -n chaos-mesh
     ```

     查找以下内容:

     ```log
     2021-06-25T06:02:12.754Z        INFO    records apply chaos     {"id": "busybox/busybox-1/busybox"}
     2021-06-25T06:02:12.754Z        INFO    helloworldchaos Apply helloworld chaos
     ```

   - 查看 Chaos Daemon 的日志:

     ```bash
     kubectl logs chaos-daemon-{pod-post-fix} -n chaos-mesh
     ```

     查找以下内容:

     ```log
     2021-06-25T06:25:13.048Z        INFO    chaos-daemon-server     ExecHelloWorldChaos     {"request": "container_id:\"containerd://af1b99df3513c49c4cab4f12e468ed1d7a274fe53722bd883256d8f65bc9f681\""}
     2021-06-25T06:25:13.050Z        INFO    background-process-manager      build command   {"command": "/usr/local/bin/nsexec -m /proc/243383/ns/mnt -- sh -c ps aux"}
     2021-06-25T06:25:13.056Z        INFO    chaos-daemon-server     cmd output      {"output": "PID   USER     TIME  COMMAND\n    1 root      0:00 sleep 3600\n"}
     2021-06-25T06:25:13.070Z        INFO    chaos-daemon-server     ExecHelloWorldChaos     {"request": "container_id:\"containerd://88f6a469e5da82b48dc1190de07a2641b793df1f4e543a5958e448119d1bec11\""}
     2021-06-25T06:25:13.072Z        INFO    background-process-manager      build command   {"command": "/usr/local/bin/nsexec -m /proc/243479/ns/mnt -- sh -c ps aux"}
     2021-06-25T06:25:13.076Z        INFO    chaos-daemon-server     cmd output      {"output": "PID   USER     TIME  COMMAND\n    1 root      0:00 sleep 3600\n"}
     ```

     可以看到两条 `ps aux`，对应两个不同的 Pod。

     :::note 提示

     如果你的集群有多个节点，你会发现有不止一个 Chaos Daemon Pod。试着查看每一个 Chaos Daemon Pod 的日志，寻找真正被调用的那一个。

     :::

## 探索更多

在完成上述步骤后，HelloWorldChaos 已经成为一种有实际作用的混沌实验。如果你在这一过程中遇到了问题，请在 GitHub 创建一个 [issue](https://github.com/pingcap/chaos-mesh/issues) 向 Chaos Mesh 团队反馈。

你可能很好奇这一切是如何生效的。可以试着看看 `controllers` 目录下的各类 `controller`，它们有自己的 README（如 [controllers/common/README.md](https://github.com/chaos-mesh/chaos-mesh/blob/master/controllers/common/README.md)）。你可以通过这些 README 了解每个 controller 的功能，也可以阅读 [Chaos Mesh  架构](architecture.md)了解 Chaos Mesh 背后的原理。

你已经准备好成为一名真正的 Chaos Mesh 开发者了！到 [Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh) 里找一找练手的任务吧！推荐你先从简单的入手，例如这些 [good first issues](https://github.com/chaos-mesh/chaos-mesh/labels/good%20first%20issue)。
