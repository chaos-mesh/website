import BrowserOnly from '@docusaurus/BrowserOnly'
import CodeBlock from '../theme/CodeBlock'
import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'

export const usePickVersion = () => {
  const { siteConfig } = useDocusaurusContext()
  const pathname = window.location.pathname

  let preferred = window.localStorage.getItem('docs-preferred-version-default')
  if (pathname === siteConfig.baseUrl && preferred) {
    return preferred === 'current' ? 'latest' : preferred
  }

  if (pathname.includes('/docs/next')) {
    return 'latest'
  }

  const { versions } = usePluginData('docusaurus-plugin-content-docs')
  const latestStableVersion = versions.filter((d) => d.isLast)[0].name
  const activeVersion = versions.filter((d) => pathname.includes(d.name)).map((d) => d.name)[0]

  return activeVersion || latestStableVersion
}

const PickVersion = ({ children, className }) => {
  const Result = ({ children }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <CodeBlock className={className}>{children}</CodeBlock>
    </div>
  )

  return (
    <BrowserOnly fallback={<Result>{children}</Result>}>
      {() => {
        const version = usePickVersion()
        const rendered = version === 'latest' ? children : children.replace('latest', 'v' + version)

        return <Result>{rendered}</Result>
      }}
    </BrowserOnly>
  )
}

export default PickVersion
