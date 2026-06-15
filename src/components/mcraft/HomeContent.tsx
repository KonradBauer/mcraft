'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ImageSlot } from './ImageSlot'
import { Logo } from './Logo'

const TILES = [
  { n: '18+', s: 'Lat doświadczenia', d: 'Ponad 18 lat pracy w spawalnictwie i konstrukcjach stalowych.' },
  { n: '10+', s: 'Lat nadzoru', d: 'Dekada nadzoru spawalniczego nad projektami przemysłowymi.' },
  { n: '100+', s: 'Zrealizowanych projektów', d: 'Setki ukończonych realizacji dla przemysłu i budownictwa.' },
  { n: 'IWE', s: 'International Welding Engineer', d: 'Międzynarodowy Inżynier Spawalnik — najwyższy poziom kwalifikacji.' },
  { n: 'IWI', s: 'International Welding Inspector', d: 'Międzynarodowy Inspektor Spawalniczy.' },
  { n: 'VT2', s: 'Badania wizualne', d: 'Uprawnienia do badań wizualnych złączy spawanych — poziom 2.' },
  { n: 'PT2', s: 'Badania penetracyjne', d: 'Uprawnienia do badań penetracyjnych — poziom 2.' },
  { n: '350 m²', s: 'Powierzchnia warsztatu', d: 'Własny warsztat z suwnicą 5 ton i nowoczesnym parkiem maszynowym.' },
]

type ModalKey = 'cv' | 'bio' | 'tiles'

/* ─── reusable class strings ─── */
const eyebrow = 'block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-accent'
const wrap = 'max-w-[1180px] mx-auto px-12 max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[12.5px] font-medium tracking-[0.18em] uppercase pb-1.5 relative transition-colors duration-200'

/* ─── icon helpers ─── */
function ArrowRight({ className = 'w-5 h-3 flex-none' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M0 6h28M23 1l5 5-5 5" />
    </svg>
  )
}

function ArrowLeft({ className = 'w-[22px] h-[10px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M30 6H2M7 1 2 6l5 5" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-none">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-5M12 8h.01" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  )
}

/* ─── modal sub-components ─── */
function ModalNote() {
  return (
    <div className="flex items-center gap-2.5 mx-12 -mt-3 bg-[rgba(79,154,140,0.12)] border border-[rgba(79,154,140,0.4)] text-[#3c7a6e] text-[12px] px-3.5 py-2 font-medium max-[980px]:mx-7">
      <InfoIcon />
      Treść przykładowa — ostateczna wersja zostanie wczytana z zasobów.
    </div>
  )
}

function ModalHead({ eyebrowText, title, sub }: { eyebrowText: string; title: string; sub: string }) {
  return (
    <div className="bg-ink text-light px-12 pt-7 pb-6 relative overflow-hidden flex-none max-[980px]:px-7">
      <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
      <div className="relative">
        <span className="font-montserrat text-[11px] font-semibold tracking-[0.26em] uppercase text-accent-bright">{eyebrowText}</span>
        <h2 className="font-light text-[34px] uppercase tracking-[0.02em] text-white mt-[14px] max-[980px]:text-[27px]">{title}</h2>
        <div className="font-montserrat font-light text-[14px] tracking-[0.14em] uppercase text-light-muted mt-2.5">{sub}</div>
      </div>
    </div>
  )
}

function ModalDownloadBtn({ label }: { label: string }) {
  return (
    <button className="self-start mx-12 mb-5 mt-1 inline-flex items-center gap-3 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.16em] uppercase px-5 py-3 cursor-pointer border-none transition-all duration-[220ms] hover:bg-accent hover:text-ink max-[980px]:mx-7">
      <DownloadIcon />{label}
    </button>
  )
}

function ModalBodySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3 className="font-montserrat font-semibold text-[11px] tracking-[0.16em] uppercase text-accent mt-4 first:mt-0 mb-2 pb-1.5 border-b border-hairline-light">{title}</h3>
      {children}
    </>
  )
}

