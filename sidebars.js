module.exports = {
  docs: [
    {
      type: 'category',
      label: 'About Chaos Mesh',
      items: ['overview', 'basic-features'],
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Installation and Deployment',
          collapsed: false,
          items: [
            'quick-start',
            'production-installation-using-helm',
            'offline-installation',
            'persistence-dashboard',
            'uninstallation',
            'supported-releases'
          ],
        },
        'manage-user-permissions',
        'configure-enabled-namespace',
        {
          type: 'category',
          label: 'Run a Single Chaos Experiment',
          items: [
            'define-chaos-experiment-scope',
            'define-scheduling-rules',
            'run-a-chaos-experiment',
            'inspect-chaos-experiments',
            // 'clean-up-chaos-experiments',
          ],
        },
        {
          type: 'category',
          label: 'Orchestrate Multiple Chaos Experiments',
          items: [
            'create-chaos-mesh-workflow',
            'run-chaos-experiments-in-serial-or-parallel',
            'send-http-request-on-workflow',
            'check-workflow-status',
            'status-check-in-workflow'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Types of Chaos Experiments',
      items: [
        {
          type: 'category',
          label: 'Kubernetes',
          items: [
            'simulate-pod-chaos-on-kubernetes',
            'simulate-network-chaos-on-kubernetes',
            'simulate-heavy-stress-on-kubernetes',
            'simulate-io-chaos-on-kubernetes',
            'simulate-dns-chaos-on-kubernetes',
            'simulate-time-chaos-on-kubernetes',
            'simulate-jvm-application-chaos',
            'simulate-kernel-chaos-on-kubernetes',
            'simulate-aws-chaos',
            'simulate-azure-chaos',
            'simulate-gcp-chaos',
            'simulate-http-chaos-on-kubernetes',
            'simulate-block-chaos-on-kubernetes',
          ],
        },
        {
          type: 'category',
          label: 'Physical Nodes',
          items: [
            'chaosd-overview',
            'simulate-physical-machine-chaos',
            'simulate-process-chaos-in-physical-nodes',
            'simulate-network-chaos-in-physical-nodes',
            'simulate-host-console-in-physical-nodes',
            'simulate-heavy-stress-in-physical-nodes',
            'simulate-disk-pressure-in-physical-nodes',
            'simulate-jvm-application-chaos-in-physical-nodes',
            'simulate-time-chaos-on-physical-nodes',
            'simulate-file-chaos-in-physical-nodes',
            'chaosd-search-recover',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Authentication',
      items: [
        "gcp-authentication",
      ]
    },
    // {
    //   type: 'category',
    //   label: 'Use Cases',
    //   items: ['multi-data-center-scenario'],
    // },
    {
      type: 'category',
      label: 'Tools Integration',
      items: [
        'integrate-chaos-mesh-into-github-actions',
        // 'use-argo-to-orchestrate-chaos-experiments',
        'use-grafana-data-source',
        'chaosctl-tool',
      ],
    },
    {
      type: 'category',
      label: 'Development Guides',
      items: [
        'developer-guide-overview',
        'configure-development-environment',
        'add-new-chaos-experiment-type',
        'extend-chaos-daemon-interface',
        'extend-chaosd',
        // {
        //   type: 'category',
        //   label: 'Clients',
        //   items: ['go-client', 'rust-client', 'java-client', 'python-client'],
        // },
      ],
    },
    // {
    //   type: 'category',
    //   label: 'Reference Guides',
    //   items: ['architecture', 'chaos-engineering-principles', 'chaosctl-tool', 'glossary'],
    // },
    {
      type: 'category',
      label: 'FAQs and Troubleshooting',
      items: [
        'faqs',
        // 'troubleshooting-guide',
        'upgrade-to-2.0',
        'upgrade-from-2.1-to-2.2',
      ],
    },
    // {
    //   type: 'category',
    //   label: 'Release Notes',
    //   items: ['release-2.0.0', 'release-1.0.0', 'release-0.0.9', 'release-0.0.8'],
    // },
    {
        type: 'category',
        label: 'Release',
        items: [
          'release-cycle',
          {
            type: 'category',
            label: 'Release Tracking',
            items: [
              'release-2.3-tracking',
            ]
          }
        ],
    }
  ],
}
