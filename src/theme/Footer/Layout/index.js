import { ThemeClassNames } from '@docusaurus/theme-common'
import clsx from 'clsx'
import React from 'react'

import CalComPopupEmbed from '../../../components/CalComPopupEmbed'

export default function FooterLayout({ style, links, logo, copyright }) {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}
    >
      <div className="container container-fluid">
        {links}
        {(logo || copyright) && (
          <div className="footer__bottom text--center">
            {logo && <div className="margin-bottom--sm">{logo}</div>}
            {copyright}
          </div>
        )}
      </div>

      {/* Floating Cal.com button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <CalComPopupEmbed />
      </div>
    </footer>
  )
}
