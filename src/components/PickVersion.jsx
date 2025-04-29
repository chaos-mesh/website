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

const PickVersion = ({
  children,
  // `replaced` represent the string would be replaced in the original content.
  replaced = 'refs/heads/master',
  className = 'language-bash',
}) => {
  const { siteConfig } = useDocusaurusContext()
  const { versions } = usePluginData('docusaurus-plugin-content-docs')

  return (
    <BrowserOnly>
      {() => {
        const version = usePickVersion(siteConfig, versions)
        const rendered = version === 'latest' ? children : children.replace(replaced, `refs/tags/v${version}`)

        return <CodeBlock className={className}>{rendered}</CodeBlock>
      }}
    </BrowserOnly>
  )
}

export default PickVersion
