import BrowserOnly from '@docusaurus/BrowserOnly'
import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect } from 'react'

import LogoOctocat from '../../static/img/logos/logo-octocat.svg'
import Mesh from '../components/Mesh'
import PickVersion from '../components/PickVersion'
import whoIsUsing from '../data/whoIsUsing'
import styles from './index.module.css'

gsap.registerPlugin(ScrollTrigger)

const description =
  'Chaos Mesh brings various types of fault simulation to Kubernetes and has an enormous capability to orchestrate fault scenarios. It helps you conveniently simulate various abnormalities that might occur in reality during the development, testing, and production environments and find potential problems in the system.'

function Feature({ imgUrl, title, description, className }) {
  const isKubernetes = imgUrl === 'img/logos/kubernetes.svg'

  return (
    <div
      className={clsx(
        'tw-p-6 tw-border-solid tw-border-1 tw-border-base-content tw-border-opacity-10 tw-rounded-2xl',
        className
      )}
    >
      <div
        className={clsx(
          'tw-relative tw-flex tw-flex-col lg:tw-flex-row tw-items-center tw-h-full',
          isKubernetes && 'lg:tw-items-start'
        )}
      >
        {!isKubernetes ? (
          <div className="tw-flex-1 max-lg:tw-mb-6 tw-text-center">
            <img className="scroll-to-display tw-w-[60%] lg:tw-w-[80%]" src={useBaseUrl(imgUrl)} alt={title} />
          </div>
        ) : (
          <img
            className="scroll-to-display lg:tw-absolute lg:tw-right-6 lg:-tw-bottom-12 max-lg:tw-w-[40%] lg:tw-h-48 max-lg:tw-mb-6"
            src={useBaseUrl(imgUrl)}
            alt={title}
          />
        )}
        <div className="tw-flex-1">
          <div>
            <h3>{title}</h3>
            <div>{description}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const { siteConfig } = useDocusaurusContext()

  useEffect(() => {
    document.querySelector('.navbar__inner').classList.add('tw-container', 'tw-mx-auto')

    gsap.from('.scroll-to-display', {
      duration: 1,
      opacity: 0,
      y: 50,
      stagger: 0.25,
      scrollTrigger: {
        trigger: '.scroll-to-display',
        toggleActions: 'restart none none none',
      },
    })
  }, [])

  return (
    <Layout description={description}>
      <Head>
        <title>Chaos Mesh: {siteConfig.tagline}</title>
      </Head>
      <main>
        <div className="hero tw-relative tw-h-[768px] tw-pt-0 tw-overflow-hidden">
          <BrowserOnly>{() => <Mesh />}</BrowserOnly>
          <div className="tw-container tw-mx-auto tw-z-10">
            <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between lg:tw-items-center">
              <div className="tw-flex-[.8] 2xl:tw-flex-[.6] tw-p-6 lg:tw-p-3">
                <h1
                  className={clsx(
                    'tw-inline-block tw-text-5xl xl:tw-text-6xl tw-text-left tw-rounded-2xl tw-backdrop-blur-sm lg:tw-backdrop-blur',
                    styles.heroTitle
                  )}
                >
                  <span>Break</span>
                  <br />
                  Your System
                  <br />
                  <span>Constructively.</span>
                </h1>
                <p className="lg:tw-text-lg tw-font-medium tw-rounded-2xl tw-backdrop-blur-sm lg:tw-backdrop-blur">
                  {/* TODO: add translation. */}
                  <Translate id="home.description">{description}</Translate>
                </p>
                <div className="tw-flex">
                  <Link
                    to="/docs/production-installation-using-helm"
                    className="tw-btn tw-btn-primary tw-btn-sm tw-mr-3 hover:-tw-translate-y-1"
                  >
                    Get Started →
                  </Link>
                  <Link
                    to="https://github.com/chaos-mesh/chaos-mesh"
                    className="tw-btn tw-btn-neutral tw-btn-sm tw-gap-2 dark:tw-glass hover:-tw-translate-y-1"
                  >
                    <LogoOctocat className="tw-w-4 tw-h-4 tw-fill-white dark:tw-fill-black" />
                    GitHub
                  </Link>
                </div>
              </div>

              <div className="lg:max-xl:tw-w-[500px] tw-p-6 lg:tw-p-3">
                <h2 className="tw-inline-block tw-text-base lg:tw-text-lg tw-font-semibold tw-rounded-2xl tw-backdrop-blur-sm lg:tw-backdrop-blur">
                  Try it out with the following command 👇
                </h2>
                <PickVersion>curl -sSL https://mirrors.chaos-mesh.org/latest/install.sh | bash</PickVersion>
              </div>
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="tw-container tw-mx-auto max-lg:tw-px-4 tw-text-center">
            <h2 className="tw-text-lg">
              <Translate id="home.whoisusing">Who is Using Chaos Mesh</Translate>
            </h2>
            <div className={clsx('max-md:tw-overflow-x-auto', styles.whiteboard)}>
              <div className="row max-md:tw-w-[1280px]">
                {whoIsUsing.map((w) => (
                  <div key={w.name} className={clsx('col col--1', styles.whiteboardCol)}>
                    <a
                      className="tw-flex tw-justify-center tw-items-center tw-h-[100px]"
                      href={w.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img style={w.style} src={useBaseUrl(w.img)} alt={w.name} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="tw-container tw-mx-auto max-lg:tw-px-4">
            <div className="tw-max-w-[600px] xl:tw-max-w-[800px] tw-mb-12">
              {/* TODO: add translation. */}
              <h2 className="tw-text-3xl xl:tw-text-4xl">
                Make <span className={styles.heroTitle}>Cloud Native</span> +{' '}
                <span className={styles.heroTitle}>Chaos Engineering</span> simple and straightforward.
              </h2>
              <p className="lg:tw-text-lg tw-font-medium">
                Based on the principles of chaos engineering, Chaos Mesh abstracts real-world events into objects that
                can be directly applied, hiding the trivial details.
              </p>
            </div>

            <div className="tw-grid tw-gap-8 lg:tw-grid-rows-2 lg:tw-grid-cols-6">
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
                            <Link
                              className="tw-underline dark:tw-no-underline"
                              to="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/"
                            >
                              CustomResourceDefinition (CRD)
                            </Link>
                          ),
                        }}
                      >
                        {
                          'In the Kubernetes realm, {crd} is a proven solution for implementing custom resources. Chaos Mesh leverages CRDs for natural integration with the Kubernetes ecosystem.'
                        }
                      </Translate>
                    </p>
                  </>
                }
                className="lg:tw-col-span-2"
              />
              <Feature
                imgUrl="img/features/undraw_server_down_s4lk.svg"
                title={<Translate id="home.easytouse">Easy to Use</Translate>}
                description={
                  <>
                    <p>
                      <Translate
                        id="home.easytouse.1"
                        values={{
                          minikube: (
                            <Link className="tw-underline dark:tw-no-underline" to="https://minikube.sigs.k8s.io/">
                              minikube
                            </Link>
                          ),
                          kind: (
                            <Link className="tw-underline dark:tw-no-underline" to="https://kind.sigs.k8s.io/">
                              kind
                            </Link>
                          ),
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
                          Ability to perform chaos experiments in production environments without modifying the
                          deployment logic of the application.
                        </Translate>
                      </li>
                      <li>
                        <Translate id="home.easytouse.3">
                          Quickly create chaos experiments through the dashboard, allowing users to observe the
                          experiment's state in real time and quickly roll back any injected failures.
                        </Translate>
                      </li>
                    </ul>
                  </>
                }
                className="lg:tw-col-span-4"
              />
              <Feature
                imgUrl="img/features/undraw_stars_re_6je7.svg"
                title={<Translate id="home.failuretypes">A wide variety of failure types</Translate>}
                description={
                  <p>
                    <Translate id="home.failuretypes.1">
                      Chaos Mesh initially started from a distributed system perspective, fully considering its possible
                      failures, thus providing more comprehensive and fine-grained fault types to help users with fault
                      injection for networks, disks, file systems, operating systems, etc.
                    </Translate>
                  </p>
                }
                className="lg:tw-col-span-3"
              />
              <Feature
                imgUrl="img/features/undraw_safe_re_kiil.svg"
                title={<Translate id="home.safe">Safe and Controllable</Translate>}
                description={
                  <>
                    <p>
                      <Translate id="home.safe.1">
                        Chaos Mesh provides role-based access control. Users can create roles with corresponding
                        permissions according to their needs.
                      </Translate>
                    </p>
                    <p>
                      <Translate id="home.safe.2">
                        In addition, Chaos Mesh supports setting up namespace whitelists, which allow users to protect
                        important namespaces and thus gain greater control over the "blast radius" of experiments.
                      </Translate>
                    </p>
                  </>
                }
                className="lg:tw-col-span-3"
              />
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="tw-container tw-mx-auto max-lg:tw-px-4">
            <div className="tw-max-w-[500px] xl:tw-max-w-[700px] tw-mb-12">
              {/* TODO: add translation. */}
              <h2 className="tw-text-3xl xl:tw-text-4xl">
                Orchestrate complex fault scenarios with <span className={styles.heroTitle}>Workflows</span>
              </h2>
              <p className="lg:tw-text-lg tw-font-medium">...</p>
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="tw-container tw-mx-auto max-lg:tw-px-4 tw-text-center">
            <h2 className="tw-text-lg">
              Chaos Mesh is a{' '}
              <Link className="tw-underline dark:tw-no-underline" to="https://cncf.io/">
                Cloud Native Computing Foundation
              </Link>{' '}
              incubating project
            </h2>
            <div className="cncf-logo tw-h-16 md:tw-h-24" />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
