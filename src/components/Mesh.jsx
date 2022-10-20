import React, { useEffect, useRef } from 'react'

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

              if (i === 64 && scaling) {
                dot = ` C ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y - 30 * percent}, ${pts[i].x} ${
                  pts[i].y + 15 * percent
                }, ${pts[i].x} ${pts[i].y}`

                gsap.set('.path-' + i, {
                  attr: {
                    d: start + dot + end,
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
              gsap.set('.path-' + i, {
                attr: {
                  d:
                    'M' +
                    pts[i + dotsPerRow - 1].x +
                    ',' +
                    pts[i + dotsPerRow - 1].y +
                    ' L' +
                    pts[i].x +
                    ',' +
                    pts[i].y +
                    ' L' +
                    pts[i + dotsPerRow].x +
                    ',' +
                    pts[i + dotsPerRow].y,
                },
              })
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
        scaling = true

        const inject = gsap.to('.dot-64', {
          duration: 1,
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
  )
}
