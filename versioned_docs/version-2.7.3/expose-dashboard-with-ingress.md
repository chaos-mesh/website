# Expose Chaos Dashboard with Ingress

At times, you may need to make the Chaos Dashboard accessible to external users while placing it under the subpath of your current monitoring dashboard.

Below is an example of how to expose the Chaos Dashboard under the path `/chaos-mesh` with an Ingress resource. This example assumes that you are using an Ingress NGINX Controller:

:::info

You may need to add below configurations to enable snippet annotations in your Ingress NGINX Controller:

```yaml
data:
  allow-snippet-annotations: 'true'
  annotations-risk-level: 'Critical'
```

See the [official documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#allow-snippet-annotations) for more details.

:::

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-chaos-dashboard-under-subpath
  namespace: chaos-mesh
  annotations:
    nginx.ingress.kubernetes.io/use-regex: 'true'
    nginx.ingress.kubernetes.io/rewrite-target: /$1
    nginx.ingress.kubernetes.io/configuration-snippet: |
      sub_filter '<head>' '<head>\n<base href="/chaos-mesh/" />';
spec:
  rules:
    - http:
        paths:
          - path: /chaos-mesh/?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: chaos-dashboard
                port:
                  number: 2333
```

You can also find this example in https://github.com/chaos-mesh/chaos-mesh/blob/master/examples/dashboard/ingress-subpath.yaml.
