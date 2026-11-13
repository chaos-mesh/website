import { useDocsVersion } from '@docusaurus/plugin-content-docs/client'
import CodeBlock from '@theme/CodeBlock'

export function usePickVersion() {
  const { version } = useDocsVersion()
  return version === 'current' ? 'latest' : version
}

const PickVersion = ({ children, className = 'language-bash' }) => {
  const version = usePickVersion()
  const rendered = version === 'latest' ? children : children.replace('latest', 'v' + version)

  return <CodeBlock className={className}>{rendered}</CodeBlock>
}

export default PickVersion
