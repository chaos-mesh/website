---
title: GCP OAuth Authentication
---

When Chaos Mesh is deployed on the Google Cloud Platform, the users can login to the Chaos Dashboard through Google OAuth. This document will describe how to enable and configure this function.

## Create OAuth Client

Create GCP OAuth client and get the Client ID and Client Secret according to [Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849?hl=en)

1. Go to the Google Cloud Platform Console.
2. From the projects list, select a project or create a new one.
3. If the APIs & services page isn't already open, open the console left side menu and select APIs & services.
4. On the left, click Credentials.
5. Click New Credentials, then select OAuth client ID. 
6. Select "Web Application" as the application type, and enter additional information and the redirect url of chaos dashboard. The redirect url of chaos dashboard is `ROOT_URL/api/auth/gcp/callback`.The `ROOT_URL` is the root url of chaos dashboard, like "http://localhost:2333". This url can be set through the `dashboard.rootUrl` field in helm config.
7. Click Create Client ID.

After creating the client, save the Client ID and Client Secret for the following steps.

## COnfigure and start the Chaos Mesh

To enable this function, the users need to fill in the following fields in helm charts:

1. `dashboard.gcpSecurityMode` needs to be set to `true`.
2. `dashboard.gcpClientId` needs to be set to Client ID from the former section.
3. `dashboard.gcpClientSecret` needs to be set to Client Secret from the former section.
4. `dashboard.rootUrl` should be set to the root address of Chaos Dashboard.

If the Chaos Mesh has been installed, the configuration could be updated through `helm upgrade`. If not, it can be installed through `helm install`.

## Start to use

Open the Chaos Dashboard, click the google icon under the authentication window.

![img](./img/google-auth.png)

After login to the Google Account and grant permission to the oauth client, the page will be redirected to the Chaos Dashboard automatically and the user will have logged in. Then the user will have the same priviledge as the google account in this cluster, which means, it can be controlled by the RBAC mechanism. For example:

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: chaos-mesh-cluster-manager
rules:
  - apiGroups:
      - chaos-mesh.org
    resources: ['*']
    verbs: ['get', 'list', 'watch', 'create', 'delete', 'patch', 'update']
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: cluster-manager-binding
  namespace: chaos-testing
subjects:
  - kind: User
    name: example@gmail.com
roleRef:
  kind: ClusterRole
  name: chaos-mesh-cluster-manager
  apiGroup: rbac.authorization.k8s.io
```

This configuration will enalbe the user `example@gmail.com` to read or create any chaos experiments in any namespaces.