import BrowserOnly from '@docusaurus/BrowserOnly'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import CodeBlock from '@theme/CodeBlock'
import React from 'react'
import semver from 'semver'

import { usePickVersion } from './PickVersion'

const calcHelmChartVersion = (version) => {
  if (semver.satisfies(version, '>=2.0.3')) {
    return version
  }

  const startPart = version.slice(0, 3)
  const helmChartVersionStartPart = parseFloat(startPart) - 0.7

  return 'v' + helmChartVersionStartPart.toFixed(1) + version.slice(3)
}

const PickHelmVersion = ({ children, className = 'language-bash' }) => {
  const { siteConfig } = useDocusaurusContext()
  const { versions } = usePluginData('docusaurus-plugin-content-docs')

  return (
    <BrowserOnly>
      {() => {
        const version = usePickVersion(siteConfig, versions)
        const realVersion = version === 'latest' ? '' : `--version ${calcHelmChartVersion(version)}`

        return <CodeBlock className={className}>{children.replace('--version latest', realVersion).trim()}</CodeBlock>
      }}
    </BrowserOnly>
  )
}

export default PickHelmVersion
