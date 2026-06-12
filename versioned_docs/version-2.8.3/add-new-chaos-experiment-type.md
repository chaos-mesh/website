---
title: Add a New Chaos Experiment Type
---

import PickHelmVersion from '@site/src/components/PickHelmVersion'

This document describes how to add a new chaos experiment type.

The following walks you through an example of `HelloWorldChaos`, a new chaos experiment type that prints `Hello world!` to the log. The steps include:

- [Step 1: Define the schema of HelloWorldChaos](#step-1-define-the-schema-of-helloworldchaos)
- [Step 2: Register the CRD](#step-2-register-the-crd)
- [Step 3: Register the event handler for helloworld objects](#step-3-register-the-event-handler-for-helloworldchaos-objects)
- [Step 4: Build Docker images](#step-4-build-docker-images)
- [Step 5: Run HelloWorldChaos](#step-5-run-helloworldchaos)

## Step 1: Define the schema of HelloWorldChaos

1. Add `helloworldchaos_types.go` to the `api/v1alpha1` API directory with the following content:

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

   // HelloWorldChaosStatus defines the observed state of HelloWorldChaos
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

   This file defines the schema type of `HelloWorldChaos`, which can be described in a YAML file:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: HelloWorldChaos
   metadata:
     name: <resource name>
     namespace: <namespace>
   spec:
     duration: <duration>
   #...
   ```

## Step 2: Register the CRD

You need to register the CRD (Custom Resource Definition) of `HelloWorldChaos` to interact it with Kubernetes API.

1. To combine the CRD into manifests/crd.yaml, append `config/crd/bases/chaos-mesh.org_helloworldchaos.yaml` we generated in the previous step to `config/crd/kustomization.yaml`:

   ```yaml
   resources:
     - bases/chaos-mesh.org_podchaos.yaml
     - bases/chaos-mesh.org_networkchaos.yaml
     - bases/chaos-mesh.org_iochaos.yaml
     - bases/chaos-mesh.org_helloworldchaos.yaml # This is the new line
   ```

2. Run `make generate` in the root directory of Chaos Mesh, which generates a boilerplate of `HelloWorldChaos` for Chaos Mesh to compile:

   ```bash
   make generate
   ```

   Then you can see the definition of `HelloWorldChaos` in `manifests/crd.yaml`.

## Step 3: Register the event handler for helloworldchaos objects

1. Create a new file `controllers/chaosimpl/helloworldchaos/types.go` with the following content:

   ```go
   package helloworldchaos

   import (
           "context"

           "github.com/go-logr/logr"
           "go.uber.org/fx"
           "sigs.k8s.io/controller-runtime/pkg/client"

           "github.com/chaos-mesh/chaos-mesh/api/v1alpha1"
           impltypes "github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/types"
           "github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/utils"
   )

   var _ impltypes.ChaosImpl = (*Impl)(nil)

   type Impl struct {
           client.Client
           Log logr.Logger

           decoder *utils.ContainerRecordDecoder
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

   // NewImpl returns a new HelloWorldChaos implementation instance.
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

2. Chaos Mesh uses the [fx](https://github.com/uber-go/fx) library for dependency injection. To register `HelloWorldChaos` in the controller manager, add a line to `controllers/chaosimpl/fx.go`:

   ```go
   var AllImpl = fx.Options(
           gcpchaos.Module,
           stresschaos.Module,
           jvmchaos.Module,
           timechaos.Module,
           helloworldchaos.Module // Add a new line. Make sure you have imported helloworldchaos first.
           //...
   )
   ```

   Then in `controllers/types/types.go`, append the following content into `ChaosObjects`:

   ```go
   var ChaosObjects = fx.Supply(
          //...
          fx.Annotated{
                  Group: "objs",
                  Target: Object{
                          Name:   "helloworldchaos",
                          Object: &v1alpha1.HelloWorldChaos{},
                  },
          },
   )
   ```

## Step 4: Build Docker images

1. Build the production images:

   ```bash
   make image
   ```

2. If you deploy the Kubernetes cluster using minikube, then you need to load images into the cluster:

   ```bash
   minikube image load ghcr.io/chaos-mesh/chaos-dashboard:latest
   minikube image load ghcr.io/chaos-mesh/chaos-mesh:latest
   minikube image load ghcr.io/chaos-mesh/chaos-daemon:latest
   ```

## Step 5: Run HelloWorldChaos

In this step, you need to deploy Chaos Mesh with your latest changes to test HelloWorldChaos.

1. Register the CRD in your cluster:

   ```bash
   kubectl create -f manifests/crd.yaml
   ```

   You can see `HelloWorldChaos` is created from the output:

   ```log
   customresourcedefinition.apiextensions.k8s.io/helloworldchaos.chaos-mesh.org created
   ```

   Now you can get the CRD of `HelloWorldChaos` using the command below:

   ```bash
   kubectl get crd helloworldchaos.chaos-mesh.org
   ```

2. Deploy Chaos Mesh:

   ```bash
   helm install chaos-mesh helm/chaos-mesh -n=chaos-mesh --set controllerManager.leaderElection.enabled=false,dashboard.securityMode=false
   ```

   To verify the deployment is successful, you can check all Pods in the `chaos-mesh` namespace:

   ```bash
   kubectl get pods --namespace chaos-mesh -l app.kubernetes.io/instance=chaos-mesh
   ```

3. Deploy a deployment for testing, we can use an example echo server from minikube docs:

   ```bash
   kubectl create deployment hello-minikube --image=kicbase/echo-server:1.0
   ```

   Wait to see the pod is running:

   ```bash
   kubectl get pods
   ```

   Example output:

   ```log
   NAME                              READY   STATUS    RESTARTS   AGE
   hello-minikube-77b6f68484-dg4sw   1/1     Running   0          2m
   ```

4. Create a `hello.yaml` file with the following content:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: HelloWorldChaos
   metadata:
     name: hello-world
     namespace: chaos-mesh
   spec:
     selector:
       labelSelectors:
         app: hello-minikube
     mode: one
     duration: 1h
   ```

5. Run:

   ```bash
   kubectl apply -f hello.yaml
   # helloworldchaos.chaos-mesh.org/hello-world created
   ```

   Now you can check if `chaos-controller-manager` has `Hello world!` in its logs:

   ```bash
   kubectl logs -n chaos-mesh chaos-controller-manager-xxx
   ```

   Example output:

   ```txt
   2023-07-16T06:19:40.068Z INFO records records/controller.go:149 apply chaos {"id": "default/hello-minikube-77b6f68484-dg4sw/echo-server"}
   2023-07-16T06:19:40.068Z INFO helloworldchaos helloworldchaos/types.go:26 Hello world!
   ```

## What's Next

If you encounter any problems during the process, create an [issue](https://github.com/chaos-mesh/chaos-mesh/issues) in the Chaos Mesh repository.

In the next section, we'll learn more about how to extend the behavior of `HelloWorldChaos`.
