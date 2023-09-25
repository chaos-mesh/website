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

import IconLibrary from '../../static/img/icons/library.svg'
import IconOctocat from '../../static/img/icons/octocat.svg'
import IconGithub from '../../static/img/icons/github.svg'
import IconHelp from '../../static/img/icons/help.svg'
import IconPlay from '../../static/img/icons/play.svg'
import Card from '../components/Card'
import ChaosdFeatures from '../components/ChaosdFeatures'
import CodeGrid from '../components/CodeGrid'
import Features from '../components/Features'
import Mesh from '../components/Mesh'
import PickVersion from '../components/PickVersion'
import whoIsUsing from '../data/whoIsUsing'
import styles from './index.module.css'

gsap.registerPlugin(ScrollTrigger)

const description =
  'Chaos Mesh brings various types of fault simulation to Kubernetes and has an enormous capability to orchestrate fault scenarios. It helps you conveniently simulate various abnormalities that might occur in reality during the development, testing, and production environments and find potential problems in the system.'

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

    gsap.from('.scroll-to-display-x', {
      duration: 1,
      opacity: 0,
      x: 75,
      y: 100,
      stagger: 0.25,
      scrollTrigger: {
        trigger: '.scroll-to-display-x',
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
                <div className="tw-flex tw-gap-3">
                  <Link
                    to="/docs/production-installation-using-helm"
                    className="tw-btn tw-btn-primary hover:tw-text-white hover:-tw-translate-y-1"
                  >
                    Get Started →
                  </Link>
                  <Link
                    to="https://github.com/chaos-mesh/chaos-mesh"
                    className="tw-btn tw-btn-neutral tw-gap-2 dark:tw-glass hover:tw-text-white hover:-tw-translate-y-1"
                  >
                    <IconOctocat className="tw-w-4 tw-h-4 tw-fill-white" />
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
              <Translate id="home.whoisusing">Users of Chaos Mesh</Translate>
            </h2>
            <div className="max-md:tw-overflow-x-auto dark:tw-invert dark:tw-saturate-0">
              <div className="row max-md:tw-w-[1280px]">
                {whoIsUsing.map((w) => (
                  <div key={w.name} className={clsx('col col--1', styles.whiteboardCol)}>
                    <a
                      className="tw-flex tw-justify-center tw-items-center tw-h-[100px] tw-select-none"
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
            <div className="tw-max-w-[800px] tw-mb-12 tw-mx-auto tw-text-center">
              {/* TODO: add translation. */}
              <h2 className="tw-text-4xl xl:tw-text-5xl">
                Make <span className={styles.heroTitle}>Cloud Native + Chaos Engineering</span> simple and
                straightforward.
              </h2>
              <p className="lg:tw-text-lg tw-font-medium">
                Based on the principles of Chaos Engineering, Chaos Mesh abstracts real-world events into objects that
                can be directly applied, hiding the trivial details.
              </p>
            </div>

            <div className="tw-grid tw-gap-8 lg:tw-grid-rows-2 lg:tw-grid-cols-6">
              <Features />
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="tw-container tw-mx-auto max-lg:tw-px-4">
            <div className="tw-max-w-[800px] tw-mx-auto tw-text-center">
              {/* TODO: add translation. */}
              <h2 className="tw-text-4xl xl:tw-text-5xl">
                <span className={styles.heroTitle}>Wide variety</span> of failure types.
              </h2>
              <p className="lg:tw-text-lg tw-font-medium">
                <Translate id="home.failuretypes.1">
                  Chaos Mesh initially started from a distributed system perspective, fully considering its possible
                  failures, thus providing more comprehensive and fine-grained fault types to help users with fault
                  injection for networks, disks, file systems, operating systems, etc.
                </Translate>
              </p>
            </div>
            <img
              className={clsx(
                'tw-block tw-mx-auto tw-select-none dark:tw-invert-[.85] dark:tw-saturate-0',
                styles.chaosCategory
              )}
              src="img/home/chaos-category.svg"
              alt="Chaos Category"
            />

            <div className="tw-flex tw-justify-center tw-mt-12">
              <Link
                to="/docs/simulate-pod-chaos-on-kubernetes"
                className="tw-btn tw-btn-primary tw-gap-2 hover:tw-text-white hover:-tw-translate-y-1"
              >
                <IconLibrary className="tw-w-4 tw-h-4 tw-fill-white" />
                Explore More
              </Link>
            </div>
            <div className="tw-grid tw-gap-8 lg:tw-grid-cols-3 tw-my-12">
              <CodeGrid />
            </div>
          </div>
        </div>

        <div className="hero tw-relative">
          <div className="tw-absolute tw-top-[-50px] tw-left-0 md:tw-top-[-100px] xl:tw-top-[-200px] tw-w-full">
            <img src="/img/home/curve-divider.svg" />
          </div>
          <div className="tw-container tw-mx-auto max-lg:tw-px-4">
            <div className="tw-relative tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-gap-8">
              <div className="tw-flex-1">
                <div className="xl:tw-w-[90%]">
                  {/* TODO: add translation. */}
                  <h2 className="tw-text-4xl xl:tw-text-5xl">
                    Orchestrate complex fault scenarios with <span className={styles.heroTitle}>Workflows</span>.
                  </h2>
                  <p className="lg:tw-text-lg tw-font-medium">
                    Real-world failures are often not isolated causes.Chaos Mesh has built-in workflows that allow you
                    to experiment serially or in parallel at will to build walkthroughs that fit the architecture.
                  </p>
                  <div className="tw-flex tw-gap-4 tw-mb-6">
                    <Card>
                      <h4 className="text-lg">Suspend</h4>
                      <p>You can also use the suspend node to simulate a temporary recovery.</p>
                    </Card>
                    <Card>
                      <h4 className="text-lg">Status Check</h4>
                      <p>You can also use customized status checks to inform the cluster status.</p>
                    </Card>
                  </div>
                  <Link
                    to="/docs/create-chaos-mesh-workflow/"
                    className="tw-btn tw-btn-primary tw-gap-2 hover:tw-text-white hover:-tw-translate-y-1"
                  >
                    <IconPlay className="tw-w-4 tw-h-4 tw-fill-white" />
                    Start Creating
                  </Link>
                </div>
              </div>
              <div className={clsx('tw-flex-[1.5] tw-rounded-2xl', styles.workflowsImg)} />
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="tw-container tw-mx-auto max-lg:tw-px-4">
            <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-gap-8">
              <div className={clsx('tw-relative tw-flex-1 tw-flex tw-items-center tw-overflow-hidden xl:tw-h-[640px]')}>
                <img className="tw-absolute tw-w-[90%]" src="/img/home/chaosd-bg.svg" />
                <div className="tw-flex tw-justify-center tw-items-center xl:tw-w-[75%] lg:tw-h-[100%]">
                  <ChaosdFeatures />
                </div>
              </div>
              <div className="tw-flex-[1.5] tw-z-10">
                <span className="tw-badge tw-badge-primary">Experimental</span>
                {/* TODO: add translation. */}
                <h2 className="tw-text-4xl xl:tw-text-5xl">
                  Meet
                  <span className={styles.heroTitle}>Chaosd</span>: A Chaos Toolkit for Physical Machines.
                </h2>
                <p className="lg:tw-text-lg tw-font-medium">
                  Even if you are not using Kubernetes, you can still take advantage of the features offered by Chaos
                  Mesh. One of our experimental tools, Chaosd, is specifically designed to test chaos on physical
                  machines. Moreover, you can use{' '}
                  <Link className="tw-underline dark:tw-no-underline" to="/docs/simulate-physical-machine-chaos">
                    PhysicalMachineChaos
                  </Link>{' '}
                  in Chaos Mesh to remotely invoke Chaosd for conducting experiments on physical machines.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="tw-container tw-mx-auto max-lg:tw-px-4">
            <div className="tw-max-w-[800px] tw-mb-12 tw-mx-auto tw-text-center">
              {/* TODO: add translation. */}
              <h2 className="tw-text-4xl xl:tw-text-5xl">
                Building the Whole Community <span className={styles.heroTitle}>Together</span>.
              </h2>
              <p className="lg:tw-text-lg tw-font-medium">
                <Translate id="home.buildcommunity.1">
                  Join the community and talk to the maintainers and other users, your suggestions can make Chaos Mesh
                  even better.
                </Translate>
              </p>
            </div>
            <div className="tw-grid lg:tw-grid-cols-3 tw-gap-8 tw-mb-12 lg:tw-w-[80%] lg:tw-mx-auto">
              <Card>
                <IconGithub className="tw-w-12 tw-h-12 dark:tw-fill-white" />
                <p>Join our contributors in building the future of Chaos Mesh.</p>
                <Link
                  to="https://github.com/chaos-mesh/chaos-mesh"
                  className="tw-btn tw-bg-[#f2f2f2] tw-text-[#1f2937] dark:tw-text-[#a6adba] hover:!tw-bg-[#e6e6e6] tw-normal-case dark:tw-glass dark:hover:!tw-bg-transparent dark:hover:tw-text-white"
                >
                  Star on GitHub
                </Link>
              </Card>
              <Card>
                <IconHelp className="tw-w-12 tw-h-12 dark:tw-fill-white" />
                <p>Experiencing any issues? Don't hesitate to reach out to us for assistance.</p>
                <div className="tw-flex tw-gap-3">
                  <Link
                    to="https://github.com/chaos-mesh/chaos-mesh/issues"
                    className="tw-btn tw-bg-[#f2f2f2] tw-text-[#1f2937] dark:tw-text-[#a6adba] hover:!tw-bg-[#e6e6e6] tw-normal-case dark:tw-glass dark:hover:!tw-bg-transparent dark:hover:tw-text-white"
                  >
                    Issues
                  </Link>
                  <Link
                    to="https://github.com/chaos-mesh/chaos-mesh/discussions"
                    className="tw-btn tw-bg-[#f2f2f2] tw-text-[#1f2937] dark:tw-text-[#a6adba] hover:!tw-bg-[#e6e6e6] tw-normal-case dark:tw-glass dark:hover:!tw-bg-transparent dark:hover:tw-text-white"
                  >
                    Discussions
                  </Link>
                </div>
              </Card>
              <Card>
                <img className="tw-w-12 tw-h-12 tw-scale-150" src="/img/icons/slack.svg" alt="Slack" />
                <p>Connect with other users on our Slack channel (#project-chaos-mesh).</p>
                <Link
                  to="https://slack.cncf.io"
                  className="tw-btn tw-bg-[#f2f2f2] tw-text-[#1f2937] dark:tw-text-[#a6adba] hover:!tw-bg-[#e6e6e6] tw-normal-case dark:tw-glass dark:hover:!tw-bg-transparent dark:hover:tw-text-white"
                >
                  Join Slack channel
                </Link>
              </Card>
            </div>
            <p className="tw-font-medium tw-text-center">
              Chaos Mesh is a{' '}
              <Link className="tw-underline dark:tw-no-underline" to="https://cncf.io/">
                Cloud Native Computing Foundation
              </Link>{' '}
              incubating project.
            </p>
            <div className="cncf-logo tw-h-16" />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
