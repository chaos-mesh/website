# 使用 Ingress 暴露 Chaos Dashboard

有时，你可能需要将 Chaos Dashboard 对外开放，同时将其挂载在当前监控面板的子路径下。

下面是一个使用 Ingress 资源在 `/chaos-mesh` 路径下暴露 Chaos Dashboard 的示例。该示例假定你使用的是 Ingress NGINX Controller：

:::info

你可能需要添加以下配置，以在你的 Ingress NGINX Controller 中启用 snippet 注解：

```yaml
data:
  allow-snippet-annotations: 'true'
  annotations-risk-level: 'Critical'
```

更多详情请参阅[官方文档](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#allow-snippet-annotations)。

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

你也可以在 https://github.com/chaos-mesh/chaos-mesh/blob/master/examples/dashboard/ingress-subpath.yaml 找到这个示例。
