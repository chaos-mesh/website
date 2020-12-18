---
id: run_e2e_tests
title: Run E2E Tests
sidebar_label: Run E2E Tests
---

## Overview

To ensure the correctness of code contributions, we use  "endpoint to endpoint" (e2e) testing to test Chaos Mesh on a real Kubernetes cluster. This document walks you through how to run e2e tests for each code contribution that you make. 

## Run e2e tests on your local-machine

You could run  full e2e tests on your local machine by executing `./hack/e2e.sh`. It requires docker to be installed locally.

It generally takes about 20~30 minutes to finish all the test cases. Therefore, we do not recommend this method.

## Run e2e tests on an existing cluster

For common requirements such as developing e2e test cases or testing compatibilities between Chaos Mesh and Kubernetes clusters on the cloud, you would normally need to run 22e tests on an existing cluster. Take the following steps:

**Note:** Please make sure that Chaos Mesh is already installed on your local.

1. Get the required images as listed below

    - pingcap/e2e-helper:latest
    - nginx:latest
    ```

2. Build e2e-helper docker images by executing:

```shell
DOCKER_REGISTRY="" make image-e2e-helper
```

3. Load this docker image to all nodes in the cluster by executing:
:

```shell
minikube cache add pingcap/e2e-helper:latest
```

or

```shell
kind load docker-image pingcap/e2e-helper:latest
```

4. Now you should be able to execute e2e tests by executing:

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
