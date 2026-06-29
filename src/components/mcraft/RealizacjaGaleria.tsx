'use client'

import { useState, useEffect, useCallback } from 'react'
import { ImageWithSkeleton } from '@/components/mcraft/ImageWithSkeleton'

type GalleryImage = {
  url: string
  alt: string
}

type Props = {
  images: GalleryImage[]
}

export function RealizacjaGaleria({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, closeLightbox, goNext, goPrev])

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-ink/5 flex items-center justify-center text-ink/30 font-montserrat text-sm tracking-[0.1em] uppercase">
        Brak zdjęć
      </div>
    )
  }

  const active = images[activeIndex]

  return (
    <>
      {/* Main image */}
      <button
        className="relative w-full aspect-[4/3] overflow-hidden group cursor-zoom-in bg-[#f0ede7]"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Powiększ: ${active.alt}`}
      >
        <ImageWithSkeleton
          src={active.url}
          alt={active.alt}
          className="object-contain"
          sizes="(max-width: 980px) 100vw, 50vw"
        />
        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 bg-black/40 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35M11 8v6M8 11h6" strokeLinecap="round" />
          </svg>
        </div>
        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/40 font-montserrat text-[11px] tracking-[0.12em] text-white px-2 py-0.5">
            {activeIndex + 1}&nbsp;/&nbsp;{images.length}
          </div>
        )}
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-none w-[68px] h-[50px] overflow-hidden bg-[#f0ede7] transition-opacity duration-200 ${
                i === activeIndex
                  ? 'outline outline-2 outline-accent opacity-100'
                  : 'opacity-50 hover:opacity-90'
              }`}
              aria-label={`Zdjecie ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <ImageWithSkeleton
                src={img.url}
                alt={img.alt}
                className="object-contain"
                sizes="68px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/93 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors p-2"
            onClick={closeLightbox}
            aria-label="Zamknij galerię"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {/* Counter */}
          <span className="absolute top-6 left-1/2 -translate-x-1/2 font-montserrat text-xs tracking-[0.2em] text-white/50">
            {activeIndex + 1}&nbsp;/&nbsp;{images.length}
          </span>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              aria-label="Poprzednie zdjęcie"
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-8 h-5 rotate-180">
                <path d="M0 6h28M23 1l5 5-5 5" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-[88vw] max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.url}
              alt={active.alt}
              className="max-w-[88vw] max-h-[80vh] object-contain"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3"
              onClick={(e) => { e.stopPropagation(); goNext() }}
              aria-label="Następne zdjęcie"
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-8 h-5">
                <path d="M0 6h28M23 1l5 5-5 5" />
              </svg>
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                  className={`relative w-[52px] h-[38px] overflow-hidden flex-none bg-black transition-opacity duration-200 ${
                    i === activeIndex ? 'opacity-100 outline outline-2 outline-accent' : 'opacity-35 hover:opacity-70'
                  }`}
                  aria-label={`Zdjecie ${i + 1}`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
