---
slug: /experience-as-a-chaos-mesh-lfx-mentee
title: 'Experience as an LFX Mentee for Chaos Mesh'
author: Chunxu Zhang
author_title: LFX mentee
author_url: https://github.com/TangliziGit
author_image_url: https://avatars.githubusercontent.com/u/40566218?v=4
image: /img/blog/lfx-mentee-experience-banner.png
tags: [Chaos Mesh, Chaos Engineering, LFX Mentorship, Monitoring Metrics]
---

![Experience as an LFX Mentee for Chaos Mesh](/img/blog/lfx-mentee-experience-banner.png)

I am a graduate student studying software engineering at Nanjing University. My research focuses on DevOps, which has intrinsic connections with chaos engineering and observability. To get involved in the open-source community, understand Kubernetes more deeply, and experience the daily jobs around infrastructure, I applied for the CNCF LFX Mentorship in Fall 2021 to work on the [Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh) project.

<!--truncate-->

## Application Process

At the end of August, I finished an internship of a business nature. As expected, I decided that I was not much into business-related work. However, I always had a strong passion for infrastructure technologies. By chance, I discovered the Chaos Mesh project at CNCF LFX Mentorship.I thought this was a great opportunity to work on an open source project, which I had been dreaming about. I also had the right technology stack, so I submitted my resume right before the deadline.

Three days later, I received an interview email from my mentor. As part of the interview, the mentor left a small piece of homework - to write a mini-node-exporter that would expose Prometheus metrics and present them in the Grafana dashboard. I was also required to deploy the mini-node-exporter, the configured Prometheus, and Grafana dashboard on the Kubernetes platform. The design and implementation process was very smooth. The only difficulty was to write the Grafana dashboard as a configuration YAML for the Kubernetes deployment. After a series of queries through documentation and experiments, this problem was finally solved.

On August 30, I was lucky enough to receive the good news that I passed the interview. During the one-on-one meeting with the mentor, we simply talked about my familiarity with Kubernetes and other technologies, the main tasks, and some key timelines. I also raised some concerns, such as the pressure of my graduate lab project that might affect the progress of the mentorship, and the design guidelines of the metrics. My mentor understood me well and addressed my concerns.

## Project Process

The project I applied for was called [Monitoring Metrics about Chaos Mesh](https://mentorship.lfx.linuxfoundation.org/project/8db683b0-0273-4a83-9ed9-4c33ee2cfcf0), which aimed to improve the observability of the Chaos Mesh system by collecting metrics and providing a Grafana dashboard.

During the first two weeks of the project, I got familiar with the business process and some code details of chaos mesh. In the next two weeks, I started to write the design document to sort out all the metrics and collection methods. During this time, I studied the metric design guidelines and met with the mentor to understand the details of the proposal and some of the code logic.

Most of these metrics are relatively simple to collect, requiring only simple queries to database objects, k8s objects, or some simple counts. However, there are some special metrics that are difficult to collect. For example, you need to query the data by executing commands in the network namespace of the corresponding container, or query all the containers under the daemon through three different container runtimes, or collect data on the communication between the gRPC client and the server.

These tasks were strange to me. Therefore, I had to ask my mentor for technical support from time to time, and he was always very responsive. I was greatly impressed by my mentor’s extensive knowledge and experience in this field. Under the guidance from my mentor, I was finally able to put together the [RFC](https://github.com/chaos-mesh/rfcs/pull/23) document for my design. Later, in order to track my work, I created a [tracking issue](https://github.com/chaos-mesh/chaos-mesh/issues/2397).

![Tracking issue](/img/blog/lfx-mentee-experience-tracking-issue.png)

However, during the subsequent coding work, I encountered various problems. In retrospect, I found that many of them could have been solved in advance. So I have summarized some suggestions below:

**Keep thinking critically**. When I accepted the proposal, I proposed my solution for each metric off the top of my head, but ignored some basic questions: are these metrics necessary? Do we have a better solution that’s available? These basic questions should have been addressed during the proposal phase, but they were propagated to the later design implementation phase. For example, when submitting the RFC, I was reminded by my mentor and reviewers that some metrics were already implemented in the controller-runtime library. When I was working on BPM-related metrics, I was asked similarly by the reviewer. Only then did I realize that I had never paid attention to it.

![Comments about BPM metrics](/img/blog/lfx-mentee-experience-thinking-critically.png)

**Continuous communication**. How to communicate effectively is a very important issue in this mentorship. There are many lessons learned about communication, but the most profound is that it is better to give options before getting advice. When you have to ask for help, provide some options for the other party to reference. Although these options may not be valid, it contains your own thinking. Therefore, unless you still have no idea after thinking things through, don’t put other people in the middle of your questions.

**Understand open source**. This is my first actual experience with open source. Compared with working in a company, things are a lot different. Here are some examples:

1. The way information is synchronized. Unlike working in a company where we communicate often with face-to-face meetings, basically most of the communications with an open source community are concentrated in slack channels, GitHub issues, and pull requests. Therefore, we need to record our work so that we can always let other folks know what is going on. In the first few weeks, I maintained an online R&D document based on my previous habit. Later I found that it was better to set up a Kanban or issue on GitHub, so that I would not introduce additional communication cost for my mentor by using a different platform.

   ![Online R&D document](/img/blog/lfx-mentee-experience-rd-doc.png)

2. Better and more rigorous automated testing. For business companies, automated testing only includes static code analysis, unit testing and simple smoke testing, while manual testing will be more rigorous. But in open source projects, the automated code pipeline contains more detailed and complete test cases, such as integration testing, end-to-end testing, license checking, and so on. The quality and security of the submitted code will be checked initially in this phase.

3. Code review. Many people will participate in your code reviews, and the review may last for a long time. Unlike company work, there are no dedicated reviewers in an open source community. It could be users, maintainers, or other community members who are either assigned or voluntarily do the job, which may be part of the reason for the long review duration.

## After the project

I had a wonderful experience in these 12 weeks. I gained a deeper understanding of Kubernetes, CRD, and observability. I also realized that I was still lacking a lot of knowledge on how to improve code structure, Linux basics, and container technologies. There is still more to learn!

At the same time, because of the unexpected pressure of the graduate lab project, I didn’t have much dedicated time for the mentorship. I didn’t even get to finish the design of the Grafana part within the time frame. I will definitely follow up with it and hope to finish it successfully and give a real conclusion to this project.

I would like to thank my mentor [@STRRL](https://github.com/STRRL). During my internship, I encountered many problems in the project, such as Git operations, cycle dependency solutions, and finding the runtime interface for CRI-O. Without my mentor's patience and guidance, it would have been difficult for me to complete these unfamiliar technical challenges. I would also like to thank the maintainers of Chaos Mesh for reviewing my code, and the CNCF LFX Mentorship project for providing a great platform for all of us who want to participate in the open-source community.

![Mentor's LGTM](/img/blog/lfx-mentee-experience-mentors-lgtm.png)

Finally, I hope every student who wants to be part of the open-source community can take the first step with LFX Mentorship!
