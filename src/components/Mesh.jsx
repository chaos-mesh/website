import React, { useEffect, useRef } from 'react'
import Typewriter from 'typewriter-effect/dist/core'

const rows = 10
const dotsPerRow = 10
const spacing = 30
const dotColor1 = '#f25c7c'
const dotColor2 = '#10a6fa'

function setDotColor() {
  return Math.random() > 0.75 ? dotColor1 : Math.random() < 0.25 ? dotColor2 : '#333'
}

function setLineColor() {
  return '#eee'
}

export default function Mesh() {
  const svgEl = useRef()
  const pathsGroup = useRef()
  const dotsGroup = useRef()

  useEffect(() => {
    const pts = []
    let i = 0

    for (let row = 0; row < rows; row++) {
      for (let dotNum = 0; dotNum < dotsPerRow; dotNum++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        gsap.set(path, { attr: { class: 'path path-' + i, fill: 'none', stroke: setLineColor(), 'stroke-width': 0.3 } })
        pathsGroup.current.appendChild(path)

        const dotG = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        const position = { x: (row % 2 ? 0 : spacing) + dotNum * spacing * 2, y: row * spacing }
        pts.push(position)

        gsap.set(dotG, {
          attr: { class: 'dot dot-' + i },
          ...position,
        })

        const color = setDotColor()
        gsap.set(dot, {
          attr: { r: 1, fill: color, stroke: color, 'stroke-opacity': 0.5, 'stroke-width': 1 },
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
    let curve1 = 15
    let curve2 = 0
    let curve2Range = [5, 10, 15]
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
              attr: { d: 'M' + pts[i].x + ',' + pts[i].y + ' L' + pts[i + dotsPerRow].x + ',' + pts[i + dotsPerRow].y },
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
                end = ` C ${pts[i].x + curve2 * percent} ${pts[i].y}, ${pts[i + dotsPerRow + 1].x - curve1 * percent} ${
                  pts[i + dotsPerRow + 1].y
                }, ${pts[i + dotsPerRow + 1].x} ${pts[i + dotsPerRow + 1].y}`

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

    svgEl.current.addEventListener('click', () => {
      if (!scaling) {
        curve2 = curve2Range[Math.floor(Math.random() * curve2Range.length)]
        injectedDot = injectedDots[Math.floor(Math.random() * injectedDots.length)]

        scaling = true

        const tagline = document.querySelector('.tagline').getBoundingClientRect()
        gsap.fromTo(
          '.mesh-text',
          {
            top: tagline.top + 150,
            left: tagline.left + tagline.width - 50,
          },
          {
            duration: 1,
            opacity: 1,
            top: tagline.top + 100,
            left: tagline.left + tagline.width - 50,
          }
        )
        new Typewriter('.mesh-text', { delay: 50 })
          .typeString('Injecting network delay...')
          .pauseFor(2000)
          .deleteAll()
          .typeString('⏳ Recovering...')
          .pauseFor(2000)
          .deleteAll()
          .typeString('✅ Done!')
          .pauseFor(1000)
          .callFunction(() => {
            gsap.fromTo(
              '.mesh-text',
              {
                top: tagline.top + 100,
                left: tagline.left + tagline.width - 50,
              },
              {
                opacity: 0,
                top: tagline.top + 150,
                left: tagline.left + tagline.width - 50,
              }
            )
          })
          .start()

        const inject = gsap.to(`.dot-${injectedDot}`, {
          duration: 2,
          scale: 3,
          ease: 'back.inOut(3)',
          repeat: 5,
          yoyo: true,
          onUpdate: function () {
            percent = inject.time()
          },
          onComplete: () => (scaling = false),
        })
      }
    })
  }, [])

  return (
    <>
      <svg
        ref={svgEl}
        className="mesh tw-absolute tw-top-[-10%] 2xl:tw-left-[-50px] tw-w-full tw-h-[125%]"
        style={{
          transform: 'rotate3d(3, -.6, -1, 30deg)',
        }}
        viewBox="0 0 500 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={pathsGroup} />
        <g ref={dotsGroup} />
      </svg>
      <div className="mesh-text tw-absolute tw-px-2 tw-py-1 tw-bg-black tw-text-white tw-rounded tw-opacity-0">
        klajdlaksjdlaskd
      </div>
    </>
  )
}
