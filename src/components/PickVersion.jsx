import BrowserOnly from '@docusaurus/BrowserOnly'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import CodeBlock from '@theme/CodeBlock'
import React from 'react'

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

function versionToGitHubRef(version) {
  return version === 'latest' ? 'refs/heads/master' : `refs/tags/v${version}`
}

const PickVersion = ({
  children,
  // replaced represent the string would be replaced in the original content
  replaced = 'latest',
  // when `isArchive` is true, it would be replaced as patterns like `refs/heads/master` or `refs/tags/vX.Y.Z`
  // when `isArchive` is false, it would be replaced with `vX.Y.Z`
  isArchive = false,
  className = 'language-bash',
}) => {
  const { siteConfig } = useDocusaurusContext()
  const { versions } = usePluginData('docusaurus-plugin-content-docs')

  return (
    <BrowserOnly>
      {() => {
        const version = usePickVersion(siteConfig, versions)
        const rendered = isArchive
          ? children.replace(replaced, versionToGitHubRef(version))
          : version === 'latest'
          ? children
          : children.replace(replaced, 'v' + version)

        return <CodeBlock className={className}>{rendered}</CodeBlock>
      }}
    </BrowserOnly>
  )
}

export default PickVersion
