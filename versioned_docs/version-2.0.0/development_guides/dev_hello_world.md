---
id: develop_a_new_chaos
title: Develop a New Chaos
sidebar_label: Develop a New Chaos
---

After [preparing the development environment](setup_env.md), let's develop a new type of chaos, HelloWorldChaos, which only prints a "Hello World!" message to the log. Generally, to add a new chaos type for Chaos Mesh, you need to take the following steps:

- [Define the schema type](#define-the-schema-type)
- [Register the CRD](#register-the-crd)
- [Register the handler for this chaos object](#register-the-handler-for-this-chaos-object)
- [Make the Docker image](#make-the-docker-image)
- [Run chaos](#run-chaos)
- [Next steps](#next-steps)

## Define the schema type

To define the schema type for the new chaos object, add `helloworldchaos_types.go` in the api directory [`api/v1alpha1`](https://github.com/chaos-mesh/chaos-mesh/tree/master/api/v1alpha1) and fill it with the following content:

```go
package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// +kubebuilder:object:root=true
// +chaos-mesh:base

// HelloWorldChaos is the Schema for the helloworldchaos API
type HelloWorldChaos struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   HelloWorldChaosSpec   `json:"spec"`
	Status HelloWorldChaosStatus `json:"status,omitempty"`
}

// HelloWorldChaosSpec is the content of the specification for a HelloWorldChaos
type HelloWorldChaosSpec struct {
	// Duration represents the duration of the chaos action
	// +optional
	Duration *string `json:"duration,omitempty"`

	PodSelector `json:",inline"`
}

// HelloWorldChaosStatus represents the status of a HelloWorldChaos
type HelloWorldChaosStatus struct {
	ChaosStatus `json:",inline"`
}

func (obj *HelloWorldChaos) GetSelectorSpecs() map[string]interface{} {
	return map[string]interface{}{
		".": &obj.Spec.PodSelector,
	}
}

```

With this file added, the HelloWorldChaos schema type is defined. The structure of it can be described as the YAML file below:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: HelloWorldChaos
metadata:
  name: <name-of-this-resource>
  namespace: <ns-of-this-resource>
spec:
  duration: <duration-of-the-action>

status:
  conditions: <conditions-of-this-resource>
  experiment:
    desiredPhase: <desired-phase-of-this-resource>
    records: <running-state-of-every-selected-targets>
```

`make generate` will generate boilerplate functions for it, which is needed to integrate the resource in the Chaos Mesh.

## Register the CRD

The HelloWorldChaos object is a custom resource object in Kubernetes. This means you need to register the corresponding CRD in the Kubernetes API. Run `make yaml`, then the CRD will be generated in `config/crd/bases/chaos-mesh.org_helloworldchaos.yaml`. In order to combine all these YAML file into `manifests/crd.yaml`, modify [`kustomization.yaml`](https://github.com/chaos-mesh/chaos-mesh/blob/master/config/crd/kustomization.yaml) by adding the corresponding line as shown below:

```yaml
resources:
  - bases/chaos-mesh.org_podchaos.yaml
  - bases/chaos-mesh.org_networkchaos.yaml
  - bases/chaos-mesh.org_iochaos.yaml
  - bases/chaos-mesh.org_helloworldchaos.yaml # this is the new line
```

Run `make yaml` again, and the definition of HelloWorldChaos will show in `manifests/crd.yaml`. You can check it through `git diff`

## Register the handler for this chaos object

Register this newly created chaos type in `controllers/types/types.go`, to make it controlled by most existing controllers. It could be done by adding following arguments to the `fx.Supply`:

```go
fx.Annotated{
  Group: "objs",
  Target: Object{
    Name:   "helloworldchaos",
    Object: &v1alpha1.HelloWorldChaos{},
  },
},
```

Then you need to implement this chaos. Create file `controllers/chaosimpl/helloworldchaos/impl.go` and fill it with following codes:

```go
package helloworldchaos

import (
	"context"

	"github.com/go-logr/logr"
	"go.uber.org/fx"
	"sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/chaos-mesh/chaos-mesh/api/v1alpha1"
	"github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/gcpchaos/diskloss"
	"github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/gcpchaos/nodereset"
	"github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/gcpchaos/nodestop"
)

type Impl struct {
	client.Client
	Log logr.Logger
}

func (impl *Impl) Apply(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
	impl.Log.Info("Hello World", "current-pod", records[index].Id)
	return v1alpha1.Injected, nil
}

func (impl *Impl) Recover(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
	return v1alpha1.NotInjected, nil
}

func NewImpl(c client.Client, log logr.Logger) *common.ChaosImplPair {
	return &common.ChaosImplPair{
		Name:   "helloworldchaos",
		Object: &v1alpha1.HelloWorldChaos{},
		Impl: &Impl{
			Client: c,
			Log:    log.WithName("helloworldchaos"),
		},
		ObjectList: &v1alpha1.HelloWorldChaosList{},
	}
}

var Module = fx.Provide(
	fx.Annotated{
		Group:  "impl",
		Target: NewImpl,
	})
```

You should also register this implementation in `controllers/chaosimpl/fx.go` by importing `github.com/chaos-mesh/chaos-mesh/controllers/chaosimpl/helloworldchaos` and adding `helloworldchaos.Module` in the `fx.Options` arguments.

## Make the Docker image

Having the object successfully added, you can make a Docker image:

```bash
make
```

Then push it to your registry:

```bash
make docker-push
```

If your Kubernetes cluster is deployed by Kind, you need to load images to Kind:

```bash
kind load docker-image localhost:5000/pingcap/chaos-mesh:latest
kind load docker-image localhost:5000/pingcap/chaos-daemon:latest
kind load docker-image localhost:5000/pingcap/chaos-dashboard:latest
```

## Run chaos

You are almost there. In this step, you will pull the image and apply it for testing.

Before you pull any image for Chaos Mesh (using `helm install` or `helm upgrade`), modify [`values.yaml`](https://github.com/chaos-mesh/chaos-mesh/blob/master/helm/chaos-mesh/values.yaml) of the helm template to replace the default image with what you just pushed to your local registry.

In this case, the template uses `pingcap/chaos-mesh:latest` as the default target registry, so you need to replace it with the environment variable `DOCKER_REGISTRY`'s value(default `localhost:5000`), as shown below:

```yaml
clusterScoped: true

# Also see clusterScoped and controllerManager.serviceAccount
rbac:
  create: true

controllerManager:
  serviceAccount: chaos-controller-manager
  ...
  image: localhost:5000/pingcap/chaos-mesh:latest
  ...
chaosDaemon:
  image: localhost:5000/pingcap/chaos-daemon:latest
  ...
dashboard:
  image: localhost:5000/pingcap/chaos-dashboard:latest
  ...
```

Now take the following steps to run chaos:

1. Create namespace `chaos-testing`

   ```bash
   kubectl create namespace chaos-testing
   ```

2. Get the related custom resource type for Chaos Mesh:

   ```bash
   kubectl create -f manifests/crd.yaml
   ```

   You can see CRD `helloworldchaos` is created:

   ```log
   customresourcedefinition.apiextensions.k8s.io/helloworldchaos.chaos-mesh.org created
   ```

   Now you can get the CRD using the command below:

   ```bash
   kubectl get crd helloworldchaos.chaos-mesh.org
   ```

3. Install Chaos Mesh:

   - For helm 3.X

     ```bash
     helm install chaos-mesh helm/chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
     ```

   - For helm 2.X

     ```bash
     helm install helm/chaos-mesh --name=chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
     ```

   To verify your installation, get pods from the `chaos-testing` namespace:

   ```bash
   kubectl get pods --namespace chaos-testing -l app.kubernetes.io/instance=chaos-mesh
   ```

   > **Note:**
   >
   > Arguments `--set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock` are used to to support network chaos on kind.

4. Create `chaos.yaml` in any location with the lines below:

   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: HelloWorldChaos
   metadata:
     name: hello-world
     namespace: chaos-testing
   spec:
     mode: all
     selector: {}
   ```

5. Apply the chaos:

   ```bash
   kubectl apply -f /path/to/chaos.yaml
   ```

   ```bash
   kubectl get HelloWorldChaos -n chaos-testing
   ```

   Now you should be able to check the `Hello World!` result in the log of of `chaos-controller-manager`:

   ```bash
   kubectl logs chaos-controller-manager-{pod-post-fix} -n chaos-testing
   ```

   The log is as follows:

   ```log
   2021-07-02T04:12:53.803Z        INFO    helloworldchaos Hello World     {"current-pod": "chaos-testing/chaos-daemon-lhjm5"}
   ```

   > **Note:**
   >
   > `{pod-post-fix}` is a random string generated by Kubernetes. You can check it by executing `kubectl get pod -n chaos-testing`.

## Next steps

Congratulations! You have just added a chaos type for Chaos Mesh successfully. Let us know if you run into any issues during the process. If you feel like doing other types of contributions, refer to [Add facilities to chaos daemon](add_chaos_daemon.md).
