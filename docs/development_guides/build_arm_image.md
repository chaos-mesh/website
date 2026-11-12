---
id: build_arm_image
title: Build ARM Image
sidebar_label: Build ARM Image
---

This document will talk about how to build an ARM image on a x86 host. With the help of docker, it won't be too difficult :)

## Prerequisites

* `qemu` has been installed on ths host to emulate arm program.
* `docker` > 19.03 with `buildx` installed. You can follow the [instruction](https://github.com/docker/buildx#installing) to install `buildx` toolkit for `docker`
* Linux Kernel >= 4.8
* Arm executables could be run with `binfmt_misc`. You can check it through `cat /proc/sys/fs/binfmt_misc/qemu-aarch64`. If not enabled, `docker run --rm --privileged docker/binfmt:a7996909642ee92942dcd6cff44b9b95f08dad64` can register qemu for running arm executables.

## Build

Run `TARGET_PLATFORM=arm64 UI=1 SWAGGER=1 DOCKER_REGISTRY="" make image` will build all arm image (`pingcap/chaos-mesh`, `pingcap/chaos-daemon`, `pingcap/chaos-dashboard`...). After building, you can check the architecture of them through `docker image inspect`

## Note

All functions haven't been well tested on arm, and the `IO/TimeChaos` will not work. If you have any other problem while running Chaos Mesh on an arm cluster, please file an issue on [github](https://github.com/chaos-mesh/chaos-mesh).