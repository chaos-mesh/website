---
title: 检查工作流状态
---

## 通过 Chaos Dashboard 检查工作流状态

1. 在 Chaos Dashboard 中列出所有的工作流。

   ![List Workflows On Dashboard](./img/list-workflow-on-dashboard.png)

2. 选择你想要检查的工作流，查看工作流的详细信息。

   ![Workflow Status On Dashboard](./img/workflow-status-on-dashboard.png)

## 通过 `kubectl` 检查工作流状态

1. 执行以下命令来获取指定命名空间中已经创建的工作流：

   ```shell
   kubectl -n <namespace> get workflow
   ```

2. 根据上一步输出的工作流列表，选择想查看的工作流并在以下命令中指定其名称。执行命令以获取该工作流下的所有 WorkflowNode：

   ```shell
   kubectl -n <namespace> get workflownode --selector="chaos-mesh.org/workflow=<workflow-name>"
   ```

   :::info 提示

   工作流在执行过程中的步骤会以 WorkflowNode 这一 CustomResource 来表示。

   :::

3. 执行以下命令来获取指定 WorkflowNode 的详细状态：

   ```shell
   kubectl -n <namespace> describe workflownode <workflow-node-name>
   ```

   输出内容包括当前节点是否执行完成、并行/串行节点的执行状态、对应的 Chaos 实验对象等。
