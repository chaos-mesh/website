import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import PickVersion from '../components/PickVersion'
import whoIsUsing from '../data/whoIsUsing'
import styles from './index.module.css'

function Feature({ imgUrl, title, description, reverse }) {
  return (
    <div className={clsx('row', 'tw-mb-6 last:tw-mb-0 md:tw-mb-16', reverse && 'tw-flex-row-reverse')}>
      <div className="col col--6 text--center">
        <img className="tw-h-48 tw-mb-6 md:tw-h-64 md:tw-mb-0" src={useBaseUrl(imgUrl)} alt={title} />
      </div>
      <div className="col col--6 tw-flex tw-items-center">
        <div>
          <h3>{title}</h3>
          <div>{description}</div>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={siteConfig.tagline} description={siteConfig.tagline}>
      <main>
        <div className="hero">
          <div className="container text--center">
            <div className={styles.heroLogoWrapper}>
              <img className="tw-w-4/5 tw-h-4/5" src={useBaseUrl('img/logos/logo-mini.svg')} alt="Chaos Mesh" />
            </div>
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">
              <Translate id="siteConfig.tagline">{siteConfig.tagline}</Translate>
            </p>
          </div>
        </div>

        <div className="hero-divider" />

        <div className="hero">
          <div className="container text--center">
            <h2 className="hero__subtitle">
              <Translate id="home.quickstart">Start By One Line</Translate>
            </h2>
            <PickVersion>curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash</PickVersion>
          </div>
        </div>

        <div className="hero-divider" />

        <div className="hero">
          <div className="container">
            <Feature
              imgUrl="img/features/undraw_server_down_s4lk.svg"
              title={<Translate id="home.easytouse">Easy to Use</Translate>}
              description={
                <>
                  <p>
                    <Translate
                      id="home.easytouse.1"
                      values={{
                        minikube: <Link to="https://minikube.sigs.k8s.io/">minikube</Link>,
                        kind: <Link to="https://kind.sigs.k8s.io/">kind</Link>,
                      }}
                    >
                      {
                        'No special dependencies, Chaos Mesh can be easily deployed on Kubernetes clusters directly, including {minikube} and {kind}.'
                      }
                    </Translate>
                  </p>
                  <ul>
                    <li>
                      <Translate id="home.easytouse.2">
                        Ability to perform chaos experiments in production environments without modifying the deployment
                        logic of the application.
                      </Translate>
                    </li>
                    <li>
                      <Translate id="home.easytouse.3">
                        Easily orchestrate the behavior of chaos experiments, allowing users to observe the state of the
                        experiment itself in real time and quickly rollback any injected failures.
                      </Translate>
                    </li>
                    <li>
                      <Translate id="home.easytouse.4">
                        Packed with dashboard. No handwritten experiment definitions are required, and a chaos
                        experiment can be run smoothly in just a few clicks.
                      </Translate>
                    </li>
                  </ul>
                </>
              }
            />
            <Feature
              imgUrl="img/logos/kubernetes.svg"
              title={<Translate id="home.k8s">Design for Kubernetes</Translate>}
              description={
                <>
                  <p>
                    <Translate
                      id="home.k8s.1"
                      values={{
                        crd: (
                          <Link to="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/">
                            CustomResourceDefinition (CRD)
                          </Link>
                        ),
                      }}
                    >
                      {'Chaos Mesh uses {crd} to define chaos experiments.'}
                    </Translate>
                  </p>
                  <p>
                    <Translate id="home.k8s.2">
                      In the Kubernetes realm, CRD is a proven solution for implementing custom resources. CRD enables
                      the natural integration of Chaos Mesh with the Kubernetes ecosystem.
                    </Translate>
                  </p>
                </>
              }
              reverse={true}
            />
            <Feature
              imgUrl="img/features/undraw_Operating_system_re_iqsc.svg"
              title={<Translate id="home.failuretypes">A wide variety of failure types</Translate>}
              description={
                <p>
                  <Translate id="home.failuretypes.1">
                    Chaos Mesh initially started from a distributed system perspective, fully considering the possible
                    failures of distributed systems, thus providing a more comprehensive and fine-grained fault type to
                    help users with fault injection for network, disk, file system, operating system, etc. in a
                    comprehensive manner.
                  </Translate>
                </p>
              }
            />
            <Feature
              imgUrl="img/features/undraw_Security_on_re_e491.svg"
              title={<Translate id="home.safe">Safe and Controllable</Translate>}
              description={
                <>
                  <p>
                    <Translate id="home.safe.1">
                      Chaos Mesh provides role-based access control. Users can create roles with corresponding
                      permissions according to their needs, such as visitor roles, administrative roles, etc.
                    </Translate>
                  </p>
                  <p>
                    <Translate id="home.safe.2">
                      In addition, Chaos Mesh supports setting up Namespace whitelists and blacklists, which allow users
                      to protect important Namespaces and thus gain greater control over the "blast radius" of
                      experiments.
                    </Translate>
                  </p>
                </>
              }
              reverse={true}
            />
          </div>
        </div>

        <div className="hero-divider" />

        <div className="hero">
          <div className="container text--center">
            <h2 className="hero__subtitle">
              <Translate id="home.whoisusing">Who is Using Chaos Mesh</Translate>
            </h2>
            <div className={styles.whiteboard}>
              <div className="row">
                {whoIsUsing.map((w) => (
                  <div key={w.name} className={clsx('col col--3', styles.whiteboardCol)}>
                    <a
                      className="tw-flex tw-justify-center tw-items-center tw-h-[100px] md:tw-h-[150px]"
                      href={w.href}
                      target="_blank"
                    >
                      <img className="tw-w-3/4" style={w.style} src={useBaseUrl(w.img)} alt={w.name} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-divider" />

        <div className="hero">
          <div className="container text--center">
            <h2 className="hero__subtitle">
              Chaos Mesh is a <Link to="https://cncf.io/">Cloud Native Computing Foundation</Link> incubating project
            </h2>
            <div className="cncf-logo tw-h-16 md:tw-h-24" />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
