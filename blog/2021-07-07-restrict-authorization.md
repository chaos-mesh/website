---
slug: /securing-tenant-namespaces-using-restrict-authorization-feature
title: 'Securing tenant namespaces using restrict authorization feature in Chaos Mesh®'
author: Anurag Paliwal
author_title: Contributor of Chaos Mesh
author_url: https://github.com/anuragpaliwal80
author_image_url: https://avatars.githubusercontent.com/u/3283882?v=4
image: /img/chaos-engineering-tools-as-a-service.jpeg
tags: [Chaos Mesh, Chaos Engineering]
---

![Chaos engineering tools](/img/chaos-mesh-restrict-authorization.jpeg)

# Cluster multi-tenancy

A [multi-tenant](https://cloud.google.com/kubernetes-engine/docs/concepts/multitenancy-overview) cluster is shared by multiple users and/or workloads which are referred to as "tenants".The operators of multi-tenant clusters must isolate tenants from each other to minimize the damage that a compromised or malicious tenant can do to the cluster and other tenants.
When you plan a multi-tenant architecture, you should consider the layers of resource isolation in Kubernetes: cluster, namespace, node, Pod, and container.

<!--truncate-->

Although Kubernetes cannot guarantee perfectly secure isolation between tenants, it does offer features that may be sufficient for specific use cases. You can separate each tenant and their Kubernetes resources into their own [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).
Kubernetes supports multiple virtual clusters backed by the same physical cluster. These virtual clusters are called namespaces. [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) are intended for use in environments with many users spread across multiple teams, or projects.

# Cluster having Chaos Mesh

You designed your Kubernetes cluster to have multiple tenant services. You followed the best security practices for Kubernetes: each tenant service is running in its own namespaces, users of these tenant services have appropriate access that also only for their respective namespaces, etc.

<!--truncate-->

You enabled Chaos Mesh ([Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh) is a cloud-native Chaos Engineering platform that orchestrates chaos on Kubernetes environments) on the cluster so that your tenant services can perform different chaos activities to make sure their application/system is resilient. You have also given Chaos Mesh specific rights to those tenant service users so that they can manage Chaos Mesh resources using [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

<!--truncate-->

Suppose one of the tenant users wants to perform pod kill operations in his/her namespace i.e. chaos-testing. To achieve the same, the user created the below Chaos Mesh YAML file:

```yml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-kill
  namespace: chaos-testing
spec:
  action: pod-kill
  mode: one
  selector:
    namespaces:
      - tidb-cluster-demo
    labelSelectors:
      'app.kubernetes.io/component': 'tikv'
  scheduler:
    cron: '@every 1m'
```

The user has required rights to namespace chaos-testing, but does not have rights on tidb-cluster-demo namespace. When the user applies the above YAML file using kubectl, it will create the pod-kill Chaos Mesh resource in chaos-testing namespace. As we can see in the selector section, the user has specified some other namespace (tidb-cluster-demo), which means the pods which will be selected for this chaos operation will be from tidb-cluster-demo namespace, and not from the one for which the user has access i.e. chaos-testing. This means that this user is able to impact the other namespace for which (s)he does not have the rights. **Problem!!!**

<!--truncate-->

Since the release of Chaos Mesh 1.1.3, this security issue has been fixed with a restricted authorization feature. Now when user applies the above YAML file, the system shows the error similar to:

```yml
Error when creating "pod/pod-kill.yaml": admission webhook "vauth.kb.io" denied the request: ... is forbidden on namespace
tidb-cluster-demo
```

**Problem solved!**

Please note, if the user has required rights on tidb-cluster-demo namespace as well, then there will be no such error.

# For more tutorials
In case you want to enforce that no user should be allowed to create chaos across namespaces, you can check out my previous blog: [Securing tenant services while using chaos mesh using OPA](https://anuragpaliwal-93749.medium.com/securing-tenant-services-while-using-chaos-mesh-using-opa-3ae80c7f4b85).

# Last but not least
If you are interested in Chaos Mesh and would like to learn more, you're welcome to join the [Slack channel](https://slack.cncf.io/) or submit your pull requests or issues to its [GitHub repository](https://github.com/chaos-mesh/chaos-mesh).
