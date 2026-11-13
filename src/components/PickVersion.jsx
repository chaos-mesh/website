import { useDocsVersion } from '@docusaurus/plugin-content-docs/client'
import CodeBlock from '@theme/CodeBlock'

export function usePickVersion() {
  const { version } = useDocsVersion()
  return version === 'current' ? 'latest' : version
}

function versionToGitHubRef(version) {
  return version === 'latest' ? 'refs/heads/master' : `refs/tags/v${version}`
}

const PickVersion = ({
  children,
  // `replaced` represent the string would be replaced in the original content.
  replaced = 'latest',
  // When `isArchive` is true, it would be replaced as patterns like `refs/heads/master` or `refs/tags/vX.Y.Z`.
  // When `isArchive` is false, it would be replaced with `vX.Y.Z`.
  isArchive = false,
  className = 'language-bash',
}) => {
  const version = usePickVersion()
  const rendered = isArchive
    ? children.replace(replaced, versionToGitHubRef(version))
    : version === 'latest'
      ? children
      : children.replace(replaced, 'v' + version)

  return <CodeBlock className={className}>{rendered}</CodeBlock>
}

export default PickVersion
