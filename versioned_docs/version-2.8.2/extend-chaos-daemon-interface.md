---
title: Extend Chaos Daemon Interface
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

In [Add a new chaos experiment type](add-new-chaos-experiment-type.md), you have added `HelloWorldChaos`, which can print `Hello world!` in the logs of Chaos Controller Manager.

To enable the `HelloWorldChaos` to inject some faults into the target Pod, you need to extend Chaos Daemon interface.

:::tip

It's recommended to read [the architecture of Chaos Mesh](./overview.md#architecture-overview) before you go forward.

:::

This document covers:

- [Selector](#selector)
- [Implement the gRPC interface](#implement-the-grpc-interface)
- [Verify the output of HelloWorldChaos](#verify-the-output-of-helloworldchaos)
- [Next steps](#next-steps)

## Selector

In `api/v1alpha1/helloworldchaos_type.go`, you have defined `HelloWorldSpec`, which includes `ContainerSelector`:

```go
// HelloWorldChaosSpec defines the desired state of HelloWorldChaos
type HelloWorldChaosSpec struct {
        // ContainerSelector specifies the target for injection
        ContainerSelector `json:",inline"`

        // Duration represents the duration of the chaos
        // +optional
        Duration *string `json:"duration,omitempty"`

        // RemoteCluster represents the remote cluster where the chaos will be deployed
        // +optional
        RemoteCluster string `json:"remoteCluster,omitempty"`
}

//...

// GetSelectorSpecs is a getter for selectors
func (obj *HelloWorldChaos) GetSelectorSpecs() map[string]interface{} {
        return map[string]interface{}{
                ".": &obj.Spec.ContainerSelector,
        }
}
```

In Chaos Mesh, Selector is used to define the scope of a chaos experiment, the target namespace, the annotation, the label, etc.

Selector can also be some more specific values (e.g. `AWSSelector` in `AWSChaos`). Normally each chaos experiment needs only one selector, with exceptions like `NetworkChaos` because it sometimes needs two selectors as two objects for network partitioning.

You can refer to [Define the Scope of Chaos Experiments](./define-chaos-experiment-scope.md) for more information about Selector.

## Implement the gRPC interface

To allow Chaos Daemon to accept the requests from Chaos Controller Manager, you need to implement a new gRPC interface.

1. Add the RPC in `pkg/chaosdaemon/pb/chaosdaemon.proto`:

   ```proto
   service ChaosDaemon {
      ...

      rpc ExecHelloWorldChaos(ExecHelloWorldRequest) returns (google.protobuf.Empty) {}
   }

   message ExecHelloWorldRequest {
      string container_id = 1;
   }
   ```

   Then you need to update the related `chaosdaemon.pb.go` file by running the following command:

   ```bash
   make proto
   ```

2. Implement gRPC services in Chaos Daemon.

   In the `pkg/chaosdaemon` directory, create a file named `helloworld_server.go` with the following contents:

   ```go
   package chaosdaemon

   import (
           "context"

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

           cmd := bpm.DefaultProcessBuilder("sh", "-c", "ps aux").
                   SetContext(ctx).
                   SetNS(pid, bpm.MountNS).
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

   After `chaos-daemon` receives the `ExecHelloWorldChaos` request, you can see a list of processes in the current container.

3. Send a gRPC request when applying the chaos experiment.

   Every chaos experiment has a life cycle: `apply` and then `recover`. However, there are some chaos experiments that cannot be recovered by default (for example, PodKill in PodChaos and HelloWorldChaos). These are called OneShot experiments. You can find `+chaos-mesh:oneshot=true`, which we have defined in the `HelloWorldChaos` schema.

   The chaos controller manager needs to send a request to the chaos daemon when `HelloWorldChaos` is in the `apply` phase. This is done by updating `controllers/chaosimpl/helloworldchaos/types.go`:

   ```go
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

   func (impl *Impl) Recover(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
           impl.Log.Info("Recover helloworld chaos")
           return v1alpha1.NotInjected, nil
   }
   ```

   :::info

   There is no need to recover `HelloWorldChaos` because `HelloWorldChaos` is a **OneShot** experiment. For the type of chaos experiment you develop, you can implement the logic of the recovery function as needed.

   :::

## Verify the output of HelloWorldChaos

Now you can verify the output of `HelloWorldChaos`:

1. Build Docker images as we described in [Add a new chaos experiment type](add-new-chaos-experiment-type.md#step-4-build-docker-images), then load them into your cluster.

   :::note

   If you're using minikube, some versions of minikube cannot overwrite the existing images with the same tag. You may delete the existing images before loading the new ones.

   :::

2. Update Chaos Mesh:

   <PickHelmVersion>{`helm upgrade chaos-mesh helm/chaos-mesh -n=chaos-mesh --set controllerManager.leaderElection.enabled=false,dashboard.securityMode=false`}</PickHelmVersion>

3. Deploy a Pod for testing:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/chaos-mesh/apps/master/ping/busybox-statefulset.yaml
   ```

4. Create a `hello-busybox.yaml` file with the following content:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: HelloWorldChaos
   metadata:
     name: hello-busybox
     namespace: chaos-mesh
   spec:
     selector:
       namespaces:
         - busybox
     mode: all
     duration: 1h
   ```

5. Run:

   ```bash
   kubectl apply -f hello-busybox.yaml
   # helloworldchaos.chaos-mesh.org/hello-busybox created
   ```

   - Now you can check if `chaos-controller-manager` has `Apply helloworld chaos` in its logs:

     ```bash
     kubectl logs -n chaos-mesh chaos-controller-manager-xxx
     ```

     Example output:

     ```log
     2023-07-16T08:20:46.823Z INFO records records/controller.go:149 apply chaos {"id": "busybox/busybox-0/busybox"}
     2023-07-16T08:20:46.823Z INFO helloworldchaos helloworldchaos/types.go:27 Apply helloworld chaos
     ```

   - Check the logs of Chaos Daemon:

     ```bash
     kubectl logs -n chaos-mesh chaos-daemon-xxx
     ```

     Example output:

     ```log
     2023-07-16T08:20:46.833Z INFO chaos-daemon.daemon-server chaosdaemon/server.go:187 ExecHelloWorldChaos {"namespacedName": "chaos-mesh/hello-busybox", "request": "container_id:\"docker://5e01e76efdec6aa0934afc15bb80e121d58b43c529a6696a01a242f7ac68f201\""}
     2023-07-16T08:20:46.834Z INFO chaos-daemon.daemon-server.background-process-manager.process-builder pb/chaosdaemon.pb.go:4568 build command {"namespacedName": "chaos-mesh/hello-busybox", "command": "/usr/local/bin/nsexec -m /proc/104710/ns/mnt -- sh -c ps aux"}
     2023-07-16T08:20:46.841Z INFO chaos-daemon.daemon-server chaosdaemon/server.go:187 cmd output {"namespacedName": "chaos-mesh/hello-busybox", "output": "PID   USER     TIME  COMMAND\n    1 root      0:00 sh -c echo Container is Running ; sleep 3600\n"}
     2023-07-16T08:20:46.856Z INFO chaos-daemon.daemon-server chaosdaemon/server.go:187 ExecHelloWorldChaos {"namespacedName": "chaos-mesh/hello-busybox", "request": "container_id:\"docker://bab4f632a0358529f7d72d35e014b8c2ce57438102d99d6174dd9df52d093e99\""}
     2023-07-16T08:20:46.864Z INFO chaos-daemon.daemon-server.background-process-manager.process-builder pb/chaosdaemon.pb.go:4568 build command {"namespacedName": "chaos-mesh/hello-busybox", "command": "/usr/local/bin/nsexec -m /proc/104841/ns/mnt -- sh -c ps aux"}
     2023-07-16T08:20:46.867Z INFO chaos-daemon.daemon-server chaosdaemon/server.go:187 cmd output {"namespacedName": "chaos-mesh/hello-busybox", "output": "PID   USER     TIME  COMMAND\n    1 root      0:00 sh -c echo Container is Running ; sleep 3600\n"}
     ```

   You will see two separate lines of `ps aux`, which are corresponding to two different Pods.

## Next steps

If you encounter any problems during the process, create an [issue](https://github.com/chaos-mesh/chaos-mesh/issues) in the Chaos Mesh repository.

If you are curious about how all this works, you can read the [controllers/README.md](https://github.com/chaos-mesh/chaos-mesh/blob/master/controllers/README.md) and code for different controllers next.

You are now ready to become a Chaos Mesh developer! Feel free to visit the [Chaos Mesh issues](https://github.com/chaos-mesh/chaos-mesh/issues) to find a [good first issue](https://github.com/chaos-mesh/chaos-mesh/labels/good%20first%20issue) and get started!
