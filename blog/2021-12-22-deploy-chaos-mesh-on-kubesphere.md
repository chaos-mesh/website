---
slug: /deploy-chaos-mesh-on-kubesphere
title: 'Deploy Chaos Mesh on KubeSphere'
author: Cwen Yin
author_title: Chaos Mesh Maintainer
author_url: https://github.com/cwen0
author_image_url: https://avatars.githubusercontent.com/u/22956341?v=4
image: /img/chaos-mesh-kubesphere-banner.png
tags: [Chaos Mesh, Chaos Engineering, community]
---

![Deploy Chaos Mesh on KubeSphere](/img/chaos-mesh-kubesphere-banner.png)


[Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh) is a cloud-native Chaos Engineering platform that orchestrates chaos in Kubernetes environments. With Chaos Mesh, you can test your system's resilience and robustness on Kubernetes by injecting various types of faults into Pods, network, file system, and even the kernel.

<!--truncate-->

![Chaos Mesh architecture](/img/chaos-mesh-architecture-2.0.png)

## What’s KubeSphere

[KubeSphere](https://kubesphere.io/) is a distributed operating system for cloud-native application management, using Kubernetes as its kernel. It provides a plug-and-play architecture, allowing third-party applications to be seamlessly integrated into its ecosystem.

KubeSphere 3.2.0 adds the feature of dynamically loading community-developed Helm charts into the [KubeSphere App Store](https://kubesphere.io/docs/pluggable-components/app-store/). Thanks to this new feature, Chaos Mesh is now available on KubeSphere. In this tutorial, you will learn how to deploy Chaos Mesh on KubeSphere to conduct chaos experiments.

## Enable App Store on KubeSphere 

1. Make sure you have installed and enabled the [KubeSphere App Store](https://kubesphere.io/docs/pluggable-components/app-store/).

2. You need to create a workspace, a project, and a user account (project-regular) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the operator role. For more information, see [Create Workspaces, Projects, Users and Roles](https://kubesphere.io/docs/quick-start/create-workspace-and-project/).

## Chaos experiments with Chaos Mesh

### Step 1: Deploy Chaos Mesh 
  
1. Login KubeSphere as `project-regular`, search for **chaos-mesh** in the **App Store**, and click on the search result to enter the app. 

    ![Chaos Mesh app](/img/chaos-mesh-app.png)
        
2.  In the **App Information** page, click **Install** on the upper right corner.

    ![Install Chaos Mesh](/img/install-chaos-mesh.png)
        
3. In the **App Settings** page, set the application **Name,** **Location** (as your Namespace), and **App Version**, and then click **Next** on the upper right corner.

    ![Chaos Mesh basic information](/img/chaos-mesh-basic-info.png)

4. Configure the `values.yaml` file as needed, or click **Install** to use the default configuration.

    ![Chaos Mesh configurations](/img/chaos-mesh-config.png)

5. Wait for the deployment to be finished. Upon completion, Chaos Mesh will be shown as **Running** in KubeSphere. 

    ![Chaos Mesh deployed](/img/chaos-mesh-deployed.png)

### Step 2: Visit Chaos Dashboard

1. In the **Resource Status** page, copy the **NodePort **of `chaos-dashboard`.

    ![Chaos Mesh NodePort](/img/chaos-mesh-nodeport.png)

2. Access the Chaos Dashboard by entering `${NodeIP}:${NODEPORT}` in your browser. Refer to [Manage User Permissions](https://chaos-mesh.org/docs/manage-user-permissions/) to generate a Token and log into Chaos Dashboard. 

    ![Login to Chaos Dashboard](/img/login-to-dashboard.png)

### Step 3: Create a chaos experiment

Before creating a chaos experiment, you should identify and deploy your experiment target, for example, to test how an application works under network latency. Here, we use a demo application `web-show` as the target application to be tested, and the test goal is to observe the system network latency. You can deploy a demo application `web-show` with the following command: `web-show`.   

```bash
curl -sSL https://mirrors.chaos-mesh.org/latest/web-show/deploy.sh | bash
```  
    
> Note: The network latency of the Pod can be observed directly from the web-show application pad to the kube-system pod.
    
1. From your web browser, visit `${NodeIP}:8081` to access the **Web Show** application.

    ![Chaos Mesh web show app](/img/web-show-app.png)

2. Log in to Chaos Dashboard to create a chaos experiment. To observe the effect of network latency on the application, we set the **Target **as "Network Attack" to simulate a network delay scenario. 
    
    ![Chaos Dashboard](/img/chaos-dashboard-networkchaos.png)
        
    The **Scope** of the experiment is set to `app: web-show`.
        
    ![Chaos Experiment scope](/img/chaos-experiment-scope.png)   
        
3. Start the chaos experiment by submitting it. 

    ![Submit Chaos Experiment](/img/start-chaos-experiment.png)  

Now, you should be able to visit **Web Show** to observe experiment results:    

![Chaos Experiment result](/img/experiment-result.png)  


## To summarize

KubeSphere makes cloud-native application deployments and maintenance easy. Thanks to the App Store, users can easily deploy Chaos Mesh on KubeSphere with just a few clicks, enabling you to quickly start your own chaos experiments.

To learn more about Chaos Mesh, refer to the [Chaos Mesh docs](https://chaos-mesh.org/docs/) or join the community Slack ([CNCF](https://slack.cncf.io/)/#project-chaos-mesh).