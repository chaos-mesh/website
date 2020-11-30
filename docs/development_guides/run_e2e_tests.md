---
id: run_e2e_tests
title: Run E2E Tests
sidebar_label: Run E2E Tests
---

## Overview

When developers contribute codes, here is a check for PR called "E2E tests" before PR could be merged.

E2E means "endpoint to endpoint", it tests chaos-mesh on a real Kubernetes from start to end, for keeping software's correctness and ensuring end-users experience.

Contributors could run e2e tests on a PR by commenting `/run-e2e-tests`, but it will take a long time for waiting until it's finished. If you want to run e2e on other specific kubernetes cluster, or you only want to focus on part of e2e tests, this document will help you.

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

> "KUBECONFIG" environment variable must be set before run e2e tests, you could also claim it like `KUBECONFIG=/path/to/your/kube/config./test/image/e2e/bin/ginkgo ./test/image/e2e/bin/e2e.test`

## Run specific part of e2e tests

Our e2e tests are built on [ginkgo](https://onsi.github.io/ginkgo/), we could use `--focus` for running part of e2e tests.

All e2e test cases are described like:

```go
ginkgo.Describe("[Basic]", func() {
  ginkgo.Context("[PodChaos]", func() {
    ginkgo.Context("[PodFailure]", func() {
      ginkgo.It("[Schedule]", func() {
        // test cases
      })
      ginkgo.It("[Pause]", func() {
        // test cases
      })
    })
  })
  ginkgo.Context("[NetworkChaos]", func() {
    ginkgo.Context("[NetworkPartition]", func() {
      ginkgo.It("[Schedule]", func() {
        // test cases
      })
    })
  })
})
```

We could use `./test/image/e2e/bin/ginkgo -focus="NetworkPartition" ./test/image/e2e/bin/e2e.test` for only running "NetworkPartition" e2e test case.
