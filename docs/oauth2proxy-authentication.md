---
title: OAuth2Proxy Authentication
---

When Chaos Mesh is deployed kubernetes, you can use OAuth2proxy to allow access to the dashboard. Additionally, you could pass the ID token from OAuth2proxy to the dashboard, which then allow users to create experiments in the namespaces made accessiable by that token. This document describes how to enable and configure this function.

## Create OAuth Client

Just like for [GCP OAuth authentication](https://chaos-mesh.org/docs/gcp-authentication/), you'll need to create an OAuth client in your identity provider, which at the end will give you Client ID and Client Secret needed for the following steps.

## Deploy OAuth2proxy

Check out [OAuth2Proxy's installation documentation](https://oauth2-proxy.github.io/oauth2-proxy/docs/) for detailed information, but you'll need a deployment, a service and an ingress similar to the following:

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

This way all trafic will go first through the OAuth2Proxy and after a sucessful authentication a token will be saved in your cockies to avoid authenticating every request. Important here is the argument **--pass-authorization-header** for the OAuth2Proxy deployment/pod, which tells OAuth2Proxy to pass the ID token to chaos-dashboard. This ID token is the one used to authenticate and authorize against k8s. Thus, aufter authentication the user will be able to create the specific chaos-resources in the specified namespaces allowed by the cluster's RBACs. Note also that the ingress doesn't need any special annotations.

## Configure and start Chaos Mesh

Unfortuanetly at the moment there's no option to turn off the login popup in the dashboard without completely disabling authentication. So basically what you need to do after a successful authentication against your IdP is to skip that popup by entering any input, as that input no longer is used given the ID token is passed from OAuth2Proxy.

## Use the function

Once you call the chais-mesh url you'll be prompted to for authentication by your IdP and when sucessful, enter any input in chaos-mesh's authentication popup and submit then you're ready to use the dashboard.
