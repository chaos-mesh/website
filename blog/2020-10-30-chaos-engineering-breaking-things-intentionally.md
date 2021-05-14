---
slug: /chaos-engineering-breaking-things-intentionally
title: Chaos Engineering - Breaking things Intentionally
author: Manish Dangi
author_url: https://www.linkedin.com/in/manishdangi/
author_image_url: https://avatars1.githubusercontent.com/u/43807816?s=400
image: /img/chaos-engineering2.png
tags: [Chaos Engineering, Chaos Mesh, Open Source]
---

![Chaos-Engineering-Breaking-things-Intentionally](/img/chaos-engineering2.png)

“Necessity is the mother of invention”; similarly, Netflix is not only a platform for online media streaming. Netflix gave birth to Chaos engineering because of their necessity.

<!--truncate-->

In 2008, Netflix [experienced a major database corruption](https://about.netflix.com/en/news/completing-the-netflix-cloud-migration). They couldn't deliver DVDs for three days. This encouraged Netflix engineers to think about their monolithic architecture’s migration to a distributed cloud-based architecture.

The new distributed architecture of Netflix composed of hundreds of microservices. Migration to distributed architecture solved their single point failure problem, but it gave rise to many other complexities requiring a more reliable and fault-tolerant system. At this point, Netflix engineers came up with an innovative idea to test the system’s fault tolerance without impacting customer service.

They created [Chaos Monkey](https://github.com/Netflix/chaosmonkey): a tool that causes random failures at different places with different intervals of time. With the development of Chaos Monkey, a new discipline arises: Chaos Engineering.

“Chaos Engineering is the discipline of experimenting on a system in order to build confidence in the system’s capability to withstand turbulent conditions in production.” - [Principle of Chaos](https://principlesofchaos.org/)

Chaos Engineering is an approach for learning how your system behaves by applying a discipline of empirical exploration. Just as scientists conduct experiments to study physical and social phenomena, Chaos Engineering uses experiments to learn about a particular system - the systems' reliability, stability, and capability to survive in unexpected or unstable conditions.

When we have a large-scale distributed system, failures could be caused by a number of factors like application failure, infrastructure failure, dependency failure, network failure, and many more. These failures could not be all covered by traditional methods such as integration testing or unit testing, which makes Chaos Engineering a necessity:

- To improve resiliency of the system
- To expose hidden threats and vulnerability of the system
- To figure out system weaknesses before they cause any failure in production

Lots of people think that they are not as big compared to Netflix and other tech giants; nor do they have any databases or systems of that scale.

They are probably right, but over the period, Chaos engineering has evolved so much that it’s no longer limited to digital companies like Netflix. To ensure consistent performance and constant availability of their systems, more and more companies from different industries are implementing chaos experiments.

## Chaos-Mesh

To test the resiliency and reliability of [TiDB](https://pingcap.com/products/tidb), engineers at [PingCAP](https://pingcap.com/) came up with a fantastic tool for Chaos testing called [Chaos Mesh](https://chaos-mesh.org/), a cloud-native Chaos Engineering platform that orchestrates chaos on Kubernetes environments.
Chaos Mesh takes into account the possible faults of a distributed system, covering the pod, the network, system I/O, and the kernel.

Chaos Mesh provides many fault injection methods:

- **clock-skew:** Simulates clock skew
- **container-kill:** Simulates the container being killed
- **cpu-burn:** Simulates CPU pressure
- **io-attribution-override:** Simulates file exceptions
- **io-fault:** Simulates file system I/O errors
- **io-latency:** Simulates file system I/O latency
- **kernel-injection:** Simulates kernel failures
- **memory-burn:** Simulates memory pressure
- **network-corrupt:** Simulates network packet corruption
- **network-duplication:** Simulates network packet duplication
- **network-latency:** Simulate network latency
- **network-loss:** Simulates network loss
- **network-partition:** Simulates network partition
- **pod-failure:** Simulates continuous unavailability of Kubernetes Pods
- **pod-kill:** Simulates the Kubernetes Pod being killed

Chaos Mesh mainly focuses on the simplicity of how all chaos tests are done quickly and easily understandable to anyone using it.

The recent [1.0 release](https://chaos-mesh.org/blog/chaos-mesh-1.0-chaos-engineering-on-kubernetes-made-easier/) provides the general availability of Chaos Dashboard, which Chaos simplifies the complexities of chaos experiment. With a few mouse clicks, you can define the Chaos experiment's scope, specify the type of chaos injection, define scheduling rules, and observe the chaos experiment results- all in the dashboard of Chaos Mesh.

In case you want to try Chaos Mesh in your browser, checkout [Katakoda interactive tutorial](https://chaos-mesh.org/interactive-tutorial), where you can get your hands on Chaos Mesh without even deploying it. To understand the design principles and how Chaos Mesh works, read [this blog](https://chaos-mesh.org/blog/chaos_mesh_your_chaos_engineering_solution) by the project's maintainer, [Cwen Yin](https://www.linkedin.com/in/cwen-yin-81985318b/).

## Join the community

Anyone who wants to explore the area of chaos engineering or Chaos Mesh are welcomed to join the Chaos Mesh community. Being a member of the Chaos Mesh community, I would like to say it is a lovely community where project maintainers love to engage and hear your views and suggestions for the improvement of the project and the community.

To join and learn more about Chaos Mesh, find the #project-chaos-mesh channel in [CNCF slack workspace](https://slack.cncf.io/).