function ModalCV() {
  return (
    <>
      <ModalHead eyebrowText="Dowiedz się więcej" title="Dr inż. Michał Macherzyński" sub="CV zawodowe — doświadczenie i kwalifikacje" />
      <ModalNote />
      <div className="px-12 pt-4 pb-4 max-[980px]:px-7">
        <ModalBodySection title="Doświadczenie zawodowe">
          <ul className="flex flex-col gap-2">
            {[
              ['Obecnie', 'Główny Spawalnik oraz Kierownik Projektów B+R — ZUGIL S.A.'],
              ['18+ lat', 'Nadzór spawalniczy, kwalifikowanie technologii spawania (WPQR/WPS), dokumentacja jakościowa.'],
              ['B+R', 'Robotyzacja i automatyzacja procesów spawalniczych, wdrożenia przemysłowe.'],
            ].map(([yr, text]) => (
              <li key={yr} className="grid grid-cols-[110px_1fr] gap-3 text-[13.5px] leading-[1.55] text-[#56544e] max-[980px]:grid-cols-[80px_1fr]">
                <span className="font-montserrat font-semibold text-[12px] tracking-[0.04em] text-dark-text">{yr}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </ModalBodySection>
        <ModalBodySection title="Kwalifikacje i certyfikaty">
          <ul className="flex flex-col gap-2">
            {[
              ['IWE', 'International Welding Engineer — Międzynarodowy Inżynier Spawalnik.'],
              ['IWI', 'International Welding Inspector — Międzynarodowy Inspektor Spawalniczy.'],
              ['VT2 / PT2', 'Badania nieniszczące — wizualne i penetracyjne, poziom 2.'],
            ].map(([yr, text]) => (
              <li key={yr} className="grid grid-cols-[110px_1fr] gap-3 text-[13.5px] leading-[1.55] text-[#56544e] max-[980px]:grid-cols-[80px_1fr]">
                <span className="font-montserrat font-semibold text-[12px] tracking-[0.04em] text-dark-text">{yr}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </ModalBodySection>
        <ModalBodySection title="Kompetencje">
          <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Łączenie wiedzy inżynierskiej z praktyką warsztatową, nadzór nad jakością, prowadzenie projektów badawczo-rozwojowych oraz konstrukcji stalowych dla przemysłu i budownictwa.</p>
        </ModalBodySection>
      </div>
      <ModalDownloadBtn label="Pobierz CV (PDF)" />
    </>
  )
}

function ModalBio() {
  return (
    <>
      <ModalHead eyebrowText="Więcej o mnie" title="Michał Macherzyński" sub="Życiorys — droga i pasja" />
      <ModalNote />
      <div className="px-12 pt-4 pb-4 max-[980px]:px-7">
        <ModalBodySection title="Moja droga">
          <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Tu znajdzie się bardziej osobista opowieść — życiorys, początki fascynacji metalem i spawaniem, droga od warsztatu do tytułu doktora inżyniera. Treść zostanie przygotowana i wczytana z zasobów.</p>
        </ModalBodySection>
        <ModalBodySection title="Pasja">
          <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Poza pracą zawodową — tworzenie unikalnych mebli stalowych, projekty autorskie i ciągłe doskonalenie rzemiosła. To miejsce na prywatną, mniej formalną część historii.</p>
        </ModalBodySection>
        <ModalBodySection title="Wartości">
          <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Jakość jako standard, a nie cel. Rzetelność, dbałość o detal i partnerskie podejście do każdego projektu.</p>
        </ModalBodySection>
      </div>
      <ModalDownloadBtn label="Pobierz życiorys (PDF)" />
    </>
  )
}

function ModalTiles() {
  return (
    <>
      <ModalHead eyebrowText="W liczbach" title="Doświadczenie i kwalifikacje" sub="Kliknij dowolny kafelek, by poznać szczegóły" />
      <ModalNote />
      <div className="grid grid-cols-4 p-[20px_48px_24px] max-[980px]:grid-cols-2 max-[980px]:p-5 max-[560px]:grid-cols-1">
        {TILES.map((t) => (
          <div key={t.n} className="p-[14px_14px] border border-hairline-light -m-px">
            <div className="font-montserrat font-semibold text-[28px] text-dark-text leading-none">{t.n}</div>
            <div className="font-montserrat text-[10px] font-semibold tracking-[0.12em] uppercase text-accent my-1.5">{t.s}</div>
            <p className="text-[12px] leading-[1.5] text-[#6a6862] m-0">{t.d}</p>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── main component ─── */
export function HomeContent() {
  const [modalKey, setModalKey] = useState<ModalKey | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [transform, setTransform] = useState('translate(-50%, -50%) scale(0.12)')
  const [opacity, setOpacity] = useState(0)
  const lastOrigin = useRef({ dx: 0, dy: 0 })

  const openModal = useCallback((key: ModalKey, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    const dx = r.left + r.width / 2 - window.innerWidth / 2
    const dy = r.top + r.height / 2 - window.innerHeight / 2
    lastOrigin.current = { dx, dy }
    setModalKey(key)
    setTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.12)`)
    setOpacity(0)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTransform('translate(-50%, -50%) scale(1)')
      setOpacity(1)
    }))
  }, [])

  const closeModal = useCallback(() => {
    const { dx, dy } = lastOrigin.current
    setTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.12)`)
    setOpacity(0)
    document.body.style.overflow = ''
    setTimeout(() => { setIsOpen(false); setModalKey(null) }, 600)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  return (
    <>
      {/* ====== HERO ====== */}
      <header className="relative bg-ink text-light min-h-[680px] overflow-hidden" id="top">
        {/* Background image */}
        <Image
          src="/hero-tlo.png"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          alt=""
          priority
          className="z-0"
        />

        {/* Left overlay — darken for left text readability */}
        <div className="absolute inset-0 z-[1] pointer-events-none [background:linear-gradient(to_right,rgba(14,26,23,0.95)_0%,rgba(14,26,23,0.55)_32%,rgba(14,26,23,0)_55%)]" />

        {/* Michał cutout photo */}
        <div className="absolute bottom-0 z-[2] pointer-events-none left-1/2 -translate-x-[55%] max-[980px]:-translate-x-1/2 max-[980px]:opacity-50 max-[560px]:hidden">
          <Image
            src="/hero-michal.png"
            alt="Dr inż. Michał Macherzyński"
            width={400}
            height={640}
            className="h-[640px] w-auto max-[980px]:h-[500px]"
            priority
          />
        </div>

        {/* Side decoration */}
        <div className="absolute left-0 top-[120px] bottom-[60px] z-[3] flex flex-col items-center max-[560px]:hidden">
          <span className="w-px flex-1 bg-gradient-to-b from-accent to-transparent" />
          <span className="mt-[14px] text-light-muted">
            <svg width="14" height="30" viewBox="0 0 14 30" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M7 0v27M1 21l6 7 6-7" />
            </svg>
          </span>
        </div>

        {/* Content */}
        <div className="relative z-[3]">
          <div className={wrap}>
            <nav className="flex items-center justify-between py-[30px]">
              <Logo />
              <div className="flex gap-[38px] max-[980px]:hidden">
                <a href="#about" className={`${navLink} text-light after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[22px] after:h-0.5 after:bg-accent`}>O mnie</a>
                <a href="#areas" className={`${navLink} text-light-muted hover:text-light`}>Obszary</a>
                <Link href="/nadzor-spawalniczy" className={`${navLink} text-light-muted hover:text-light`}>Realizacje</Link>
                <a href="#workshop" className={`${navLink} text-light-muted hover:text-light`}>Warsztat</a>
                <a href="#contact" className={`${navLink} text-light-muted hover:text-light`}>Kontakt</a>
              </div>
            </nav>

            {/* Hero body — relative context for absolute right text */}
            <div className="relative pt-[56px] pb-[90px] max-[560px]:pt-[30px] max-[560px]:pb-[60px]">

              {/* Left content */}
              <div className="max-w-[460px]">
                <span className={`${eyebrow} mb-[22px]`}>Dr inż.</span>
                <h1 className="font-light text-[62px] leading-[1.02] tracking-[0.01em] text-white uppercase max-[980px]:text-[48px] max-[560px]:text-[38px]">
                  Michał<br />Macherzyński
                </h1>
                <div className="w-16 h-0.5 bg-accent mt-[34px] mb-[26px]" />
                <div className="font-montserrat font-light text-[22px] tracking-[0.22em] uppercase text-light leading-[1.5]">
                  Inżynier spawalnik<br />IWE / IWI / VT2 / PT2
                </div>
                <p className="mt-6 max-w-[400px] text-[15.5px] leading-[1.7] text-light-muted font-light">
                  Łączę doświadczenie praktyczne z wiedzą inżynierską, dostarczając rozwiązania o najwyższej jakości w zakresie spawalnictwa i konstrukcji stalowych.
                </p>
                <button
                  className="inline-flex items-center gap-[30px] mt-[38px] border border-white/[0.28] px-[26px] py-[17px] font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-light transition-all duration-[250ms] bg-transparent cursor-pointer hover:bg-accent hover:border-accent hover:text-ink"
                  onClick={(e) => openModal('cv', e.currentTarget)}
                >
                  Dowiedz się więcej <ArrowRight />
                </button>
              </div>

              {/* Right display text — absolute, right edge of content area */}
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center max-[980px]:hidden">
                <div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-dark-text">Teoria</div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-accent">Doświadczenie</div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-dark-text">Praktyka</div>
                </div>
                <div className="mt-4 flex gap-2 items-start">
                  <span className="font-great-vibes text-[22px] text-accent leading-none mt-0.5 flex-none">&ldquo;</span>
                  <p className="text-[13.5px] leading-[1.75] text-[#56544e] font-normal">
                    Doświadczeniem buduję<br />most pomiędzy teorią<br />a praktyką.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* ====== ABOUT ====== */}
      <section className="bg-cream relative pt-24 pb-[78px]" id="about">
        <div className="absolute top-[46px] left-[34px] w-[120px] h-[90px] opacity-50 dots-pattern" />
        <div className={wrap}>
          <div className="grid grid-cols-[0.85fr_1.15fr] gap-[70px] items-start max-[980px]:grid-cols-1 max-[980px]:gap-10">

            {/* Portrait with offset frame */}
            <div className="relative pl-[18px] pt-[18px] pb-[18px]">
              <div className="absolute left-0 top-[42px] bottom-0 w-[78%] border border-accent z-0" />
              <div className="relative z-10">
                <ImageSlot placeholder="Zdjęcie — Kim jestem" className="w-full h-[430px] max-[980px]:h-[380px]" />
              </div>
            </div>

            {/* About text */}
            <div>
              <span className={`${eyebrow} mb-[14px]`}>Kim jestem?</span>
              <h2 className="font-medium text-[27px] tracking-[0.02em] text-dark-text mt-[14px] mb-[22px] uppercase">
                Dr inż. Michał Macherzyński
              </h2>
              <p className="text-[15px] leading-[1.85] text-[#56544e] max-w-[520px]">
                Główny Spawalnik oraz Kierownik Projektów B+R w ZUGIL S.A. Od ponad 18 lat związany ze spawalnictwem i konstrukcjami stalowymi. Krótka prezentacja, doświadczenie i wartości — pełny opis zostanie wczytany z zasobów.
              </p>

              <div className="flex justify-end mt-[26px] mb-1.5">
                <button
                  className="inline-flex items-center gap-3 bg-transparent border border-accent text-accent font-montserrat text-xs font-semibold tracking-[0.14em] uppercase px-[18px] py-[11px] cursor-pointer transition-all duration-[220ms] hover:bg-accent hover:text-white"
                  onClick={(e) => openModal('bio', e.currentTarget)}
                >
                  …więcej o mnie
                  <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-2.5">
                    <path d="M0 6h28M23 1l5 5-5 5" />
                  </svg>
                </button>
              </div>

              {/* Tiles carousel */}
              <div
                className="group relative mt-[18px] border border-hairline-light bg-white/35 cursor-pointer overflow-hidden hover:border-accent"
                role="button"
                tabIndex={0}
                aria-label="Zobacz wszystkie liczby"
                onClick={(e) => openModal('tiles', e.currentTarget as HTMLElement)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal('tiles', e.currentTarget as HTMLElement) } }}
              >
                <div className="absolute top-0 bottom-0 left-0 w-[46px] z-[2] pointer-events-none [background:linear-gradient(90deg,var(--color-cream),transparent)]" />
                <div className="absolute top-0 bottom-0 right-0 w-[46px] z-[2] pointer-events-none [background:linear-gradient(270deg,var(--color-cream),transparent)]" />
                <div className="overflow-hidden">
                  <div className="flex w-max [animation:marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
                    {[...TILES, ...TILES].map((t, i) => (
                      <div key={i} className="flex-none w-[158px] text-center px-3 pt-[30px] pb-[26px] border-r border-hairline-light max-[980px]:w-[150px]">
                        <div className="font-montserrat font-semibold text-[28px] text-dark-text leading-none">{t.n}</div>
                        <div className="font-montserrat text-[10px] font-medium tracking-[0.13em] uppercase text-dark-muted mt-[11px] leading-[1.5]">{t.s}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="absolute right-3 bottom-[9px] font-montserrat text-[9.5px] font-semibold tracking-[0.14em] uppercase text-accent flex items-center gap-[7px] [background:linear-gradient(90deg,transparent,var(--color-cream)_30%)] pl-[30px] pointer-events-none">
                  Zobacz wszystkie
                  <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[15px] h-[9px]"><path d="M0 6h28M23 1l5 5-5 5" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== OBSZARY ====== */}
      <section className="bg-cream-2 py-[74px]" id="areas">
        <div className={wrap}>
          <div>
            <span className={`${eyebrow} mb-[14px]`}>Co oferuję?</span>
            <h2 className="font-montserrat font-semibold text-[30px] tracking-[0.04em] uppercase text-dark-text">Obszary działalności</h2>
          </div>
          <div className="grid grid-cols-3 gap-[26px] mt-[42px] max-[980px]:grid-cols-1">
            {[
              {
                href: '/nadzor-spawalniczy',
                name: 'Nadzór\nspawalniczy',
                icon: (
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
                    <path d="M20 24a12 12 0 0 1 24 0v6c0 9-5 16-12 16s-12-7-12-16z" />
                    <path d="M16 24c0-9 7-16 16-16s16 7 16 16" />
                    <rect x="24" y="26" width="16" height="7" rx="2" />
                    <path d="M26 40h12M44 46l6 10M20 46l-6 10" />
                  </svg>
                ),
              },
              {
                href: '/konstrukcje-stalowe',
                name: 'Konstrukcje\nstalowe',
                icon: (
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
                    <path d="M32 12L10 28v2M32 12l22 16v2" />
                    <path d="M12 30v22M52 30v22M12 52h40M12 30h40" />
                    <path d="M18 52V36h12v16M34 52V36h12v16" />
                  </svg>
                ),
              },
              {
                href: '/meble-premium',
                name: 'Meble\npremium',
                icon: (
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
                    <path d="M10 26h44M14 26l4-8h28l4 8" />
                    <path d="M16 26v22M48 26v22M16 40h32M22 48v6M42 48v6" />
                  </svg>
                ),
              },
            ].map(({ href, name, icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center justify-center gap-[22px] border border-hairline-light bg-white/40 px-[26px] pt-12 pb-10 text-center transition-all duration-[250ms] relative min-h-[230px] hover:border-accent hover:bg-white hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(14,26,23,0.10)]"
              >
                <span className="text-[#3a3933] transition-colors duration-[250ms] group-hover:text-accent">{icon}</span>
                <span className="font-montserrat font-semibold text-[15px] tracking-[0.1em] uppercase text-dark-text leading-[1.5] whitespace-pre-line">{name}</span>
                <span className="inline-flex items-center gap-[9px] font-montserrat text-[10.5px] font-semibold tracking-[0.16em] uppercase text-accent opacity-0 translate-y-1.5 transition-all duration-[250ms] group-hover:opacity-100 group-hover:translate-y-0">
                  Zobacz <ArrowRight className="w-5 h-[9px]" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WORKSHOP ====== */}
      <section className="bg-cream-2 pb-[86px] relative" id="workshop">
        <div className="absolute right-[30px] bottom-[60px] w-[120px] h-[90px] opacity-[0.45] dots-pattern" />
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1.35fr] gap-[50px] items-center border-t border-hairline-light pt-[54px] max-[980px]:grid-cols-1 max-[980px]:gap-9">
            <div>
              <span className={`${eyebrow} mb-4`}>Zaplecze</span>
              <h2 className="font-semibold text-[23px] uppercase tracking-[0.03em] text-dark-text leading-[1.3] mb-5">Warsztat i zaplecze techniczne</h2>
              <p className="text-[14.5px] leading-[1.8] text-[#56544e] max-w-[380px]">Dysponuję nowoczesnym zapleczem technologicznym oraz własnym warsztatem o powierzchni 350 m² z suwnicą 5 TON, co pozwala realizować nawet najbardziej wymagające projekty.</p>
            </div>
            <div className="grid grid-cols-4 max-[560px]:grid-cols-2">
              {[
                {
                  lbl: 'Suwnica\n5 ton',
                  icon: <svg viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[52px] h-[52px]"><path d="M10 8v36M10 8h30l-6 7H10M22 15v6M22 21l-4 4h8zM22 25v12M16 44h12M6 44h8" /></svg>,
                },
                {
                  lbl: 'Powierzchnia\n350 m²',
                  icon: <svg viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[52px] h-[52px]"><path d="M26 8L8 22v20h36V22zM18 42V30h16v12M14 26h6M32 26h6" /></svg>,
                },
                {
                  lbl: 'Stanowiska\nspawalnicze',
                  icon: <svg viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[52px] h-[52px]"><rect x="10" y="38" width="16" height="8" rx="1" /><path d="M18 38V24l14-10" /><circle cx="18" cy="22" r="3" /><path d="M32 14l8 4-3 7-8-3zM37 25l4 9" /></svg>,
                },
                {
                  lbl: 'Nowoczesny\npark maszynowy',
                  icon: <svg viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[52px] h-[52px]"><rect x="8" y="12" width="36" height="22" rx="2" /><path d="M4 42h44M20 34v8M32 34v8M16 20h20M16 26h12" /></svg>,
                },
              ].map(({ lbl, icon }) => (
                <div key={lbl} className="text-center px-2.5 border-r border-hairline-light last:border-r-0 max-[560px]:border-r-0 max-[560px]:mb-7">
                  <div className="h-14 flex items-center justify-center text-[#3a3933] mb-4">{icon}</div>
                  <div className="font-montserrat text-[11px] font-semibold tracking-[0.1em] uppercase text-[#43423c] leading-[1.6] whitespace-pre-line">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-ink-3 text-light pt-16 pb-[26px] relative" id="contact">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-12 items-start max-[980px]:grid-cols-1">

            {/* Contact */}
            <div>
              <span className={`${eyebrow} mb-[18px]`}>Porozmawiajmy o Twoim projekcie</span>
              <h2 className="font-semibold text-[30px] tracking-[0.04em] uppercase text-white mb-[30px]">Skontaktuj się</h2>
              {[
                {
                  href: 'tel:+48601488318',
                  label: '+48 601 488 318',
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>,
                },
                {
                  href: 'mailto:kontakt@poczta-mcraft.pl',
                  label: 'kontakt@poczta-mcraft.pl',
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>,
                },
              ].map(({ href, label, icon }) => (
                <div key={href} className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                  {icon}
                  <a href={href} className="hover:text-light transition-colors duration-200">{label}</a>
                </div>
              ))}
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>Żołnierzy Września 36, 42-152 Wilkowiecko</span>
              </div>
            </div>

            {/* Quote */}
            <div className="border-l border-hairline-dark pl-[46px] max-[980px]:border-l-0 max-[980px]:pl-0 max-[980px]:border-t max-[980px]:border-hairline-dark max-[980px]:pt-[34px]">
              <span className="font-great-vibes text-[74px] text-accent block h-[30px] leading-none">&ldquo;</span>
              <p className="text-[18px] italic leading-[1.6] text-[#dfded8] font-light mb-[26px] max-w-[340px]">Jakość to nie cel. To standard, z którego się nie rezygnuje.</p>
              <div className="font-great-vibes text-[34px] text-accent-bright">Michał Macherzyński</div>
            </div>

            {/* Brand */}
            <div className="flex flex-col items-end text-right max-[980px]:items-start max-[980px]:text-left">
              <svg className="w-[62px] h-[62px] text-white" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
                <path d="M8 50V12l22 24 22-24v38" /><path d="M8 12h6M52 12h-6" />
              </svg>
              <div className="font-montserrat font-semibold text-[26px] tracking-[0.34em] mt-[14px] mb-4">MCRAFT</div>
              <div className="font-montserrat text-[11px] font-medium tracking-[0.18em] uppercase text-light-muted">Łączę ludzi. Stal. Pomysły.</div>
              <div className="w-[50px] h-0.5 bg-accent mt-[18px]" />
            </div>
          </div>

          <div className="border-t border-hairline-dark mt-[46px] pt-[22px] text-center text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)]">
            © 2025 MCRAFT Michał Macherzyński. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </footer>

      {/* ====== MODAL ====== */}
      <div
        className={`fixed inset-0 z-[90] bg-[rgba(8,16,14,0.5)] [backdrop-filter:blur(9px)] transition-[opacity,visibility] duration-[420ms] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeModal}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-[95] w-[min(880px,66vw)] max-h-[88vh] bg-cream shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col max-[980px]:w-[92vw] ${isOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
        style={{ transform, opacity, transition: 'transform 0.55s cubic-bezier(.16,1,.3,1), opacity 0.4s ease' }}
      >
        <button
          className="absolute top-4 right-4 z-[5] w-[42px] h-[42px] border border-white/35 bg-black/[0.18] text-white rounded-full text-xl leading-none cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-accent hover:border-accent"
          onClick={closeModal}
          aria-label="Zamknij"
        >
          &times;
        </button>
        <div className="overflow-y-auto h-full flex flex-col">
          {modalKey === 'cv' && <ModalCV />}
          {modalKey === 'bio' && <ModalBio />}
          {modalKey === 'tiles' && <ModalTiles />}
        </div>
      </div>
    </>
  )
}
