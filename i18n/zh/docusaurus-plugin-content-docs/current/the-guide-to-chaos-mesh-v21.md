---
title: 10 分钟体验 Chaos Mesh v2.1
---

本文通过简单的 Demo 来演示 Chaos Mesh v2.1 的使用。在此 Demo 教程中，您将学会如何用 Chaos Mesh 的 HTTP 混沌实验类型攻击 Nginx 服务，并观察实验过程和结果。同时，您也将学习到如何使用 Workflow 创建更为复杂的混沌测试流程。

## 准备环境

### 部署 Kubernetes 和 Chaos Mesh

在开始之前，请确保你的电脑中安装了 [Docker](https://www.docker.com/)。我们将使用 Chaos Mesh 项目提供的一键部署脚本 install.sh，它会自动检查你的环境，安装 [Kind](https://kind.sigs.k8s.io/)（Kubernetes in Docker），并使用 Kind 在本地启动一个 Kubernetes 集群，最终安装 Chaos Mesh。

:::注意

本文提供的 Kubernetes 和 Chaos Mesh 的部署方式仅供功能的测试和体验，如果在生产环境中部署，请参考文档[使用 Helm 安装 Chaos Mesh](./production-installation-using-helm.md)。

:::

1. 运行一键部署脚本 install.sh。

   ```bash
   curl -sSL https://mirrors.chaos-mesh.org/v2.1.2/install.sh | bash -s -- --local kind
   ```

   你可能需要等待几分钟。安装完成后，确认 Chaos Mesh 的 Pod 都处于 Running 状态：

   ```bash
   kubectl get pods -n chaos-testing
   ```

   结果如下所示：

   ```log
   NAME                                        READY   STATUS    RESTARTS   AGE
   chaos-controller-manager-588df5cdd7-qzxjn   1/1     Running   0          1m
   chaos-controller-manager-588df5cdd7-vd7qj   1/1     Running   0          1m
   chaos-controller-manager-588df5cdd7-wtrtf     1/1     Running   0          1m
   chaos-daemon-p7zdb                                       1/1     Running   0          1m
   chaos-dashboard-7c87549798-k5m9s             1/1     Running   0          1m
   ```

2. 为 Dashboard 服务做端口转发。

   ```bash
   kubectl port-forward -n chaos-testing svc/chaos-dashboard 2333:2333 --address 0.0.0.0
   ```

   这样我们就可以在浏览器中输入网址 127.0.0.1:2333 访问 Dashboard 了，界面如下所示：

   ![Dashboard interface](./img/quick-start-chaos-mesh-dashboard.png)


### 部署测试应用

我们选择部署 Nginx 和 webshow 作为混沌实验所需要的应用。

#### 部署 Nginx

Nginx 是一个很常用的软件，我们可以用它做反向代理、负载平衡等工作。在这里我们只需要使用它的基本功能，访问到它的主页即可。

1. 执行以下命令创建 Nginx 服务：

   ```bash
   kubectl apply -f  https://raw.githubusercontent.com/chaos-mesh/chaos-mesh/master/examples/nginx/nginx.yaml
   ```

2. 查看 Pod 状态，等待其状态为 Running：

   ```bash
   kubectl get pods -l app=nginx
   ```

   输出如下所示：

   ```log
   NAME READY STATUS RESTARTS AGE
nginx-694dd977cd-j9vql 1/1 Running 0 1m
   ```

3. 为 Nginx 服务做端口转发。

   ```bash
kubectl port-forward --address 0.0.0.0 svc/nginx 80:80 -n nginx
   ```

   访问 http://localhost/ ，可以看到页面上显示如下内容：

   ```log
   {"app": "Chaos App", "status": "Running"}
   ```

   说明 Nginx 已经正常工作了。

#### 部署 WebShow

WebShow 是一个简单的应用，用于获取它和 kube-system Pod 之间的网络延迟，并在 web 页面中以折线图方式展现出来。

1. 执行命令部署 WebShow。

   ```bash
   curl -sSL https://mirrors.chaos-mesh.org/v1.0.3/web-show/deploy.sh | sh
   ```

2. 在安装成功后，在浏览器中访问 http://localhost:8081/。

   可以看到如下所示的页面：

   ![WebShow 1](./img/web-show1.png)

   我们可以看到网络延迟很低，基本都在 2ms 以内。

## 创建混沌实验

1. 创建实验并选择故障类型。
   在 Chaos Mesh Dashboard 页面点击左侧 NEW EXPERIMENT 按钮创建新实验，选择实验类型为 “KUBERNETES”，选择故障类型为 “HTTP FAULT”：

   ![K8s HTTP Experiment](./img/k8s-http-exp.png)

2. 设置 HTTP 实验参数。

   我们这个实验的目的是修改 Nginx 的返回数据，因此选择具体的故障行为为 “RESPONSE PATCH”，然后进行具体的配置。将 “Port” 设置为 80（Nginx 提供服务的端口），将 “Patch Body Type” 设置为 “json”，在 “Patch Body Value” 中填写以下内容：

   ```text
   {"status":"Failed","reason":"hacked by Chaos Mesh"}
   ```

   如下图所示：

   ![HTTP Config](./img/http-config.png)

3. 设置实验的选择范围以及元信息。

   ![HTTP Meta](./img/http-exp-meta.png)

4. 提交实验。
   
   在所有配置完成后，点击 “Submit” 提交实验。我们可以在实验列表中看到我们创建的实验，我们可以选择指定的实验查看详情：

   ![HTTP Detail](./img/http-detail.png)

   从 “Events” 中可以看到故障注入成功了。

5. 验证实验效果。

   让我们再次访问 http://localhost/ ，可以看到页面上显示了如下内容：

   ```bash
   {"app":"Chaos App","reason":"hacked by Chaos Mesh","status":"Failed"}
   ```

   说明故障注入生效了，成功地修改了 Nginx 的返回数据。

## 创建 workflow

我们创建一个 workflow，对 WebShow 服务进行干扰。

1. 点击主页的 “NEW WORKFLOW” 按钮创建新的 workflow。

2. 创建一个 “single” 类型的 task，选择实验类型为 “KUBERNETES”，并选择故障类型为 “NETWORK ATTACK”：

   ![K8s Network Experiment](./img/k8s-network-exp.png)

3. 选择故障行为为 “DELAY”，这里我们设置 “Latency” 为 10ms，增加 10ms 的网络延迟：

   ![Network Config](./img/network-config.png)

4. 设置实验的范围只针对 WebShow，并填写实验元信息，让该实验持续 30s：

   ![Network Meta](./img/network-meta.png)

5. 创建一个 “Suspend” 类型的任务。

   该类型的任务正如其名字的含义一样，并不会做任何事情。这里设置该任务持续 30s：

   ![Suspend Task](./img/suspend-task.png)

6. 创建一个网络延迟的 “Single” 类型的任务。

   这次将 “Latency” 设置为 20ms，创建过程同 delay1，就不再赘述。

7. 填写 workflow 的元信息，如下所示：

   ![Workflow Meta](./img/workflow-meta.png)

8. 最后点击 “SUBMIT WORKFLOW” 按钮，这样 workflow 就创建完成并开始运行了。

9. 验证 workflow 效果。

   再次在浏览器中访问 http://localhost:8081/，等待一段时间（大约90s），将看到如下图所示的折线图：

   ![WebShow 2](./img/web-show2.png)
  
   我们可以发现网络延迟增加到了 10ms 左右，持续一段时间后延迟降低到先前水平，之后又上升到了 20ms 左右。这符合我们 workflow 的定义，说明 workflow 成功地注入了多个网络延迟故障。


## 探索更多

通过 demo 我们体验了 Chaos Mesh 2.1 中的 HTTPChaos、workflow 等功能，相信你已经感受到了 Chaos Mesh 和混沌工程的魅力之处。除此之外，Chaos Mesh 2.1 还包含很多新的特性以及功能完善，期待你来探索！

在 Chaos Mesh 的使用过程中遇到任何问题，欢迎通过 [issue](https://github.com/chaos-mesh/chaos-mesh/issues) 向我们反馈。
