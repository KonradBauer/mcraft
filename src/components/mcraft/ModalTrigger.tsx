'use client'

import { useCallback } from 'react'
import type { ModalKey, ScopeModalContent } from './ModalProvider'
import { useModal } from './ModalProvider'

interface ModalTriggerProps {
  modalKey: ModalKey
  className?: string
  children: React.ReactNode
  asDiv?: boolean
  ariaLabel?: string
  tabIndex?: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
  content?: ScopeModalContent
}

export function ModalTrigger({ modalKey, className, children, asDiv, ariaLabel, tabIndex, onKeyDown, content }: ModalTriggerProps) {
  const { openModal } = useModal()

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    openModal(modalKey, e.currentTarget, content)
  }, [openModal, modalKey, content])

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
