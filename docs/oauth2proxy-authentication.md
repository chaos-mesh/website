---
title: OAuth2Proxy Authentication
---

If Chaos Mesh is deployed on Kubernetes, you can use OAuth2proxy to allow access to the dashboard. Additionally, you can pass the ID token from OAuth2proxy to the dashboard, which then allows users to create experiments in the namespaces made accessible by that token. This document describes how to enable and configure this feature.

## Create OAuth Client

As with [GCP OAuth Authentication](https://chaos-mesh.org/docs/gcp-authentication/), you'll need to create an OAuth client with your identity provider, which will end up giving you the Client ID and Client Secret needed for the following steps.

## Deploy OAuth2proxy

See [OAuth2Proxy's installation documentation](https://oauth2-proxy.github.io/oauth2-proxy/docs/) for detailed information, but you'll need a deployment, a service, and an ingress similar to the following:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { ... }
spec:
  replicas: 1
  selector: { ... }
  template:
    metadata: { ... }
    spec:
      containers:
        - args:
            - --provider=oidc
            - --provider-display-name="Your Login"
            - --redirect-url=<chaos-mesh-url>
            - --oidc-issuer-url=<IdP-url>
            - --email-domain=*
            - --upstream=http://chaos-dashboard:2333 # IMPORTANT: chaos-dashboard service
            - --http-address=0.0.0.0:4180
            - --pass-authorization-header
          env:
            - name: OAUTH2_PROXY_CLIENT_ID
              value: <client-id>
            - name: OAUTH2_PROXY_CLIENT_SECRET
              value: <client-secret>
            - name: OAUTH2_PROXY_COOKIE_SECRET
              value: # docker run -ti --rm python:3-alpine python -c 'import secrets,base64; print(base64.b64encode(base64.b64encode(secrets.token_bytes(16))));'
          image: quay.io/oauth2-proxy/oauth2-proxy:latest
          imagePullPolicy: Always
          name: oauth2-proxy
          ports:
            - containerPort: 4180
              protocol: TCP
---
apiVersion: v1
kind: Service
metadata: { ... }
spec:
  ports:
    - name: http
      port: 4180
      protocol: TCP
      targetPort: 4180
  selector: { ... }
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: { ... }
spec:
  rules:
    - host: <chaos-mesh-url>
      http:
        paths:
          - backend:
              service:
                name: <oauth2proxy-service>
                port:
                  name: http
            path: /
            pathType: Prefix
  tls:
    - hosts:
        - <chaos-mesh-url>
      secretName: <tls-secret-name>
```

This way all traffic will go through the OAuth2Proxy first and after a successful authentication a token will be stored in your cockies to avoid authenticating every request. Important here is the **--pass-authorization-header** argument to the OAuth2Proxy deployment/pod, which tells the OAuth2Proxy to pass the ID token to chaos-dashboard. This ID token is the one used for authentication and authorization against k8s. Thus, after authentication, the user will be able to create the specific chaos resources in the specified namespaces allowed by the cluster's RBACs. Note also that the ingress doesn't need any special annotations.

## Configuring and Starting Chaos Mesh

Unfortunately, there's currently no way to turn off the login popup in the dashboard without completely disabling authentication. So basically what you need to do after successfully authenticating against your IdP is to skip the popup by entering any input, as that input is no longer used since the ID token is passed from OAuth2Proxy.

## Using the function

Once you call the chais-mesh url, you will be prompted by your IdP for authentication, and if successful, enter any input in chaos-mesh's authentication popup and submit, then you're ready to use the dashboard.
