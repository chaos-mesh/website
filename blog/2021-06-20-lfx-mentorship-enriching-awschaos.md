---
slug: /lfx-mentorship-enriching-awschaos
title: From a Newbie in Software Engineering to a Graduated LFX-Mentee
author: Debabrata Panigrahi
author_title: LFX Mentee at Chaos Mesh
author_url: https://github.com/Debanitrkl
author_image_url: https://avatars.githubusercontent.com/u/50622005?v=4
image: /img/mentorship_experience.png
tags: [Chaos Mesh, Chaos Engineering, LFX Mentorship, AWS Chaos]
---
![LFX Mentorship Experience](/img/mentorship_blog.jpeg)

## About Me

[I’m](https://mentorship.lfx.linuxfoundation.org/mentee/6a0bf7de-9e18-4acb-9a66-f5fecdbeb42e) a junior undergraduate majoring in Biomedical Engineering in the Department of Biotechnology and Medical Engineering at the [National Institute of Technology Rourkela](https://nitrkl.ac.in/), India. For someone who started to code only because I was fascinated by it, it was all a journey of self-learning, filled with various adversities. But when I started with open-source contributions, it was all very beginner-friendly and I came across a lot of people who helped me learn the tech stack better.

<!--truncate-->

![img1](/img/mentroship_blog1.png)

## The journey through the application

In the spring of 2021, I got to know about this LFX mentorship program and after browsing through all the [projects](https://github.com/cncf/mentoring/blob/master/lfx-mentorship/2021/01-Spring/README.md), it felt quite intimidating to me as I wasn’t acquainted with most of the terms and was confused, and I thought it was not for newbies like me. Then I went through the program [docs](https://docs.linuxfoundation.org/lfx/mentorship), the mentorship [FAQ’s](https://docs.linuxfoundation.org/lfx/mentorship/mentorship-faqs) followed the steps mentioned there and applied for a few projects that interested me, and used tech-stacks that I am familiar with, like Docker, AWS, Python, etc.

Then I applied to both projects offered by [Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh) and submitted my CV and cover letter as immediate tasks. After a few days, I received an email from my mentor regarding an additional task to be submitted.

![img2](/img/mentorship_blog2.png)

I completed the above-mentioned task, uploaded the files to GitHub, and shared the link with my mentor.

## The selection and Initial days as a mentee

I distinctly remember the day when I received an email from my mentor regarding my selection in the mentorship program. I was elated, as it was my first involvement in any open-source program. I was glad to be accepted as a mentee in the program, I even received an email from CNCF regarding my selection.

![img3](/img/mentorship_blog4.png)

Along with my mentor, we decided on our mode of communication: through Slack. He also enquired about my knowledge of Kubernetes and GOlang, as I didn’t have much knowledge about either of them. He suggested a few resources and gave me 2 weeks to go through them. In the meantime, he also planned a few experiments for me to get acquainted with all these technologies.

As I was getting more comfortable with Kubernetes, I started exploring Chaos Mesh and completed the interactive [tutorial](https://chaos-mesh.org/interactive-tutorial), which gave me a clearer idea about the usage of Chaos Mesh. I then implemented the [hello-world chaos](https://chaos-mesh.org/docs/development_guides/develop_a_new_chaos), which helped me to know more about controllers and CRDs, considered to be the most important part of Chaos Mesh. Also, I got to know about the boilerplate codes, the [kube-builder client](https://github.com/kubernetes-sigs/kubebuilder), and how to use them for scaffolding, followed by writing our own controllers.

After the initial days of experimenting and getting to know the project better, I started with solving a few good first issues to get acquainted with upstream contributions to Chaos Mesh.

![img4](/img/mentorship_blog3.png)

In one of my contributions, I tried to add multi-container support to stress-chaos, which was not possible before. Though it was successfully implemented, it broke a few other features and couldn’t be merged for the upcoming release. What’s more, for the 2.0.0 release, this refactoring was already done, so this particular contribution was a learning experience for both me and my mentor. After that, we became careful and the next time we tried to implement any new features, we would first submit an [RFC](https://github.com/chaos-mesh/rfcs) and have discussions with the other contributors before starting.

## My contribution to AWS Chaos

Initially, I was asked to implement one type of AWS Chaos as part of this project, but as I started exploring more about it, I found [awsssmchaosrunner](https://github.com/amzn/awsssmchaosrunner), and given its functionality, we wanted to integrate it into Chaos Mesh.

We planned to do it in two parts, one part is the “[runner thing](https://github.com/STRRL/awsssmchaosrunner-cli)” project, which integrates with awsssmchaosrunner, that part should be written in kotlin, and a docker image is to be built out of it.

Another part is the definition of the AWS Chaos and its [controller](https://github.com/chaos-mesh/chaos-mesh/pull/1919), which is to be written in go, the controller of AWS Chaos will create a pod with that “kotlin cli image”, and send commands to AWS.

## Other opportunities

I was invited to one of the Chaos Mesh [community meetings](https://www.youtube.com/watch?v=ElG0pHRoXwI&t=2s) towards the end of the mentorship where I showcased my project.

Afterwards, I applied for the CFP for [Kubernetes Community Days Bangalore](https://community.cncf.io/events/details/cncf-kcd-bengaluru-presents-kubernetes-community-days-bengaluru/), scheduled virtually from June 25–26, 2021, and was selected as a speaker and now I’m all set to present my talk there.

## Graduation and Next steps

Yayyyy!! After 12 weeks, I successfully graduated from the program, thanks to my mentor [Zhou Zhiqiang](https://mentorship.lfx.linuxfoundation.org/mentor/e78b3177-160c-4566-9f3d-8fc9b2ec3cea) and his guidance, because without whom, this wouldn’t have been possible.

I had an amazing time with the Chaos Mesh community, with the amazing members supporting and helping me throughout the journey. I look forward to contributing more to this project and being more active in the community.

## Join the Chaos Mesh community

To join and learn more about Chaos Mesh, find the #project-chaos-mesh channel in [CNCF slack workspace](https://slack.cncf.io/) or their [GitHub](https://github.com/chaos-mesh/chaos-mesh).
