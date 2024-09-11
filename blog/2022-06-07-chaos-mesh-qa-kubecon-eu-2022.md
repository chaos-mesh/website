---
slug: /chaos-mesh-qa-at-kubecon-eu-2022
title: 'Chaos Mesh Q&A at KUBECON EU 2022'
authors: chaos-mesh
image: /img/blog/chaos-mesh-q&a.jpeg
tags: [Chaos Mesh, Chaos Engineering, KubeCon, CloudNativeCon]
---

![Chaos Mesh Q&A](/img/blog/chaos-mesh-q&a.jpeg)

At KubeCon EU 2022, the [Chaos Mesh](https://chaos-mesh.org/) team hosted two activities "Make Cloud Native Chaos Engineering Easier - Deep Dive into Chaos Mesh" and "office hours session". We are very grateful and enjoyed it with all of you very much. We shared with each other, got to know each other, and discussed a lot of things in depth.

<!--truncate-->

For the presentations, we gave a brief overview of Chaos Mesh, then delved into how Chaos Mesh is implemented and how it is practiced, and shared the team's latest explorations around chaos engineering and plans for Chaos Mesh's development.

For Office Hour, we introduced the Chaos Mesh project and its latest progress, and answered online questions from attendees.

Many thanks to each of our friends that came out to support us! And for Office Hour, we received some great questions and we decided to have a follow-up Q&A.

## Your questions answered

**Q: Does chaos play well with Windows/Linux hybrid clusters?**

**A:** Chaos Mesh can only work with Linux now, but we have kindly contributors who are trying to port some features to Windows: [github.com/chaos-mesh/chaos-mesh/issues/2956](https://github.com/chaos-mesh/chaos-mesh/issues/2956)

**Q: I think Istio and Linkerd also support fault injection. How does Chaos Mesh differ? Chaos Mesh provides much richer chaos injections (like IOChaos, TimeChaos...), but the injection provided by linked or istio, as I know, is focused on the network?**

**A:** Yeah of course! Service Mesh Frameworks have the potential to cause havoc in the RPC/Network layer. More types of chaos, such as stresschaos, pod kill, DNSChaos, and IOChaos, could be injected into Chaos Mesh (just mentioned) In addition to the list, we offer additional types of chaos. JVM, GCP, Azure, and so on...

**Q: As part of the chaos mesh can we run any pre-initialization scripts before introducing the chaos experiment?**

**A:** Yes! You may organize your customized scripts and various chaotic experiments together with Chaos Mesh's integrated Workflow engine. See [task field in workflow](https://chaos-mesh.org/docs/next/create-chaos-mesh-workflow/#task-field-description) for the document.

**Q: Is this similar to the Gremlin Chaos engineering tool?**

**A:** Yes, this is a Kubernetes-specific open-source project. It's a Kubernetes plugin that you can utilize. You can get more Infos on https://chaos-mesh.org

**Q: How does it inject network latency for network chaos? if we use cilium CNI with no iptables, would this latency injection still work in that case?**

**A:** Chaos Mesh has a chaos-daemon component. When network chaos is produced, chaos-daemon will enter the target pod's network namespace and set TC and iptables rules on the network device.

When using clium CNI without iptables, Chaos Mesh still works.

## Join the Chaos Mesh community

If you are interested in Chaos Mesh and would like to help us improve it, you're welcome to join [our Slack channel](https://slack.cncf.io/)(#project-chaos-mesh) or submit your pull requests or issues to our [GitHub repository](https://github.com/chaos-mesh/chaos-mesh).
