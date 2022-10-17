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
  const pathsGroup = useRef()
  const dotsGroup = useRef()

  useEffect(() => {
    const pts = []
    let i = 0

    for (let row = 0; row < rows; row++) {
      for (let dotNum = 0; dotNum < dotsPerRow; dotNum++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        gsap.set(path, { attr: { class: 'path path-' + i, stroke: setLineColor(), fill: 'none', 'stroke-width': 0.3 } })
        pathsGroup.current.appendChild(path)

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        const position = { x: (row % 2 ? 0 : spacing) + dotNum * spacing * 2, y: row * spacing }
        pts.push(position)

        gsap.set(dot, {
          attr: { class: 'dot dot-' + i, r: 1.5, fill: setDotColor(), stroke: 'none' },
          ...position,
        })
        dotsGroup.current.appendChild(dot)

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
              gsap.set('.path-' + i, {
                attr: {
                  d:
                    'M' +
                    pts[i + dotsPerRow].x +
                    ',' +
                    pts[i + dotsPerRow].y +
                    ' L' +
                    pts[i].x +
                    ',' +
                    pts[i].y +
                    ' L' +
                    pts[i + dotsPerRow + 1].x +
                    ',' +
                    pts[i + dotsPerRow + 1].y,
                },
              })
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
  }, [])

  return (
    <svg
      className="tw-absolute tw-bottom-0 2xl:tw-left-[-250px] tw-w-full tw-h-[110%]"
      style={{
        transform: 'perspective(2000px) rotate3d(1, -.5, 0, 45deg)',
      }}
      viewBox="0 0 500 250"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g ref={pathsGroup} />
      <g ref={dotsGroup} />
    </svg>
  )
}
