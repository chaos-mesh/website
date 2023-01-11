import BrowserOnly from '@docusaurus/BrowserOnly'
import { useDoc } from '@docusaurus/theme-common/internal'
import TOC from '@theme-original/TOC'
import React from 'react'

export default function TOCWrapper(props) {
  return (
    <>
      <BrowserOnly>
        {() => {
          const pathname = window.location.pathname

          if (!pathname.startsWith('/docs')) {
            return null
          }

          const { metadata } = useDoc()
          const { editUrl } = metadata

          return (
            <a
              style={{
                display: 'block',
                marginBottom: '1rem',
              }}
              href={`https://gitpod.io/#${editUrl.replace('edit', 'blob')}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" />
            </a>
          )
        }}
      </BrowserOnly>
      <TOC {...props} />
    </>
  )
}
