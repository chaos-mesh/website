---
slug: /chaos-mesh-q&a
title: 'Chaos Mesh Q&A'
author: Chaos Mesh Community
author_url: https://github.com/chaos-mesh
author_image_url: https://avatars1.githubusercontent.com/u/59082378?v=4
image: /img/blog/chaos-mesh-q&a.jpeg
tags: [Chaos Mesh, Chaos Engineering]
---

![Chaos Mesh Q&A](/img/blog/chaos-mesh-q&a.jpeg)

At KubeCon EU 2021, the [Chaos Mesh](https://chaos-mesh.org/) team hosted two “office hours sessions” where newcomers, community members, and project maintainers had a chance to chat, get to know each other, and learn more about the project.

<!--truncate-->

Big thanks to the more than 200 of you who joined us! We received so many great questions during the session, we thought we’d do a round up Q&A.

## Your questions answered

**Q: Is Chaos Mesh compatible with Service Meshes, such as Istio?**

**A:** Yes, you can use Chaos Mesh in the Service Mesh environment. At one of our [previous community meetings](https://www.youtube.com/watch?v=paIgJYOhdGw), Sergio Méndez and Jossie Castrillo from the University of San Carlos of Guatemala shared how they used Linkerd and Chaos Mesh to conduct chaos experiments for their project, “[COVID-19 Realtime Vaccinated People Visualizer](https://github.com/sergioarmgpl/operating-systems-usac-course/blob/master/lang/en/projects/project1v3/project1.md)”.

![Project Architecture](/img/blog/chaos-mesh-linkerd-architecture.png)

<p className="caption-center">Project Architecture</p>

**Q: Can I use Chaos Mesh on-premises or do I need Amazon Web Services (AWS) or Google Cloud Platform (GCP)?**

**A:** You can do either! You can deploy Chaos Mesh on your Kubernetes cluster, so it does not matter whether you manage it yourself or have it hosted on AWS or GCP. However, if you would like to use it in a Kubernetes environment, you need to [set relevant parameters](https://chaos-mesh.org/docs/1.2.4/user_guides/installation) during installation.

**Q: How do "chaos actions" work?**

**A:** Chaos Mesh uses Kubernetes CustomResourceDefinitions (CRDs) to manage chaos experiments. Different fault injection behaviors are implemented in different ways, but the overall idea is the same: Chaos Mesh uses an application's execution link to inject chaos into the application. For example, when we inject chaos into the overall link of network interaction, the network interaction card is passed through. Because Linux uses traffic control to increase interference to the specific network interaction card, we can directly use traffic control for network fault injection.

**Q: Are you going to add probe support to Chaos Mesh for steady state detection and experiment validation?**

**A:** Currently, there is no plan to add this support. Steady state detection and experiment validation are necessary if an application is ready for production. Chaos Mesh itself does not monitor related work, but provides an interface to access existing monitoring systems or the status interface of the application to monitor and detect the application’s steady state.

**Q: What elevated privileges do the Chaos Mesh pods need?**

**A:** By default, the Chaos Daemon components in Chaos Mesh run in the `privileged` mode. If your Kubernetes cluster version is v3.11 or higher, you can replace `privileged` mode by configuring `capabilities`.

**Q: Can I implement Chaos Mesh inside build pipelines to log specific test results?**

**A:** Yes, that’s easy to do. You can integrate Chaos Mesh with pipeline systems such as Argo, Jenkins, GitHub Action, and Spanner. Chaos Mesh uses Kubernetes CRDs to manage chaos experiments. To inject chaos, you only need to create the chaos CRD object you want in the pipeline. You can obtain the running status of an experiment through its status structure and event.

**Q: What can we expect from the 2.0 release? Can you share some updates on HTTPChaos?**

**A:** Chaos Mesh 2.0 will provide native workflow support, and users can arrange chaos experiments in Chaos Mesh. In addition, for Chaos Mesh 2.0, we have reconstructed the existing chaos controller so that users can more easily add new fault injection types. As for HTTPChaos, we’re adding network failure simulation to the HTTP application layer!

## Join the Chaos Mesh community

If you are interested in Chaos Mesh and would like to help us improve it, you're welcome to join [our Slack channel](https://slack.cncf.io/) or submit your pull requests or issues to our [GitHub repository](https://github.com/chaos-mesh/chaos-mesh).
