'use client'

import { useCallback } from 'react'
import type { StatTile } from '@/payload-types'
import { useModal } from './ModalProvider'

export function TilesMarquee({ tiles }: { tiles: StatTile[] }) {
  const { openModal } = useModal()

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    openModal('tiles', e.currentTarget)
  }, [openModal])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openModal('tiles', e.currentTarget)
    }
  }, [openModal])

  return (
    <div
      className="group relative mt-[18px] border border-hairline-light bg-white/35 cursor-pointer overflow-hidden hover:border-accent"
      role="button"
      tabIndex={0}
      aria-label="Zobacz wszystkie liczby"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute top-0 bottom-0 left-0 w-[46px] z-[2] pointer-events-none [background:linear-gradient(90deg,var(--color-cream),transparent)]" />
      <div className="absolute top-0 bottom-0 right-0 w-[46px] z-[2] pointer-events-none [background:linear-gradient(270deg,var(--color-cream),transparent)]" />
      <div className="overflow-hidden">
        <div className="flex w-max [animation:marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
          {tiles.length > 0
            ? [...tiles, ...tiles].map((t, i) => (
                <div key={`${t.id}-${i}`} className="flex-none w-[158px] text-center px-3 pt-[30px] pb-[26px] border-r border-hairline-light max-[980px]:w-[150px]">
                  <div className="font-montserrat font-semibold text-[28px] text-dark-text leading-none">{t.number}</div>
                  <div className="font-montserrat text-[10px] font-medium tracking-[0.13em] uppercase text-dark-muted mt-[11px] leading-[1.5]">{t.label}</div>
                </div>
              ))
            : (
                <div className="flex-none px-6 pt-[30px] pb-[26px] text-[11px] font-montserrat tracking-[0.1em] uppercase text-dark-muted">
                  Dodaj kafelki statystyk w panelu admina
                </div>
              )
          }
        </div>
      </div>
    </div>
  )
}
