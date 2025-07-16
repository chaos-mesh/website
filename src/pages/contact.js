import Layout from '@theme/Layout'

import CalComInlineEmbed from '../components/CalComInlineEmbed'

const contactText = 'Contact Us'

export default function Contact() {
  return (
    <Layout title="Contact Us" description="Contact Chaos Mesh maintainers">
      <div className="hero">
        <div className="container">
          <h1>{contactText}</h1>
          <p>
            Have questions about Chaos Mesh? Want to discuss a specific use case or need help with your chaos
            engineering journey? Our maintainers are here to help!
          </p>
          <p>
            Schedule a meeting with our team to get personalized guidance, technical support, or discuss potential
            contributions to the project.
          </p>

          <h2>Schedule a Meeting</h2>
          <p>
            Click below to book a time slot that works for you. We'll be happy to discuss your needs and answer any
            questions you might have.
          </p>

          <div className="tw-my-8">
            <CalComInlineEmbed />
          </div>

          <h2>Other Ways to Connect</h2>
          <p>If you prefer other communication channels, you can also reach us through:</p>
          <ul>
            <li>
              <strong>GitHub Issues:</strong> For bug reports and feature requests, please use our{' '}
              <a href="https://github.com/chaos-mesh/chaos-mesh/issues" target="_blank" rel="noopener noreferrer">
                GitHub repository
              </a>
            </li>
            <li>
              <strong>Slack:</strong> Join our community discussions in the{' '}
              <a href="https://cloud-native.slack.com/archives/C0193VAV272" target="_blank" rel="noopener noreferrer">
                CNCF Slack workspace (#project-chaos-mesh)
              </a>
            </li>
            <li>
              <strong>Community Group:</strong> Participate in our{' '}
              <a href="https://community.cncf.io/chaos-mesh-community/" target="_blank" rel="noopener noreferrer">
                CNCF Community Group
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
