---
id: run_e2e_tests
title: Run E2E Tests
sidebar_label: Run E2E Tests
---

We build our e2e framework based on [kubetest2](https://github.com/kubernetes-sigs/kubetest2) and [ginkgo](https://onsi.github.io/ginkgo/). There are several ways to run e2e tests.

## Run e2e tests on your local-machine

You could run full e2e tests on your local machine, just execute `./hack/e2e.sh`. It only needs docker installed on your machine.

It will take about 20~30 minutes to finish all the test cases.

## Run e2e tests on an existing cluster

If you just want to run apart of test cases, or want to run it on an existing cluster, that's a common requirement during developing e2e tests or testing compatible between chaos-mesh and cloud-provided kubernetes cluster.

It supposes that chaos-mesh is already installed on your cluster, you could follow this [document](https://chaos-mesh.org/docs/user_guides/installation) to install chaos-mesh.

There are several images needed by e2e tests, for example:

- pingcap/e2e-helper:latest
- nginx:latest

Some of them are public docker images like `nginx:latest`, kubernetes will pull it from docker registry, so they could be ignored.

Others are private or already changed with your changes, so you need manually preparing these images.

You could build e2e-helper docker images by

```shell
DOCKER_REGISTRY="" make image-e2e-helper
```

Then you should load this docker image to all nodes in the cluster. You could do this with

```shell
minikube cache add pingcap/e2e-helper:latest
```

or

```shell
kind load docker-image pingcap/e2e-helper:latest
```

After that, you could execute e2e tests by

```shell
make e2e-build
./test/image/e2e/bin/ginkgo ./test/image/e2e/bin/e2e.test
```
