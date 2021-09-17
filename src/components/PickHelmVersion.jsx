import BrowserOnly from '@docusaurus/BrowserOnly'
import CodeBlock from '../theme/CodeBlock'
import React from 'react'
import { usePickVersion } from './PickVersion'

const PickHelmVersion = ({ children, className }) => {
  const Result = ({ children }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <CodeBlock className={className}>{children}</CodeBlock>
    </div>
  )

  const calcHelmChartVersion = version => {
      if (version[0] === '2') {
          return version
      }

      const startPart = version.slice(0, 3)
      const helmChartVersionStartPart = (parseFloat(startPart) - 0.7).toString()
      return helmChartVersionStartPart + version.slice(3)
  }

  return (
    <BrowserOnly fallback={<Result>{children}</Result>}>
      {() => {
        const version = usePickVersion()
        const realVersion = version === 'latest' ? "" : `--version v${calcHelmChartVersion(version)}`

        return <Result>{children.replace('--version latest', realVersion).trim()}</Result>
      }}
    </BrowserOnly>
  )
}

export default PickHelmVersion
