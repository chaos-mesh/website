import BrowserOnly from '@docusaurus/BrowserOnly'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import CodeBlock from '@theme/CodeBlock'

/**
 *
 * @param {*} siteConfig
 * @param {object[]} versions
 * @returns
 */
export const usePickVersion = (siteConfig, versions) => {
  const pathname = window.location.pathname

  let preferred = window.localStorage.getItem('docs-preferred-version-default')
  // Get the last selected version from local storage on the homepage.
  if (pathname === siteConfig.baseUrl && preferred) {
    return preferred === 'current' ? 'latest' : preferred
  }

  if (pathname.includes('/docs/next')) {
    return 'latest'
  }

  const latestStableVersion = versions.find((d) => d.isLast)
  const activeVersion = versions.find((d) => pathname.includes(d.name))

  return activeVersion ? activeVersion.name : latestStableVersion.name
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
  console.log(children);
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
