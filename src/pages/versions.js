import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import { archivedVersions, stableVersions } from '../data/versions'
import styles from './versions.module.css'

const allVersionsText = 'All Versions of Chaos Mesh'

export default function Versions() {
  return (
    <Layout title="Versions" description={allVersionsText}>
      <div className="hero">
        <div className="container">
          <h1>{allVersionsText}</h1>
          <p>
            Each version of Chaos Mesh will have its fixed support cycle. As we continue to develop and iterate, some
            versions will be phased out over time. We will keep the last three stable and development versions in the
            official documentation, and the rest will be archived.
          </p>
          <p>
            You can learn more about our version support via <Link to="/supported-releases">Supported Releases</Link>.
          </p>

          <h2>Development version</h2>
          <p>
            The development version is the latest version of Chaos Mesh. It is under active development and may be
            unstable. <strong>It is not recommended to use it in production</strong>.
          </p>
          <Link
            to="/docs/next"
            className={clsx('button button--outline button--primary margin-right--sm', styles.viewNextDoc)}
          >
            View Documentation
          </Link>
          <Link
            to="https://github.com/chaos-mesh/chaos-mesh/commits/master"
            className="button button--outline button--primary"
          >
            Recent Commits
          </Link>

          <h2 className="margin-top--lg">Stable versions</h2>
          <p>
            The stable versions are the latest three versions of Chaos Mesh. They are stable and recommended to use in
            production.
          </p>

          <div className="row">
            {stableVersions.map((version, i) => (
              <div key={version.version} className={clsx('col col--4', styles.cardCol)}>
                <div className="card shadow--md">
                  <div className="card__header">
                    <h3>v{version.version}</h3>
                  </div>
                  <div className="card__body">
                    <p>
                      Release Date: <b>{version.date}</b>.
                    </p>
                  </div>
                  <div className="card__footer">
                    <div className="button-group">
                      <Link
                        to={`/docs${i === 0 ? '' : '/' + version.version}`}
                        className="button button--outline button--primary"
                      >
                        Documentation
                      </Link>
                      <Link
                        to={`https://github.com/chaos-mesh/chaos-mesh/releases/tag/v${version.version}`}
                        className="button button--outline button--primary"
                      >
                        Release Notes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="margin-top--lg">Archived versions</h2>
          <p>
            The archived versions are the versions of Chaos Mesh that are no longer supported.{' '}
            <strong>We recommand you to upgrade to the latest stable version if possible</strong>.
          </p>
          <table>
            <tbody>
              {archivedVersions.map((version, i) => (
                <tr key={version}>
                  <th scope="row">v{version}</th>
                  <td>
                    <Link
                      to={`https://chaos-mesh-website-archived.netlify.app/docs${i === 0 ? '' : '/' + version}`}
                      className="button button--outline button--primary"
                    >
                      Documentation
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`https://github.com/chaos-mesh/chaos-mesh/releases/tag/v${version}`}
                      className="button button--outline button--primary"
                    >
                      Release Notes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
