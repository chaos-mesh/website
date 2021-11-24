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
          items: ['quick-start', 'production-installation-using-helm', 'offline-installation'],
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
            'check-workflow-status',],
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
            'simulate-gcp-chaos',
            'simulate-http-chaos-on-kubernetes',
          ],
        },
        {
          type: 'category',
          label: 'Physical Nodes',
          items: [
            'chaosd-overview',
            'simulate-process-chaos-in-physical-nodes',
            'simulate-network-chaos-in-physical-nodes',
            'simulate-host-console-in-physical-nodes',
            'simulate-heavy-stress-in-physical-nodes',
            'simulate-disk-pressure-in-physical-nodes',
            'simulate-jvm-application-chaos-in-physical-nodes',
            'simulate-time-chaos-on-physical-nodes',
          ],
        },
      ],
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
        // 'use-grafana-to-inspect-chaos-experiments',
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
      ],
    },
    // {
    //   type: 'category',
    //   label: 'Release Notes',
    //   items: ['release-2.0.0', 'release-1.0.0', 'release-0.0.9', 'release-0.0.8'],
    // },
  ],
}
