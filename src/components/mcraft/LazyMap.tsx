'use client'

import { useEffect, useRef, useState } from 'react'

const MAP_SRC = 'https://maps.google.com/maps?q=ul.+%C5%BBo%C5%82nierzy+Wrze%C5%9Bnia+36,+42-152+Wilkowiecko&output=embed'

export function LazyMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative h-[300px] w-full overflow-hidden bg-white/5">
      {shouldLoad ? (
        <iframe
          src={MAP_SRC}
          width="100%"
          height="300"
          style={{ border: 0, filter: 'grayscale(1) invert(0.85) contrast(0.9)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokalizacja MCRAFT"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
          <div className="absolute inset-0 opacity-30 dots-pattern pointer-events-none" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="relative w-8 h-8 text-accent">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span className="relative font-montserrat text-[13px] font-light tracking-[0.02em] text-light-muted leading-[1.6] max-w-[220px]">
            ul. Żołnierzy Września 36<br />42-152 Wilkowiecko
          </span>
        </div>
      )}
    </div>
  )
}
