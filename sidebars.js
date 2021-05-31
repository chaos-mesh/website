module.exports = {
  docs: [
    {
      type: 'category',
      label: '关于 Chaos Mesh',
      items: ['overview', 'basic-features'],
    },
    {
      type: 'category',
      label: '开始使用',
      items: [
        {
          type: 'category',
          label: '安装部署',
          items: ['quick-start', 'production-installation-using-helm', 'offline-installation'],
        },
        {
          type: 'category',
          label: '管理权限',
          items: ['manage-roles', 'configure-protected-namespace'],
        },
        {
          type: 'category',
          label: '运行单个混沌实验',
          items: [
            'define-chaos-experiment-scope',
            'define-scheduling-rules',
            'run-a-chaos-experiment',
            'inspect-chaos-experiment',
            'clean-up-chaos-experiment',
          ],
        },
        {
          type: 'category',
          label: '编排多个混沌实验',
          items: [
            'create-chaos-mesh-workflow',
            'define-workflow-scheduling-rules',
            'run-chaos-experiments-in-parallel-or-concurrently',
            'inspect-chaos-mesh-workflow',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '混沌实验类型',
      items: [
        {
          type: 'category',
          label: 'Kubernetes 环境',
          items: [
            'simulate-pod-chaos-on-kubernetes',
            'simulate-network-chaos-on-kubernetes',
            'simulate-dns-chaos-on-kubernetes',
            'simulate-heavy-stress-on-kubernetes',
            'simulate-io-chaos-on-kubernetes',
            'simulate-time-chaos-on-kubernetes',
            'simulate-jvm-application-chaos',
            'simulate-kernel-chaos-on-kubernetes',
            'simulate-aws-chaos',
            'simulate-gcp-chaos',
            'simulate-http-chaos-on-kubernetes',
          ],
        },
        {
          type: 'category',
          label: '物理机环境',
          items: [
            'chaosd-overview',
            'simulate-process-chaos-in-physical-nodes',
            'simulate-network-chaos-in-physical-nodes',
            'simulate-heavy-stress-in-physical-nodes',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '使用案例',
      items: ['multi-data-center-scenario'],
    },
    {
      type: 'category',
      label: '工具整合',
      items: [
        'integrate-chaos-mesh-into-github-actions',
        'use-argo-to-orchestrate-chaos-experiments',
        'use-grafana-to-inspect-chaos-experiments',
      ],
    },
    {
      type: 'category',
      label: '开发指南',
      items: [
        'developer-guide-overview',
        'configure-development-environment',
        'add-new-chaos-experiment-type',
        'extend-chaos-daemon-interface',
        'extend-chaosd',
        {
          type: 'category',
          label: '客户端',
          items: ['go-client', 'rust-client', 'java-client', 'python-client'],
        },
      ],
    },
    {
      type: 'category',
      label: '参考指南',
      items: ['architecture', 'chaos-engineering-principles', 'chaosctl-tool', 'glossary'],
    },
    {
      type: 'category',
      label: '常见问题与故障',
      items: ['faqs', 'troubleshooting-guide'],
    },
    {
      type: 'category',
      label: '版本发布历史',
      items: ['release-2.0.0', 'release-1.0.0', 'release-0.0.9', 'release-0.0.8'],
    },
  ],
}
