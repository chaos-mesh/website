---
title: Add New Chaos Experiment Type
sidebar_label: Add New Chaos Experiment Type
---

This document describes how to add a new chaos experiment type.

The following walks you through an example of HelloWorldChaos, a new chaos experiment type that prints `Hello World!` to the log. The steps include:

- Step 1: Define the schema type
- Step 2: Register the CRD
- Step 3: Register the event handler for this chaos object
- Step 4: Build the Docker image
- Step 5: Run the chaos experiment

## Step 1: Define the schema type

1. Add `helloworldchaos_types.go` in the API directory `api/v1alpha1` with the following content:

    ```go
    package v1alpha1
    
    import (
        metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
    )
    
    // +kubebuilder:object:root=true
    // +chaos-mesh:base
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

    This file defines the schema type of HelloWorldChaos, which can be described in a YAML file:

    ```yaml
    apiVersion: chaos-mesh. rg/v1alpha1
    kind: HelloWorldChaos
    metadata:
      name: <resource name>
      name: <namespace>
    spec:
      duration: <duration>
    status:
      experiment: <experimental status>
    ...
    ```

2. Run `make generate` in the root directory of Chaos Mesh, which generates a boilerplate for Chaos Mesh to compile.

## Step 2: Register the CRD

You need to register the CRD (Custom Resource Definition) of HelloWorldChaos to interact it with Kubernetes API.

1. Run `make yaml` in the root directory. The generated YAML file is at `config/crd/bases/chaos-mesh.org_helloworldchaos.yaml`.

2. To combine this YAML file into `manifests/crd.yaml`, add a new line in `config/crd/kustomization.yaml`:

    ```yaml
    resources:
      - bases/chaos-mesh.org_podchaos.yaml
      - bases/chaos-mesh.org_networkchaos.yaml
      - bases/chaos-mesh.org_iochaos.yaml
      - bases/chaos-mesh.org_helloworldchaos.yaml # This is the new line
    ```

3. Run `make yaml`. You can see the definition of HelloWorldChaos in `manifests/crd.yaml`. To confirm, you can use the `git diff` command.

## Step 3: Register the event handler for this chaos object

1. Create a new file `controllers/chaosimpl/helloworldchaos/types.go` with the following content:

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
        decoder *utils.ContianerRecordDecoder
    }

    // This corresponds to the Apply phase of HelloWorldChaos. The execution of HelloWorldChaos will be triggered.
    func (impl *Impl) Apply(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
        impl.Log.Info("Hello world!")
        return v1alpha1.Injected, nil
    }

    // This corresponds to the Recover phase of HelloWorldChaos. The reconciler will be triggered to recover the chaos action.
    func (impl *Impl) Recover(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
        impl.Log.Info("Goodbye world!")
        return v1alpha1.NotInjected, nil
    }

    func NewImpl(c client.Client, log logr.Logger, decoder *utils.ContianerRecordDecoder) *common.ChaosImplPair {
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

2. Chaos Mesh uses the [fx](https://github.com/uber-go/fx) library for dependency injection. To register HelloWorldChaos in the Controller Manager, add a line in `controllers/chaosimpl/fx.go`:

    ```go
        ...
        gcpchaos.Module,
        stresschaos.Module,
        jvmchaos.Module,
        timechaos.Module,
        helloworldchaos.Module //Add a new line. Make sure you have imported HelloWorldChaos to this file first.
    ```

  In `controllers/types/types.go`, add the following content:

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

## Step 4: Build the Docker image

1. Build the Docker image:

    ```bash
    make
    ```

2. Push the image to your local Docker Registry:

    ```bash
    make docker-push
    ```

3. If you deploy Kubernetes clusters using kind, then you need to load images into kind:

    ```bash
    kind load docker-image localhost:5000/pingcap/chaos-mesh:latest
    kind load docker-image localhost:5000/pingcap/chaos-daemon:latest
    kind load docker-image localhost:5000/pingcap/chaos-dashboard:latest
    ```

## Step 5: Run the chaos experiment

In this step, you need to deploy Chaos Mesh to test HelloWorldChaos.

Before you pull any image for Chaos Mesh (using `helm install` or `helm upgrade`), modify the helm template `helm/chaos-mesh/values.yaml` to replace the default image with what you just pushed to your local Docker registry.

The templates in Chaos Mesh use `pingcap/chaos-mesh:latest` as the default Registry. You need to set the path with the environment variable of `DOCKER_REGISTRY` (The default value is `localhost:5000`), as shown below:

```yaml
controllerManager:
  image: localhost:5000/pingcap/chaos-mesh:latest
  ...
chaosDaemon:
  image: localhost:5000/pingcap/chaos-daemon:latest
  ...
dashboard:
  image: localhost:5000/pingcap/chaos-dashboard:latest
  ...
```

After you update the template, try running HelloWorldChaos.

1. Register the CRD in your cluster:

    ```bash
    kubectl create -f manifests/crd.yaml
    ```

    You can see HelloWorldChaos is created from the output:

    ```log
    customresourcedefinition.apiextensions.k8s.io/helloworldchaos.chaos-mesh.org created
    ```

    Now you can get the CRD of HelloWorldChaos using the command below:

    ```bash
    kubectl get crd helloworldchaos.chaos-mesh.org
    ```

2. Deploy Chaos Mesh:

    ```bash
    helm install chaos-mesh helm/chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
    ```

    To verify whether the deployment is successful, you can check all Pods in the `chaos-testing` namespace:

    ```bash
    kubectl get pods --namespace chaos-testing -l app.kubernetes.io/instance=chaos-mesh
    ```

    :::note
    Arguments `--set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock` are used to to run NeteworkChaos on kind.
    :::

3. Deploy the Pod for testing:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/chaos-mesh/apps/master/ping/busybox-statefulset.yaml
    ```

    Make sure the Pod for testing works properly.

4. Create a `chaos.yaml` file in any location with the following content:

    ```yaml
    apiVersion: chaos-mesh.org/v1alpha1
    kind: HelloWorldChaos
    metadata:
      name: hello-world
      namespace: chaos-testing
    spec:
      selector:
        namespaces:
          - busybox
      mode: one
      duration: 1h
    ```

5. Run the chaos experiment:

    ```bash
    kubectl apply -f /path/to/chaos.yaml
    ```

    ```bash
    kubectl get HelloWorldChaos -n chaos-testing
    ```

    Now you can see `Hello World!` in the logs of `chaos-controller-manager`:

    ```bash
    kubectl logs chaos-controller-manager-{pod-post-fix} -n chaos-testing
    ```

    Example output:

    ```log
    2021-06-24T06:42:26.858Z        INFO    records apply chaos     {"id": "chaos-testing/chaos-daemon-vsmc5"}
    2021-06-24T06:42:26.858Z        INFO    helloworldchaos Hello World!
    ```

    :::note
    `{pod-post-fix}` is a random string generated by Kubernetes. You can check it by executing `kubectl get pod -n chaos-testing`.
    :::

## What's Next

If you encounter any problems during the process, raise an [issue](https://github.com/pingcap/chaos-mesh/issues) in the Chaos Mesh repository.

If you want to dive deep into developing new chaos experiment types, refer to [Extend Chaos Daemon interface](extend-chaos-daemon-interface.md).