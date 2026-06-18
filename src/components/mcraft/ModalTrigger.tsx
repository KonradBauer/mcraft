'use client'

import { useCallback } from 'react'
import { useModal } from './ModalProvider'

type ModalKey = 'cv' | 'bio' | 'tiles'

interface ModalTriggerProps {
  modalKey: ModalKey
  className?: string
  children: React.ReactNode
  asDiv?: boolean
  ariaLabel?: string
  tabIndex?: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
}

export function ModalTrigger({ modalKey, className, children, asDiv, ariaLabel, tabIndex, onKeyDown }: ModalTriggerProps) {
  const { openModal } = useModal()

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    openModal(modalKey, e.currentTarget)
  }, [openModal, modalKey])

  if (asDiv) {
    return (
      <div
        className={className}
        role="button"
        tabIndex={tabIndex ?? 0}
        aria-label={ariaLabel}
        onClick={handleClick}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    )
  }

  return (
    <button className={className} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
