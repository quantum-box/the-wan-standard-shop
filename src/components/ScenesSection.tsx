'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

const scenes = [
  {
    src: '/assets/tws-creative/tws-scene-morning-walk-2.jpeg',
    caption: '朝の散歩、一緒に。',
  },
  {
    src: '/assets/tws-creative/tws-scene-cafe-terrace-1.jpeg',
    caption: 'カフェテラスのひととき。',
  },
  {
    src: '/assets/tws-creative/tws-scene-family-dog-2.jpeg',
    caption: '家族の時間、大切な器で。',
  },
]

export default function ScenesSection() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    const track = trackRef.current
    if (!outer || !inner || !track) return

    const updateTranslate = () => {
      const outerRect = outer.getBoundingClientRect()
      const scrollableWidth = track.scrollWidth - inner.offsetWidth

      // progress: 0 when outer top hits viewport top, 1 when outer bottom hits viewport bottom
      const totalScroll = outer.offsetHeight - window.innerHeight
      const scrolled = -outerRect.top
      const progress = Math.min(1, Math.max(0, scrolled / totalScroll))

      track.style.transform = `translateX(${-scrollableWidth * progress}px)`
    }

    updateTranslate()

    const onScroll = () => updateTranslate()
    window.addEventListener('scroll', onScroll, { passive: true })

    const ro = new ResizeObserver(() => updateTranslate())
    ro.observe(outer)
    ro.observe(track)

    return () => {
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

  return (
    <section className="bg-p3">
      {/* Desktop: sticky horizontal scroll */}
      <div
        ref={outerRef}
        className="hidden md:block relative"
        style={{ height: '300vh' }}
      >
        <div
          ref={innerRef}
          className="sticky top-0 h-screen overflow-hidden"
        >
          {/* Section label */}
          <div className="px-16 pt-24 pb-12">
            <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-2">
              Scenes
            </p>
            <div className="h-px w-16 bg-s2/50" />
          </div>

          {/* Scrolling track */}
          <div
            ref={trackRef}
            className="flex gap-4 pl-16 will-change-transform"
            style={{ transition: 'transform 0.05s linear' }}
          >
            {scenes.map((item, i) => (
              <div
                key={i}
                className="flex-none"
                style={{ width: 'clamp(280px, 40vw, 560px)' }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: '60vh', minHeight: '360px' }}
                >
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-serif-en italic text-n1 text-sm mt-4 tracking-wide">
                  {item.caption}
                </p>
              </div>
            ))}
            {/* Trailing spacer so last card fully enters view */}
            <div className="flex-none w-16" />
          </div>
        </div>
      </div>

      {/* Mobile: standard overflow-x snap carousel */}
      <div className="block md:hidden py-24 overflow-hidden">
        <div className="px-8 mb-12">
          <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-2">
            Scenes
          </p>
          <div className="h-px w-16 bg-s2/50" />
        </div>
        <div
          className="flex gap-4 overflow-x-auto pl-8 pb-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {scenes.map((item, i) => (
            <div
              key={i}
              className="flex-none snap-start"
              style={{ width: 'clamp(280px, 80vw, 360px)' }}
            >
              <div
                className="relative overflow-hidden"
                style={{ height: '70vh', minHeight: '400px' }}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-serif-en italic text-n1 text-sm mt-4 tracking-wide">
                {item.caption}
              </p>
            </div>
          ))}
          <div className="flex-none w-8" />
        </div>
      </div>
    </section>
  )
}
