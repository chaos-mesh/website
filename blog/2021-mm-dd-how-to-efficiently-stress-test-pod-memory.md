---
slug: /how-to-efficiently-stress-test-pod-memory
title: 'How to efficiently stress test Pod memory'
author: Yinghao Wang
author_title: Contributor of Chaos Mesh
author_url: https://github.com/AsterNighT
author_image_url: https://avatars.githubusercontent.com/u/22937027?v=4
image: /img/how-to-efficiently-stress-test-pod-memory-banner.jpg
tags:  [Chaos Mesh, Chaos Engineering, StressChaos, Stress Testing]
---

![banner](/img/how-to-efficiently-stress-test-pod-memory-banner.jpg)

[Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh) includes the StressChaos tool, which allows you to inject CPU and memory stress into your Pod. This tool can be very useful when you test or benchmark a CPU-sensitive or memory-sensitive program and want to know its behavior under pressure.

However, as we tested and used StressChaos, we found some issues with usability and performance. For example, why does StressChaos use far less memory than we configured? To correct these issues, we developed a new set of tests. In this article, I'll describe how we troubleshooted these issues and corrected them. This information will enable you to get the most out of StressChaos.

<!--truncate-->

Before you continue, you need to install Chaos Mesh in your cluster. You can find detailed instructions on our [website](https://chaos-mesh.org/docs/user_guides/installation).

## Injecting stress into a target

I’d like to demonstrate how to inject StressChaos into a target. In this example, I’ll use [`hello-kubernetes`](https://github.com/paulbouwer/hello-kubernetes), which is managed by [helm charts](https://helm.sh/). The first step is to clone the [`hello-kubernetes`](https://github.com/paulbouwer/hello-kubernetes) repo and modify the chart to give it a resource limit.

```bash
git clone https://github.com/paulbouwer/hello-kubernetes.git
code deploy/helm/hello-kubernetes/values.yaml # or whichever editor you prefer
```

Find the resources line, and change it into:

```yaml
  resources:
    requests:
      memory: "200Mi"
    limits:
      memory: "500Mi"
```

However, before we inject anything, let's see how much memory the target is consuming. Go into the Pod and start a shell. Enter the following, substituting the name of your Pod for the one in the example:

```bash
kubectl exec -it -n hello-kubernetes hello-kubernetes-hello-world-b55bfcf68-8mln6 -- /bin/sh
```

Display a summary of memory usage. Enter:

```sh
/usr/src/app $ free -m
/usr/src/app $ top
```

As you can see from the output below, the Pod is consuming 4,269 MB of memory.

```sh
/usr/src/app $ free -m
              used
Mem:          4269
Swap:            0

/usr/src/app $ top
Mem: 12742432K used
  PID  PPID USER     STAT   VSZ %VSZ CPU %CPU COMMAND
    1     0 node     S     285m   2%   0   0% npm start
   18     1 node     S     284m   2%   3   0% node server.js
   29     0 node     S     1636   0%   2   0% /bin/sh
   36    29 node     R     1568   0%   3   0% top
```

That doesn’t seem right. We’ve limited its memory usage to 500 MiBs, and now the Pod seems to be using several GBs of memory. If we total the amount of process memory being used, it doesn’t equal 500 MiB. However, top and free at least give similar answers.

We will run a StressChaos on the Pod and see what happens. Here's the yaml we’ll use:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: mem-stress
  namespace: chaos-testing
spec:
  mode: all
  selector:
    namespaces:
      - hello-kubernetes
  stressors:
    memory:
      workers: 4
      size: 50MiB
      options: [""]
  duration: "1h"
```

Save the yaml to a file. I named it `memory.yaml`. To apply the chaos, run

```bash
~ kubectl apply -f memory.yaml
stresschaos.chaos-mesh.org/mem-stress created
```

Now, let's check the memory usage again.

```sh
              used
Mem:          4332
Swap:            0

Mem: 12805568K used
  PID  PPID USER     STAT   VSZ %VSZ CPU %CPU COMMAND
   54    50 root     R    53252   0%   1  24% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   57    52 root     R    53252   0%   0  22% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   55    53 root     R    53252   0%   2  21% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   56    51 root     R    53252   0%   3  21% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   18     1 node     S     289m   2%   2   0% node server.js
    1     0 node     S     285m   2%   0   0% npm start
   51    49 root     S    41048   0%   0   0% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   50    49 root     S    41048   0%   2   0% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   52    49 root     S    41048   0%   0   0% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   53    49 root     S    41048   0%   3   0% {stress-ng-vm} stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   49     0 root     S    41044   0%   0   0% stress-ng --vm 4 --vm-keep --vm-bytes 50000000
   29     0 node     S     1636   0%   3   0% /bin/sh
   48    29 node     R     1568   0%   1   0% top
```

You can see that stress-ng instances are being injected into the Pod. There is a 60 MiB rise in the Pod, which we didn’t expect. The [documentation](https://manpages.ubuntu.com/manpages/artful/man1/stress-ng.1.html#:~:text=is%20not%20available.-,--vm-bytes%20N,-mmap%20N%20bytes) indicates that the increase should 200 MiB (4 * 50 MiB).

Let's increase the stress by changing the memory stress from 50 MiB to 3,000 MiB. This should break the Pod’s memory limit. I’ll delete the chaos, modify the size, and reapply it.

And then, boom! The shell exits with code 137. A moment later, I reconnect to the container, and the memory usage returns to normal. No stress-ng instances are found! What happened?

## Why does StressChaos disappear?

Kubernetes limits your container memory usage through a mechanism named [cgroup](https://man7.org/linux/man-pages/man7/cgroups.7.html). To see the 500 MiB limit in our Pod, go to the container and enter:

```bash
/usr/src/app $ cat /sys/fs/cgroup/memory/memory.limit_in_bytes
524288000
```

The output is displayed in bytes and translates to `500 * 1024 * 1024`.

Requests are used only for scheduling where to place the Pod. The Pod does not have a memory limit or request, but it can be seen as the sum of all its containers.

We've been making a mistake since the very beginning. free and top are not "cgrouped." They rely on `/proc/meminfo` (procfs) for data. Unfortunately, `/proc/meminfo` is old, so old it predates cgroup. It will provide you with *host* memory information instead of your container. Let's start from the beginning and see what memory usage we get this time.

To get the cgrouped memory usage, enter:

```sh
/usr/src/app $ cat /sys/fs/cgroup/memory/memory.usage_in_bytes
39821312
```

Applying the 50 MiB StressChaos, yields the following:

```sh
/usr/src/app $ cat /sys/fs/cgroup/memory/memory.usage_in_bytes
93577216
```

That is about 51 MiB more memory usage than without StressChaos.

Next, why did our shell exit? Exit code 137 indicates "failure as container received SIGKILL." That leads us to check the Pod. Pay attention to the Pod state and events.

```bash
~ kubectl describe pods -n hello-kubernetes
......
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
......
Events:
  Type     Reason     Age                  From               Message
  ----     ------     ----                 ----               -------
......
  Warning  Unhealthy  10m (x4 over 16m)    kubelet            Readiness probe failed: Get "http://10.244.1.19:8080/": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
  Normal   Killing    10m (x2 over 16m)    kubelet            Container hello-kubernetes failed liveness probe, will be restarted
......
```

The events tell us why the shell crashed. `hello-kubernetes` has a liveness probe, and when the container memory is reaching the limit, the application starts to fail, and Kubernetes decides to terminate and restart it. When the Pod restarts, StressChaos stops. In that case, you can say that the chaos works fine. It finds vulnerability in your Pod. You could now fix it, and reapply the chaos. Everything seems perfect now—except for one thing. Why do four 50 MiB vm workers result in 51 MiB in total? The answer will not reveal itself unless we go into the stress-ng source code [here](https://github.com/ColinIanKing/stress-ng/blob/819f7966666dafea5264cf1a2a0939fd344fcf08/stress-vm.c#L2074) :

```c
vm_bytes /= args->num_instances;
```

Oops! So the document is wrong. The multiple vm workers will take up the total size specified, rather than `mmap` that much memory per worker. Now, finally, we get an answer for everything. In the following sections, we’ll discuss some other situations involving memory stress.

## What if there was no liveness probe?

Let's delete the probes and try again. Find the following lines in `deploy/helm/hello-kubernetes/templates/deployment.yaml` and delete them.

```yaml
livenessProbe:
  httpGet:
    path: /
    port: http
readinessProbe:
  httpGet:
    path: /
    port: http
```

After that, upgrade the deployment.

What is interesting in this scenario is that the memory usage goes up continuously, and then drops sharply; it goes back and forth. What is happening now? Let's check the kernel log. Pay attention to the last two lines.

```sh
/usr/src/app $ dmesg
......
[189937.362908] [ pid ]   uid  tgid total_vm      rss nr_ptes swapents oom_score_adj name
[189937.363092] [441060]  1000 441060    63955     3791      80     3030           988 node
[189937.363110] [441688]     0 441688   193367     2136     372   181097          1000 stress-ng-vm
......
[189937.363148] Memory cgroup out of memory: Kill process 443160 (stress-ng-vm) score 1272 or sacrifice child
[189937.363186] Killed process 443160 (stress-ng-vm), UID 0, total-vm:773468kB, anon-rss:152704kB, file-rss:164kB, shmem-rss:0kB
```

It’s clear from the output that the `stress-ng-vm` processes are being killed because there are out of memory (OOM) errors.

If processes can’t get the memory they want, things get tricky. They are very likely to fail. Rather than wait for processes to crash, it’s better if you kill some of them to get more memory. The OOM killer stops processes by an order and tries to recover the most memory while causing the least trouble. For detailed information on this process, see [this introduction](https://lwn.net/Articles/391222/) to OOM killer.

Looking at the output above, you can see that `node`, which is our application process that should never be terminated, has an `oom_score_adj` of 988. That is quite dangerous since it is the process with the highest score to get killed. But there is a simple way to stop the OOM killer from killing a specific process. When you create a Pod, it is assigned a Quality of Service (QoS) class. For detailed information, see [Configure Quality of Service for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/).

Generally, if you create a Pod with precisely-specified resource requests, it is classified as a `Guaranteed` Pod. OOM killers do not kill containers in a `Guaranteed` Pod if there are other things to kill. These entities include non-`Guaranteed` Pods and stress-ng workers. A Pod with no resource requests is marked as `BestEffort`, and the OOM killer stops it first.

So that's all for the tour. Our suggestion is that `free` and `top` should not be used to assess memory in containers. Be careful when you assign resource limits to your Pod and select the right QoS. In the future, we’ll create a more detailed StressChaos document.

## Deeper dive into Kubernetes memory management

Kubernetes tries to evict Pods that use too much memory (but not more memory than their limits). Kubernetes gets your Pod memory usage from `/sys/fs/cgroup/memory/memory.usage_in_bytes` and subtracts it by the `total_inactive_file` line in `memory.stat`.

Keep in mind that Kuberenetes **does not** support swap. Even if you have a node with swap enabled, Kubernetes creates containers with `swappiness=0`, which means swap is eventually disabled. That is mainly for performance concerns.

`memory.usage_in_bytes` equals `resident set` plus `cache`, and `total_inactive_file` is memory in cache that the OS can retrieve if the memory is running out. `memory.usage_in_bytes - total_inactive_file` is called `working_set`. You will get this `working_set` value by `kubectl top pod <your pod> --containers`. Kubernetes uses this value to decide whether or not to evict your Pods.

Kubernetes periodically inspects memory usage. If a container's memory usage increases too quickly or the container cannot be evicted, the OOM killer is invoked. Kubernetes has its way of protecting its own process, so it always picks the container. When a container is killed, it may or may not be restarted, depending on your restart policy. If it is killed, when you execute `kubectl describe pod <your pod>` you will see it is restarted and the reason is `OOMKilled`.

Another thing worth mentioning is the kernel memory. Since `v1.9`, Kubernetes’ kernel memory support is enabled by default. It is also a feature of cgroup memory subsystems. You can limit container kernel memory usage. Unfortunately, this causes a cgroup leak on kernel versions up to `v4.2`. You can either upgrade your kernel to `v4.3` or disable it.

## How we implement StressChaos

StressChaos is a simple way to test your container's behavior when it is low on memory. StressChaos utilizes a powerful tool named `stress-ng` to allocate memory and continue writing to the allocated memory. Because containers have memory limits and container limits are bound to a cgroup, we must find a way to run `stress-ng` in a specific cgroup. Luckily, this part is easy. With enough privileges, we can assign any process to any cgroup by writing to files in `/sys/fs/cgroup/`.

If you are interested in Chaos Mesh and would like to help us improve it, you're welcome to join our [Slack channel](https://slack.cncf.io/) (#project-chaos-mesh)! Or submit your pull requests or issues to our [GitHub repository](https://github.com/chaos-mesh/chaos-mesh).
