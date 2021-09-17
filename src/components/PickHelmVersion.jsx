import BrowserOnly from '@docusaurus/BrowserOnly'
import CodeBlock from '../theme/CodeBlock'
import React from 'react'
import { usePickVersion } from './PickVersion'

const PickHelmVersion = ({ children, className }) => {
  const calcHelmChartVersion = (version) => {
    if (version[0] === '2') {
      return version
    }

    const startPart = version.slice(0, 3)
    const helmChartVersionStartPart = parseFloat(startPart) - 0.7

    return helmChartVersionStartPart + version.slice(3)
  }

  const version = usePickVersion()
  const realVersion = version === 'latest' ? '' : `--version v${calcHelmChartVersion(version)}`

  return (
    <BrowserOnly>
      {() => {
        return <CodeBlock className={className}>{children.replace('--version latest', realVersion).trim()}</CodeBlock>
      }}
    </BrowserOnly>
  )
}

export default PickHelmVersion
