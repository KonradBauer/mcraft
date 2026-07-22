'use client'

import { useEffect, useState } from 'react'

const MAX_VISIBLE_MS = 4000
const FADE_OUT_MS = 550

export function PageLoader() {
  const [isHiding, setIsHiding] = useState(false)
  const [isRemoved, setIsRemoved] = useState(false)

  useEffect(() => {
    const hide = () => setIsHiding(true)

    if (document.readyState === 'complete') {
      hide()
    } else {
      window.addEventListener('load', hide, { once: true })
    }

    const fallbackTimeout = window.setTimeout(hide, MAX_VISIBLE_MS)

    return () => {
      window.removeEventListener('load', hide)
      window.clearTimeout(fallbackTimeout)
    }
  }, [])

  useEffect(() => {
    if (!isHiding) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
    const removeTimeout = window.setTimeout(() => setIsRemoved(true), FADE_OUT_MS)
    return () => window.clearTimeout(removeTimeout)
  }, [isHiding])

  if (isRemoved) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] bg-ink flex items-center justify-center overflow-hidden transition-opacity ease-in duration-[550ms] ${
        isHiding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 blueprint-bg opacity-60" />

      <span className="absolute top-[26px] left-[26px] w-[34px] h-[34px] border-t border-l border-accent/50" />
      <span className="absolute top-[26px] right-[26px] w-[34px] h-[34px] border-t border-r border-accent/50" />
      <span className="absolute bottom-[26px] left-[26px] w-[34px] h-[34px] border-b border-l border-accent/50" />
      <span className="absolute bottom-[26px] right-[26px] w-[34px] h-[34px] border-b border-r border-accent/50" />

      <span className="absolute left-0 right-0 top-1/2 h-px [background:repeating-linear-gradient(90deg,rgba(79,154,140,0.25)_0px,rgba(79,154,140,0.25)_10px,transparent_10px,transparent_20px)]" />
      <span className="absolute top-0 bottom-0 left-1/2 w-px [background:repeating-linear-gradient(180deg,rgba(79,154,140,0.25)_0px,rgba(79,154,140,0.25)_10px,transparent_10px,transparent_20px)]" />

      <div className="relative flex flex-col items-center gap-[26px] px-6">
        <svg
          viewBox="0 0 60 60"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="loader-mark w-[46px] h-[46px]"
        >
          <path d="M8 50V12l22 24 22-24v38" />
          <path d="M8 12h6M52 12h-6" />
        </svg>

        <div className="flex flex-col items-center gap-[6px]">
          <span className="font-montserrat font-light text-[20px] tracking-[0.45em] text-white uppercase">MCRAFT</span>
          <span className="font-montserrat text-[11px] font-semibold tracking-[0.28em] uppercase text-accent-bright text-center">
            Dr inż. Michał Macherzyński
          </span>
        </div>

        <div className="relative w-[230px] h-[2px] bg-white/10 mt-[6px] overflow-visible">
          <div className="weld-fill absolute inset-y-0 left-0 w-0">
            {/* tip anchor - moves with the leading edge of the seam */}
            <span className="weld-torch absolute right-0 bottom-0 pointer-events-none">
              <span className="weld-head absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-[9px] h-[9px] rounded-full bg-white" />
              <span className="weld-spark weld-spark-1 absolute left-0 bottom-0 w-[6px] h-[6px] rounded-full bg-white" />
              <span className="weld-spark weld-spark-2 absolute left-0 bottom-0 w-[5px] h-[5px] rounded-full bg-accent-bright" />
              <span className="weld-spark weld-spark-3 absolute left-0 bottom-0 w-[6px] h-[6px] rounded-full bg-white" />
              <span className="weld-spark weld-spark-4 absolute left-0 bottom-0 w-[5px] h-[5px] rounded-full bg-accent-bright" />
              <span className="weld-spark weld-spark-5 absolute left-0 bottom-0 w-[4px] h-[4px] rounded-full bg-white" />
              <span className="weld-spark weld-spark-6 absolute left-0 bottom-0 w-[5px] h-[5px] rounded-full bg-accent-bright" />
              <span className="weld-spark weld-spark-7 absolute left-0 bottom-0 w-[4px] h-[4px] rounded-full bg-white" />
              <span className="weld-spark weld-spark-8 absolute left-0 bottom-0 w-[6px] h-[6px] rounded-full bg-accent-bright" />
              <span className="weld-spark weld-spark-9 absolute left-0 bottom-0 w-[4px] h-[4px] rounded-full bg-white" />
              <span className="weld-spark weld-spark-10 absolute left-0 bottom-0 w-[5px] h-[5px] rounded-full bg-accent-bright" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
