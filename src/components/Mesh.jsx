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
  const svgEl = useRef(null)
  const pathsGroup = useRef(null)
  const dotsGroup = useRef(null)
  const meshTextEl = useRef(null)

  const { colorMode } = useColorMode()

  useLayoutEffect(() => {
    const svg = svgEl.current
    const pathsContainer = pathsGroup.current
    const dotsContainer = dotsGroup.current
    const meshText = meshTextEl.current

    if (!svg || !pathsContainer || !dotsContainer || !meshText) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const pathElements = []
      const dotElements = []
      const pts = Array.from({ length: dotsNum }, () => ({ x: 0, y: 0 }))
      let scaling = false
      let percent = 0
      const curve1 = 5
      const curve2Range = [3, 4, 5]
      let curve2 = 0
      let injectedDot = 64
      const injectedDots = [64]
      let elementIndex = 0

      for (let row = 0; row < rows; row++) {
        for (let dotNum = 0; dotNum < dotsPerRow; dotNum++) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          const position = { x: (row % 2 ? 0 : spacing) + dotNum * spacing * 2, y: row * spacing }

          path.setAttribute('class', `path path-${elementIndex}`)
          path.setAttribute('fill', 'none')
          path.setAttribute('stroke', setLineColor(colorMode))
          path.setAttribute('stroke-width', '0.3')
          pathElements.push(path)
          pathsContainer.appendChild(path)

          dotGroup.setAttribute('class', `dot dot-${elementIndex}`)
          gsap.set(dotGroup, position)

          const color = setDotColor(colorMode)

          dot.setAttribute('class', 'dot-inner')
          dot.setAttribute('r', '1')
          dot.setAttribute('fill', color)
          dot.setAttribute('stroke', color)
          dot.setAttribute('stroke-opacity', '0.5')
          dot.setAttribute('stroke-width', '1')
          dot.dataset.accent = String(color === dotColor1 || color === dotColor2)

          dotGroup.appendChild(dot)
          dotElements.push(dotGroup)
          dotsContainer.appendChild(dotGroup)

          elementIndex++
        }
      }

      function setPath(index, d, dashed = false) {
        const path = pathElements[index]

        path.setAttribute('d', d)
        if (dashed) {
          path.setAttribute('stroke-dasharray', `30 ${10 * percent}`)
        } else {
          path.removeAttribute('stroke-dasharray')
        }
      }

      function reDraw() {
        let row = 0

        for (let i = 0; i < pts.length; i++) {
          const x = gsap.getProperty(dotElements[i], 'x')
          const y = gsap.getProperty(dotElements[i], 'y')

          pts[i].x = typeof x === 'number' ? x : parseFloat(x) || 0
          pts[i].y = typeof y === 'number' ? y : parseFloat(y) || 0

          if (i % dotsPerRow === 0) {
            row++
          }

          if (row >= rows) {
            continue
          }

          if ((i % dotsPerRow === 0 && row % 2 === 0) || (i % dotsPerRow === dotsPerRow - 1 && row % 2 === 1)) {
            setPath(i, `M${pts[i].x},${pts[i].y} L${pts[i + dotsPerRow].x},${pts[i + dotsPerRow].y}`)
          } else if (row % 2 === 1) {
            const start = `M ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y}`
            let dot = ` L ${pts[i].x} ${pts[i].y}`
            let end = ` L ${pts[i + dotsPerRow + 1].x} ${pts[i + dotsPerRow + 1].y}`

            if (i === injectedDot && scaling) {
              dot = ` C ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y - curve1 * percent}, ${pts[i].x} ${
                pts[i].y + curve2 * percent
              }, ${pts[i].x} ${pts[i].y}`
              end = ` C ${pts[i].x + curve2 * percent} ${pts[i].y}, ${
                pts[i + dotsPerRow + 1].x - curve1 * percent
              } ${pts[i + dotsPerRow + 1].y}, ${pts[i + dotsPerRow + 1].x} ${pts[i + dotsPerRow + 1].y}`
              setPath(i, start + dot + end, true)
            } else {
              setPath(i, start + dot + end)
            }
          } else {
            const start = `M ${pts[i + dotsPerRow - 1].x} ${pts[i + dotsPerRow - 1].y}`
            let dot = ` L ${pts[i].x} ${pts[i].y}`
            let end = ` L ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y}`

            if (i === injectedDot - dotsPerRow && scaling) {
              end = ` C ${pts[i].x + curve1 * percent} ${pts[i].y}, ${pts[i + dotsPerRow].x - curve2 * percent} ${
                pts[i + dotsPerRow].y
              }, ${pts[i + dotsPerRow].x} ${pts[i + dotsPerRow].y}`
              setPath(i, start + dot + end, true)
            } else if (i === injectedDot - dotsPerRow + 1 && scaling) {
              dot = ` C ${pts[i + dotsPerRow - 1].x} ${pts[i + dotsPerRow - 1].y - curve2 * percent}, ${pts[i].x} ${
                pts[i].y + curve1 * percent
              }, ${pts[i].x} ${pts[i].y}`
              setPath(i, start + dot + end, true)
            } else if ((i === injectedDot + dotsPerRow || i === injectedDot + dotsPerRow + 1) && scaling) {
              setPath(i, start + dot + end, true)
            } else {
              setPath(i, start + dot + end)
            }
          }
        }
      }

      reDraw()

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', (motionContext) => {
        const dotsTween = gsap.to(dotElements, {
          duration: 3,
          x: '+=6',
          y: '-=12',
          ease: 'sine.inOut',
          stagger: { grid: [rows, dotsPerRow], amount: 1, from: 'random', repeat: -1, yoyo: true },
          onUpdate: reDraw,
        })
        const rotateXTo = gsap.quickTo(svg, 'rotationX', { duration: 1.5, ease: 'power2.out' })
        const rotateYTo = gsap.quickTo(svg, 'rotationY', { duration: 1.5, ease: 'power2.out' })
        let autoInjectTimer
        let chaosTween
        let hasAutoInjected = false
        let intersectionObserver
        let isVisible = true
        let textTween
        let typewriter
        let waveTimeline

        const removeWaves = () => {
          dotsContainer.querySelectorAll('.wave').forEach((wave) => wave.remove())
        }

        const hideMeshText = motionContext.add('hideMeshText', (top, left) => {
          textTween = gsap.to(meshText, {
            duration: 0.5,
            opacity: 0,
            top,
            left: left + 25,
            overwrite: 'auto',
          })
        })

        const injectChaos = motionContext.add('injectChaos', () => {
          if (!isVisible || scaling || !window.matchMedia('(min-width: 768px)').matches) {
            return
          }

          curve2 = curve2Range[Math.floor(Math.random() * curve2Range.length)]
          injectedDot = injectedDots[Math.floor(Math.random() * injectedDots.length)]
          scaling = true

          const injectedDotElement = dotElements[injectedDot]
          const injectedDotInner = injectedDotElement.querySelector('.dot-inner')
          const rect = injectedDotElement.getBoundingClientRect()
          const top = rect.top + 100
          const left = rect.left - 250

          textTween = gsap.fromTo(
            meshText,
            { top, left },
            {
              duration: 1,
              opacity: 1,
              top: top - 50,
              left: left + 25,
              overwrite: 'auto',
            },
          )

          typewriter?.stop()
          typewriter = new Typewriter(meshText, { delay: 50 })
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
            .callFunction(() => hideMeshText(top, left))
            .start()

          chaosTween = gsap.to(injectedDotElement, {
            duration: 2,
            scale: 5,
            ease: 'back.inOut(3)',
            repeat: 7,
            yoyo: true,
            onUpdate() {
              percent = this.time()
            },
            onComplete: () => (scaling = false),
          })

          const waves = []
          for (let i = 0; i < 12; i++) {
            const wave = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

            wave.setAttribute('class', `wave wave-${i}`)
            wave.setAttribute('r', '0')
            wave.setAttribute('fill', 'none')
            wave.setAttribute('stroke', injectedDotInner.getAttribute('fill'))
            wave.setAttribute('stroke-opacity', '0.5')
            wave.setAttribute('stroke-width', '0.3')
            waves.push(wave)
            injectedDotElement.appendChild(wave)
          }

          waveTimeline = gsap.timeline({ onComplete: removeWaves })
          waves.forEach((wave) => {
            waveTimeline.to(wave, {
              duration: 1,
              attr: {
                r: 10,
                'stroke-opacity': 0,
                'stroke-width': 0,
              },
              ease: 'sine.inOut',
            })
          })
        })

        const handleMouseMove = (event) => {
          const rotationX = 30 + (0.5 - event.clientY / window.innerHeight) * 10
          const rotationY = (event.clientX / window.innerWidth - 0.5) * -10

          rotateXTo(rotationX)
          rotateYTo(rotationY)
        }

        const clearAutoInjectTimer = () => {
          if (autoInjectTimer) {
            window.clearTimeout(autoInjectTimer)
            autoInjectTimer = undefined
          }
        }

        const scheduleAutoInject = () => {
          if (hasAutoInjected || autoInjectTimer || !window.matchMedia('(min-width: 768px)').matches) {
            return
          }

          autoInjectTimer = window.setTimeout(() => {
            autoInjectTimer = undefined
            hasAutoInjected = true
            injectChaos()
          }, 1500)
        }

        const pauseMotion = () => {
          dotsTween.pause()
          chaosTween?.pause()
          textTween?.pause()
          typewriter?.stop()
          waveTimeline?.pause()
        }

        const resumeMotion = () => {
          dotsTween.resume()
          chaosTween?.resume()
          textTween?.resume()
          typewriter?.start()
          waveTimeline?.resume()
        }

        svg.addEventListener('mousemove', handleMouseMove)
        svg.addEventListener('click', injectChaos)

        if ('IntersectionObserver' in window) {
          isVisible = false
          dotsTween.pause()
          intersectionObserver = new IntersectionObserver(
            ([entry]) => {
              isVisible = Boolean(entry?.isIntersecting)

              if (isVisible) {
                resumeMotion()
                scheduleAutoInject()
              } else {
                pauseMotion()
                clearAutoInjectTimer()
              }
            },
            { rootMargin: '100px' },
          )
          intersectionObserver.observe(svg)
        } else {
          scheduleAutoInject()
        }

        return () => {
          clearAutoInjectTimer()
          intersectionObserver?.disconnect()
          svg.removeEventListener('mousemove', handleMouseMove)
          svg.removeEventListener('click', injectChaos)
          typewriter?.stop()
          typewriter = undefined
          scaling = false
          percent = 0
          removeWaves()
          meshText.replaceChildren()
          reDraw()
        }
      })
    }, svgEl)

    return () => {
      ctx.revert()
      pathsContainer.replaceChildren()
      dotsContainer.replaceChildren()
      meshText.replaceChildren()
    }
  }, [])

  useDidMountEffect(() => {
    dotsGroup.current?.querySelectorAll('.dot-inner').forEach((dot) => {
      if (dot.dataset.accent !== 'true') {
        const color = setNeutralDotColor(colorMode)

        dot.setAttribute('fill', color)
        dot.setAttribute('stroke', color)
      }
    })
    pathsGroup.current?.querySelectorAll('.path').forEach((path) => {
      path.setAttribute('stroke', setLineColor(colorMode))
    })
  }, [colorMode])

  return (
    <>
      <svg
        ref={svgEl}
        className="mesh tw:absolute tw:top-[-10%] tw:2xl:left-[-100px] tw:w-[1024px] tw:lg:w-full tw:h-[125%]"
        aria-hidden="true"
        focusable="false"
        style={{
          transform: 'rotate3d(3, -.6, -1, 30deg)',
        }}
        viewBox="0 0 500 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={pathsGroup} />
        <g ref={dotsGroup} />
      </svg>
      <div
        ref={meshTextEl}
        aria-hidden="true"
        className="mesh-text tw:absolute tw:px-2 tw:py-1 tw:bg-primary tw:text-primary-content tw:rounded-sm tw:opacity-0"
      />
    </>
  )
}
