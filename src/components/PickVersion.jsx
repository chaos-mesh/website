import BrowserOnly from '@docusaurus/BrowserOnly'
import CodeBlock from '@theme/CodeBlock'
import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'

export const usePickVersion = (siteConfig, versions) => {
  const pathname = window.location.pathname

  let preferred = window.localStorage.getItem('docs-preferred-version-default')
  if (pathname === siteConfig.baseUrl && preferred) {
    return preferred === 'current' ? 'latest' : preferred
  }

  if (pathname.includes('/docs/next')) {
    return 'latest'
  }

  const latestStableVersion = versions.filter((d) => d.isLast)[0].name
  const activeVersion = versions.filter((d) => pathname.includes(d.name)).map((d) => d.name)[0]

  return activeVersion || latestStableVersion
}

const PickVersion = ({ children, replaced = 'latest', className = 'language-bash' }) => {
  const { siteConfig } = useDocusaurusContext()
  const { versions } = usePluginData('docusaurus-plugin-content-docs')

  return (
    <BrowserOnly>
      {() => {
        const version = usePickVersion(siteConfig, versions)
        const rendered = version === 'latest' ? children : children.replace(replaced, 'v' + version)

        return <CodeBlock className={className}>{rendered}</CodeBlock>
      }}
    </BrowserOnly>
  )
}

export default PickVersion
