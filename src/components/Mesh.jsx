import { useColorMode } from '@docusaurus/theme-common'
import { gsap } from 'gsap'
import React, { useLayoutEffect, useRef } from 'react'
import Typewriter from 'typewriter-effect/dist/core'

import { useDidMountEffect } from '../utils/hooks'

const rows = 10
const dotsPerRow = 10
const dotsNum = rows * dotsPerRow
const spacing = 30
const dotColor1 = '#f25c7c'
const dotColor2 = '#10a6fa'

function setNeutralDotColor(theme) {
  return theme !== 'dark' ? '#333' : '#eee'
}

function setDotColor(theme) {
  return Math.random() > 0.65 ? dotColor1 : Math.random() < 0.35 ? dotColor2 : setNeutralDotColor(theme)
}

function setLineColor(theme) {
  return theme !== 'dark' ? '#eee' : '#333'
}

export default function Mesh() {
  const svgEl = useRef()
  const pathsGroup = useRef()
  const dotsGroup = useRef()

  const { colorMode } = useColorMode()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const pts = []
      let i = 0

      for (let row = 0; row < rows; row++) {
        for (let dotNum = 0; dotNum < dotsPerRow; dotNum++) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

          gsap.set(path, {
            attr: { class: 'path path-' + i, fill: 'none', stroke: setLineColor(colorMode), 'stroke-width': 0.3 },
          })
          pathsGroup.current.appendChild(path)

          const dotG = document.createElementNS('http://www.w3.org/2000/svg', 'g')
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          const position = { x: (row % 2 ? 0 : spacing) + dotNum * spacing * 2, y: row * spacing }
          pts.push(position)

          gsap.set(dotG, {
            attr: { class: 'dot dot-' + i },
            ...position,
          })

          const color = setDotColor(colorMode)
          gsap.set(dot, {
            attr: { class: 'dot-inner', r: 1, fill: color, stroke: color, 'stroke-opacity': 0.5, 'stroke-width': 1 },
          })

          dotG.appendChild(dot)
          dotsGroup.current.appendChild(dotG)

          i++
        }
      }

      gsap.to('.dot', {
        duration: 3,
        x: '+=6',
        y: '-=12',
        ease: 'sine.inOut',
        stagger: { grid: [rows, dotsPerRow], amount: 1, from: 'random', repeat: -1, yoyo: true },
        onUpdate: reDraw,
      })

      let scaling = false
      let percent = 0
      let curve1 = 5
      let curve2 = 0
      let curve2Range = [3, 4, 5]
      let injectedDot = 64
      let injectedDots = [64]

      function reDraw() {
        let row = 0

        for (let i = 0; i < pts.length; i++) {
          pts[i] = { x: gsap.getProperty('.dot-' + i, 'x'), y: gsap.getProperty('.dot-' + i, 'y') }

          if (i % dotsPerRow === 0) {
            row++
          }

          if (row < rows) {
            if ((i % dotsPerRow === 0 && row % 2 === 0) || (i % dotsPerRow === dotsPerRow - 1 && row % 2 === 1)) {
              gsap.set('.path-' + i, {
                attr: {
                  d: 'M' + pts[i].x + ',' + pts[i].y + ' L' + pts[i + dotsPerRow].x + ',' + pts[i + dotsPerRow].y,
                },
              })
            } else {
              if (row % 2 === 1) {
                const start = `M ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y}`
                let dot = ` L ${pts[i].x} ${pts[i].y}`
                let end = ` L ${pts[i + dotsPerRow + 1].x} ${pts[i + dotsPerRow + 1].y}`
                const d = start + dot + end

                if (i === injectedDot && scaling) {
                  dot = ` C ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y - curve1 * percent}, ${pts[i].x} ${
                    pts[i].y + curve2 * percent
                  }, ${pts[i].x} ${pts[i].y}`
                  end = ` C ${pts[i].x + curve2 * percent} ${pts[i].y}, ${
                    pts[i + dotsPerRow + 1].x - curve1 * percent
                  } ${pts[i + dotsPerRow + 1].y}, ${pts[i + dotsPerRow + 1].x} ${pts[i + dotsPerRow + 1].y}`

                  gsap.set('.path-' + i, {
                    attr: {
                      d: start + dot + end,
                      'stroke-dasharray': `30 ${10 * percent}`,
                    },
                  })
                } else {
                  gsap.set('.path-' + i, {
                    attr: {
                      d,
                    },
                  })
                }
              } else {
                const start = `M ${pts[i + dotsPerRow - 1].x} ${pts[i + dotsPerRow - 1].y}`
                let dot = ` L ${pts[i].x} ${pts[i].y}`
                let end = ` L ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y}`
                const d = start + dot + end

                if (i === injectedDot - dotsPerRow && scaling) {
                  end = ` C ${pts[i].x + curve1 * percent} ${pts[i].y}, ${pts[i + dotsPerRow].x - curve2 * percent} ${
                    pts[i + dotsPerRow].y
                  }, ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y}`

                  gsap.set('.path-' + i, {
                    attr: {
                      d: start + dot + end,
                      'stroke-dasharray': `30 ${10 * percent}`,
                    },
                  })
                } else if (i === injectedDot - dotsPerRow + 1 && scaling) {
                  dot = ` C ${pts[i + dotsPerRow - 1].x} ${pts[i + dotsPerRow - 1].y - curve2 * percent}, ${pts[i].x} ${
                    pts[i].y + curve1 * percent
                  }, ${pts[i].x} ${pts[i].y}`

                  gsap.set('.path-' + i, {
                    attr: {
                      d: start + dot + end,
                      'stroke-dasharray': `30 ${10 * percent}`,
                    },
                  })
                } else if ((i === injectedDot + dotsPerRow || i === injectedDot + dotsPerRow + 1) && scaling) {
                  gsap.set('.path-' + i, {
                    attr: {
                      d,
                      'stroke-dasharray': `30 ${10 * percent}`,
                    },
                  })
                } else {
                  gsap.set('.path-' + i, {
                    attr: {
                      d,
                    },
                  })
                }
              }
            }
          }
        }
      }

      // Add rotation animation.
      svgEl.current.addEventListener('mousemove', (e) => {
        const rotationX = Math.max((1 - e.clientY / window.innerHeight) * 45, 30)
        const rotationY = Math.max((1 - e.clientX / window.innerWidth) * -18, -9)

        gsap.to('.mesh', {
          duration: 1.5,
          rotationX,
          rotationY,
        })
      })

      function injectChaos() {
        if (!scaling) {
          curve2 = curve2Range[Math.floor(Math.random() * curve2Range.length)]
          injectedDot = injectedDots[Math.floor(Math.random() * injectedDots.length)]

          scaling = true

          const rect = document.querySelector(`.dot-${injectedDot}`).getBoundingClientRect()
          const top = rect.top + 100
          const left = rect.left - 250
          gsap.fromTo(
            '.mesh-text',
            {
              top,
              left,
            },
            {
              duration: 1,
              opacity: 1,
              top: top - 50,
              left: left + 25,
            }
          )
          new Typewriter('.mesh-text', { delay: 50 })
            .typeString('Injecting NetworkChaos/loss...')
            .pauseFor(500)
            .deleteAll()
            .typeString('Simulating packet loss...')
            .pauseFor(2000)
            .deleteAll()
            .typeString('⏳ Recovering...')
            .pauseFor(1500)
            .deleteAll()
            .typeString('✅ Done!')
            .pauseFor(1000)
            .callFunction(() => {
              gsap.fromTo(
                '.mesh-text',
                {
                  top: top - 50,
                  left: left + 25,
                },
                {
                  opacity: 0,
                  top,
                  left: left + 25,
                }
              )
            })
            .start()

          const injected = gsap.to(`.dot-${injectedDot}`, {
            duration: 2,
            scale: 5,
            ease: 'back.inOut(3)',
            repeat: 7,
            yoyo: true,
            onUpdate: function () {
              percent = injected.time()
            },
            onComplete: () => (scaling = false),
          })
          const dotG = document.querySelector(`.dot-${injectedDot}`)
          for (let i = 0; i < 12; i++) {
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

            gsap.set(dot, {
              attr: {
                class: `wave wave-${i}`,
                r: 0,
                fill: 'none',
                stroke: gsap.getProperty(`.dot-${injectedDot} > .dot-inner`, 'fill'),
                'stroke-opacity': 0.5,
                'stroke-width': 0.3,
              },
            })

            dotG.appendChild(dot)
          }
          const tl = gsap.timeline({
            onComplete: function () {
              document.querySelectorAll('.wave').forEach((el) => el.remove())
            },
          })
          for (let i = 0; i < 12; i++) {
            tl.to(`.wave-${i}`, {
              duration: 1,
              attr: {
                r: 10,
                'stroke-opacity': 0,
                'stroke-width': 0,
              },
              ease: 'sine.inOut',
            })
          }
        }
      }

      svgEl.current.addEventListener('click', () => {
        // Stop in mobile devices.
        if (window.matchMedia('(min-width: 768px)').matches) {
          injectChaos()
        }
      })
    }, svgEl)

    window.gsapCtx = ctx

    return () => {
      ctx.kill()
    }
  }, [])

  useDidMountEffect(() => {
    for (let i = 0; i < dotsNum; i++) {
      const fill = gsap.getProperty(`.dot-${i} > .dot-inner`, 'fill')

      if (fill !== 'rgb(16, 166, 250)' && fill !== 'rgb(242, 92, 124)') {
        const dotColor = setNeutralDotColor(colorMode)

        gsap.set(`.dot-${i} > .dot-inner`, {
          attr: {
            fill: dotColor,
            stroke: dotColor,
          },
        })
      }
    }
    gsap.set('.path', {
      attr: {
        stroke: setLineColor(colorMode),
      },
    })
  }, [colorMode])

  return (
    <>
      <svg
        ref={svgEl}
        className="mesh tw-absolute tw-top-[-10%] 2xl:tw-left-[-100px] tw-w-[1024px] lg:tw-w-full tw-h-[125%]"
        style={{
          transform: 'rotate3d(3, -.6, -1, 30deg)',
        }}
        viewBox="0 0 500 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={pathsGroup} />
        <g ref={dotsGroup} />
      </svg>
      <div className={`mesh-text tw-absolute tw-px-2 tw-py-1 tw-bg-primary tw-text-white tw-rounded tw-opacity-0`} />
    </>
  )
}
