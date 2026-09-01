'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { TouchEvent } from 'react'
import { ImageWithSkeleton } from '@/components/mcraft/ImageWithSkeleton'
import type { Dictionary } from '@/lib/i18n/dictionaries/pl'

const SWIPE_THRESHOLD_PX = 40

type GalleryImage = {
  url: string
  alt: string
}

type Props = {
  images: GalleryImage[]
  dict: Dictionary
  frameClassName?: string
}

export function RealizacjaGaleria({ images, dict, frameClassName = 'bg-[#f0ede7]' }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxLoaded, setLightboxLoaded] = useState(false)

  const setActive = useCallback((i: number) => {
    setLightboxLoaded(false)
    setActiveIndex(i)
  }, [])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const makeTouchEndHandler = (goNext: () => void, goPrev: () => void) => (e: TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const deltaX = t.clientX - start.x
    const deltaY = t.clientY - start.y
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) return
    if (deltaX < 0) goNext()
    else goPrev()
  }

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') setActive((activeIndex + 1) % images.length)
      if (e.key === 'ArrowLeft') setActive((activeIndex - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, activeIndex, closeLightbox, setActive, images.length])

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-ink/5 flex items-center justify-center text-ink/30 font-montserrat text-sm tracking-[0.1em] uppercase">
        {dict.gallery.noPhotos}
      </div>
    )
  }

  const active = images[activeIndex]

  return (
    <>
      {/* Main image */}
      <div
        className={`relative w-full aspect-[4/3] overflow-hidden group max-h-[520px] ${frameClassName}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={makeTouchEndHandler(
          () => setActiveIndex((activeIndex + 1) % images.length),
          () => setActiveIndex((activeIndex - 1 + images.length) % images.length),
        )}
      >
        <button
          className="absolute inset-0 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          aria-label={`${dict.gallery.zoomAriaLabel}: ${active.alt}`}
        >
          <ImageWithSkeleton
            src={active.url}
            alt={active.alt}
            className="object-contain"
            sizes="(max-width: 980px) 100vw, 50vw"
          />
        </button>

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 bg-black/40 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35M11 8v6M8 11h6" strokeLinecap="round" />
          </svg>
        </div>
        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/40 font-montserrat text-[11px] tracking-[0.12em] text-white px-2 py-0.5 pointer-events-none">
            {activeIndex + 1}&nbsp;/&nbsp;{images.length}
          </div>
        )}

        {/* Prev/Next */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white transition-colors p-2"
              onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length) }}
              aria-label={dict.gallery.prevPhotoAria}
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3 rotate-180">
                <path d="M0 6h28M23 1l5 5-5 5" />
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white transition-colors p-2"
              onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length) }}
              aria-label={dict.gallery.nextPhotoAria}
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3">
                <path d="M0 6h28M23 1l5 5-5 5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto w-full min-w-0 modal-scroll pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-none w-[68px] h-[50px] overflow-hidden ${frameClassName} transition-opacity duration-200 ${
                i === activeIndex
                  ? 'ring-2 ring-inset ring-accent opacity-100'
                  : 'opacity-50 hover:opacity-90'
              }`}
              aria-label={`${dict.gallery.photoAriaLabel} ${i + 1}`}
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
            aria-label={dict.gallery.closeGalleryAria}
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
              onClick={(e) => { e.stopPropagation(); setActive((activeIndex - 1 + images.length) % images.length) }}
              aria-label={dict.gallery.prevPhotoAria}
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-8 h-5 rotate-180">
                <path d="M0 6h28M23 1l5 5-5 5" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-[88vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={makeTouchEndHandler(
              () => setActive((activeIndex + 1) % images.length),
              () => setActive((activeIndex - 1 + images.length) % images.length),
            )}
          >
            {!lightboxLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/30 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
              </div>
            )}
            <Image
              key={active.url}
              src={active.url}
              alt={active.alt}
              fill
              sizes="88vw"
              className={`object-contain transition-opacity duration-300 ${lightboxLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLightboxLoaded(true)}
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3"
              onClick={(e) => { e.stopPropagation(); setActive((activeIndex + 1) % images.length) }}
              aria-label={dict.gallery.nextPhotoAria}
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-8 h-5">
                <path d="M0 6h28M23 1l5 5-5 5" />
              </svg>
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActive(i) }}
                  className={`relative w-[52px] h-[38px] overflow-hidden flex-none bg-black/50 transition-opacity duration-200 ${
                    i === activeIndex ? 'opacity-100 ring-2 ring-inset ring-accent' : 'opacity-35 hover:opacity-70'
                  }`}
                  aria-label={`${dict.gallery.photoAriaLabel} ${i + 1}`}
                >
                  <Image src={img.url} alt={img.alt} fill sizes="52px" className="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
