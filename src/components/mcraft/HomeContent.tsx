'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  AboutSection,
  BioModal,
  CvModal,
  Document,
  HeroSection,
  Media,
  ServicePage,
  StatTile,
} from '@/payload-types'
import { ImageSlot } from './ImageSlot'
import { Logo } from './Logo'

function mediaUrl(field: string | Media | Document | null | undefined): string | null {
  if (!field || typeof field === 'string') return null
  return (field as { url?: string | null }).url ?? null
}

export interface HomeContentProps {
  hero: HeroSection
  about: AboutSection
  cvModal: CvModal
  bioModal: BioModal
  tiles: StatTile[]
  areas: Pick<ServicePage, 'slug' | 'thumbnailTitle' | 'thumbnailImage'>[]
}

type ModalKey = 'cv' | 'bio' | 'tiles'

/* ─── reusable class strings ─── */
const eyebrow = 'block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-[#008A58]'
const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase pb-1.5 relative transition-colors duration-200'

/* ─── icon helpers ─── */
function ArrowRight({ className = 'w-5 h-3 flex-none' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M0 6h28M23 1l5 5-5 5" />
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

function ModalDownloadBtn({ label, href }: { label: string; href?: string }) {
  const cls = 'self-start mx-12 mb-5 mt-1 inline-flex items-center gap-3 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.16em] uppercase px-5 py-3 cursor-pointer border-none transition-all duration-[220ms] hover:bg-accent hover:text-ink max-[980px]:mx-7'
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <DownloadIcon />{label}
      </a>
    )
  }
  return (
    <button className={cls}>
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

const CV_ITEMS_LI = 'grid grid-cols-[130px_1fr] gap-3 text-[13.5px] leading-[1.55] text-[#56544e] max-[980px]:grid-cols-[90px_1fr]'
const CV_YEAR = 'font-montserrat font-semibold text-[12px] tracking-[0.04em] text-dark-text'

function CvLi({ year, title, sub }: { year: string; title: string; sub?: string }) {
  return (
    <li className={CV_ITEMS_LI}>
      <span className={CV_YEAR}>{year}</span>
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold text-dark-text text-[13.5px]">{title}</span>
        {sub && <span>{sub}</span>}
      </span>
    </li>
  )
}

function ModalCV({ cvModal }: { cvModal: CvModal }) {
  const hasData = (cvModal.experience?.length ?? 0) > 0
  const cvFileUrl = mediaUrl(cvModal.cvFile) ?? '/CV%20Micha%C5%82%20Macherzy%C5%84ski%20PL%20(06.2026).pdf'

  return (
    <>
      <ModalHead eyebrowText="Dowiedz się więcej" title="Dr inż. Michał Macherzyński" sub="CV zawodowe - doświadczenie i kwalifikacje" />
      <div className="px-12 pt-4 pb-4 max-[980px]:px-7">
        {hasData ? (
          <>
            {cvModal.experience && cvModal.experience.length > 0 && (
              <ModalBodySection title="Doświadczenie zawodowe">
                <ul className="flex flex-col gap-2">
                  {cvModal.experience.map((item) => (
                    <CvLi key={item.id ?? item.year} year={item.year} title={item.description} sub={item.company ?? undefined} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.qualifications && cvModal.qualifications.length > 0 && (
              <ModalBodySection title="Kwalifikacje">
                <ul className="flex flex-col gap-2">
                  {cvModal.qualifications.map((item) => (
                    <CvLi key={item.id ?? item.code} year={item.code} title={item.description} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.education && cvModal.education.length > 0 && (
              <ModalBodySection title="Edukacja">
                <ul className="flex flex-col gap-2">
                  {cvModal.education.map((item) => (
                    <CvLi key={item.id ?? item.year + item.institution} year={item.year} title={item.institution} sub={item.description ?? undefined} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.additionalQualifications && cvModal.additionalQualifications.length > 0 && (
              <ModalBodySection title="Dodatkowe kwalifikacje">
                <ul className="flex flex-col gap-2">
                  {cvModal.additionalQualifications.map((item) => (
                    <CvLi key={item.id ?? item.year} year={item.year} title={item.description} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.skills && (
              <ModalBodySection title="Umiejętności">
                <p className="text-[13.5px] leading-[1.65] text-[#56544e] whitespace-pre-line">{cvModal.skills}</p>
              </ModalBodySection>
            )}
            {cvModal.interests && (
              <ModalBodySection title="Zainteresowania i hobby">
                <p className="text-[13.5px] leading-[1.65] text-[#56544e]">{cvModal.interests}</p>
              </ModalBodySection>
            )}
          </>
        ) : (
          <>
            <ModalBodySection title="Doświadczenie zawodowe">
              <ul className="flex flex-col gap-2">
                <CvLi year="2022r. - do dziś" title="Główny Spawalnik" sub="ZUGIL S.A." />
                <CvLi year="2025r. - do dziś" title="Kierownik projektu B+R" sub="Numer wniosku o dofinansowanie: FENG.01.01-IP.01-A0QL/24" />
                <CvLi year="2021r. - do dziś" title="Właściciel firmy" sub="MCRAFT Michał Macherzyński" />
                <CvLi year="2019r. - 2023r." title="Kluczowy personel w projekcie B+R" sub="Numer wniosku o dofinansowanie: POIR.01.01.01-00-0779/18" />
                <CvLi year="2016r. - 2022r." title="Technolog Spawalnik" sub="ZUGIL S.A." />
                <CvLi year="2016r. - 2020r." title="Wykładowca" sub="Szkolenia spawaczy organizowane przez Wojewódzki Uniwersytet Robotniczy Sp. z o.o." />
              </ul>
            </ModalBodySection>
            <ModalBodySection title="Kwalifikacje">
              <ul className="flex flex-col gap-2">
                <CvLi year="IWE" title="Międzynarodowy Inżynier Spawalnik" />
                <CvLi year="IWI" title="Międzynarodowy Inspektor Spawalniczy" />
                <CvLi year="VT2" title="Certyfikat kompetencji II stopnia zgodny z PN-EN ISO 9712, Instytut spawalnictwa w Gliwicach" />
                <CvLi year="PT2" title="Certyfikat kompetencji II stopnia zgodny z PN-EN ISO 9712, Instytut spawalnictwa w Gliwicach" />
              </ul>
            </ModalBodySection>
            <ModalBodySection title="Edukacja">
              <ul className="flex flex-col gap-2">
                <CvLi year="2017r. - 2022r." title="Politechnika Częstochowska" sub="Wydział Inżynierii Mechanicznej i Informatyki, Budowa i Eksploatacja Maszyn, III stopień" />
                <CvLi year="2021r." title="Sieć Badawcza Łukasiewicz - Instytut Spawalnictwa" sub="Kurs Międzynarodowego Inspektora Spawalniczego IWI-C" />
                <CvLi year="08.2019r." title="Wärtsilä Finland Oy" sub="Staż naukowy" />
                <CvLi year="2016r. - 2018r." title="Politechnika Częstochowska" sub="Studium Kształcenia i Doskonalenia Nauczycieli, Fakultatywne Studia Pedagogiczne" />
                <CvLi year="2017r. - 2018r." title="Politechnika Częstochowska" sub="Zakład Spawalnictwa, Wymagania i Kompetencje Międzynarodowego Inżyniera Spawalnika (IWE)" />
                <CvLi year="2012r. - 2017r." title="Politechnika Częstochowska" sub="Wydział Inżynierii Mechanicznej i Informatyki, Mechanika i Budowa Maszyn, Spawalnictwo, I i II stopień, tryb stacjonarny" />
                <CvLi year="2008r. - 2012r." title="Zespół Szkół nr 1 w Kłobucku" sub="Technikum Mechaniczne, Obróbka Skrawaniem" />
              </ul>
            </ModalBodySection>
            <ModalBodySection title="Dodatkowe kwalifikacje">
              <ul className="flex flex-col gap-2">
                <CvLi year="09.2014r." title="Kurs KPP - uzyskanie tytułu Ratownika" />
                <CvLi year="03.2014r." title="Kurs Autoryzowanego Centrum Szkoleniowego Autodesk - AutoCAD zaawansowany" />
                <CvLi year="11.2010r." title="Prawo jazdy kategorii: A, B" />
              </ul>
            </ModalBodySection>
            <ModalBodySection title="Umiejętności">
              <ul className="flex flex-col gap-2">
                <CvLi year="Obsługa" title="Autodesk Inventor Professional 3D, Autodesk AutoCAD, Siemens PLM Software Solid Edge 2D Drafting, Dassault Systemes Solid Works, Microsoft Office: Word, Excel, PowerPoint" />
                <CvLi year="Spawanie" title="MMA (111), MIG (131), MAG (135, 136, 138), TIG (141)" />
                <CvLi year="Dodatkowo" title="Znajomość rysunku technicznego, zarządzanie zespołem, praca zespołowa, rozwiązywanie problemów technicznych, bardzo dobra organizacja pracy" />
              </ul>
            </ModalBodySection>
            <ModalBodySection title="Zainteresowania i hobby">
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Sport, motoryzacja, podróże</p>
            </ModalBodySection>
          </>
        )}
      </div>
      <ModalDownloadBtn label="Pobierz CV (PDF)" href={cvFileUrl} />
    </>
  )
}

function ModalBio({ bioModal }: { bioModal: BioModal }) {
  const hasData = (bioModal.sections?.length ?? 0) > 0
  return (
    <>
      <ModalHead eyebrowText="Więcej o mnie" title="Michał Macherzyński" sub="Życiorys - droga i pasja" />
      <div className="px-12 pt-4 pb-4 max-[980px]:px-7">
        {hasData ? (
          bioModal.sections!.map((section) => (
            <ModalBodySection key={section.id ?? section.title} title={section.title}>
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">{section.content}</p>
            </ModalBodySection>
          ))
        ) : (
          <>
            <ModalBodySection title="Moja droga">
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Tu znajdzie się bardziej osobista opowieść - życiorys, początki fascynacji metalem i spawaniem, droga od warsztatu do tytułu doktora inżyniera. Treść zostanie przygotowana i wczytana z zasobów.</p>
            </ModalBodySection>
            <ModalBodySection title="Pasja">
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Poza pracą zawodową - tworzenie unikalnych mebli stalowych, projekty autorskie i ciągłe doskonalenie rzemiosła. To miejsce na prywatną, mniej formalną część historii.</p>
            </ModalBodySection>
            <ModalBodySection title="Wartości">
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Jakość jako standard, a nie cel. Rzetelność, dbałość o detal i partnerskie podejście do każdego projektu.</p>
            </ModalBodySection>
          </>
        )}
      </div>
    </>
  )
}

function ModalTiles({ tiles }: { tiles: StatTile[] }) {
  return (
    <>
      <ModalHead eyebrowText="W liczbach" title="Doświadczenie i kwalifikacje" sub="Kliknij dowolny kafelek, by poznać szczegóły" />
      <div className="grid grid-cols-4 p-[20px_48px_24px] max-[980px]:grid-cols-2 max-[980px]:p-5 max-[560px]:grid-cols-1">
        {tiles.map((t) => (
          <div key={t.id} className="p-[14px_14px] border border-hairline-light -m-px">
            <div className="font-montserrat font-semibold text-[28px] text-dark-text leading-none">{t.number}</div>
            <div className="font-montserrat text-[10px] font-semibold tracking-[0.12em] uppercase text-accent my-1.5">{t.label}</div>
            <p className="text-[12px] leading-[1.5] text-[#6a6862] m-0">{t.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── SVG icons per area slug ─── */
const AREA_ICONS: Record<string, React.ReactNode> = {
  'nadzor-spawalniczy': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
      <path d="M20 24a12 12 0 0 1 24 0v6c0 9-5 16-12 16s-12-7-12-16z" />
      <path d="M16 24c0-9 7-16 16-16s16 7 16 16" />
      <rect x="24" y="26" width="16" height="7" rx="2" />
      <path d="M26 40h12M44 46l6 10M20 46l-6 10" />
    </svg>
  ),
  'konstrukcje-stalowe': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
      <path d="M32 12L10 28v2M32 12l22 16v2" />
      <path d="M12 30v22M52 30v22M12 52h40M12 30h40" />
      <path d="M18 52V36h12v16M34 52V36h12v16" />
    </svg>
  ),
  'meble-premium': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
      <path d="M10 26h44M14 26l4-8h28l4 8" />
      <path d="M16 26v22M48 26v22M16 40h32M22 48v6M42 48v6" />
    </svg>
  ),
}

const AREA_DEFAULTS = [
  { href: '/nadzor-spawalniczy', slug: 'nadzor-spawalniczy', name: 'Nadzór\nspawalniczy' },
  { href: '/konstrukcje-stalowe', slug: 'konstrukcje-stalowe', name: 'Konstrukcje\nstalowe' },
  { href: '/meble-premium', slug: 'meble-premium', name: 'Meble\npremium' },
]

/* ─── main component ─── */
export function HomeContent({ hero, about, cvModal, bioModal, tiles, areas }: HomeContentProps) {
  const [modalKey, setModalKey] = useState<ModalKey | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [transform, setTransform] = useState('translate(-50%, -50%) scale(0.12)')
  const [opacity, setOpacity] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const lastOrigin = useRef({ dx: 0, dy: 0 })

  const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]))

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
    setIsClosing(true)
    setTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.12)`)
    setOpacity(0)
    document.body.style.overflow = ''
    setTimeout(() => { setIsOpen(false); setModalKey(null); setIsClosing(false) }, 250)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  const heroBackground = mediaUrl(hero.backgroundImage) ?? '/hero-tlo.png'
  const heroPersonPhoto = mediaUrl(hero.personPhoto) ?? '/hero-michal.png'
  const heroSubtitle = hero.subtitle ?? 'Inżynier spawalnik\nIWE / IWI / VT2 / PT2'
  const heroDescription = hero.description ?? ''
  const portraitUrl = mediaUrl(about.portraitPhoto) ?? '/kim-jestem.jpg'
  const bioText = about.bioText ?? 'Główny Spawalnik oraz Kierownik Projektów B+R w ZUGIL S.A. Od ponad 18 lat związany ze spawalnictwem i konstrukcjami stalowymi. Krótka prezentacja, doświadczenie i wartości - pełny opis zostanie wczytany z zasobów.'

  return (
    <>
      {/* ====== HERO ====== */}
      <header className="relative bg-ink text-light min-h-[680px] overflow-hidden" id="top">
        <Image
          src={heroBackground}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          alt=""
          priority
          className="z-0"
        />

        <div className="absolute inset-0 z-[1] pointer-events-none [background:linear-gradient(to_right,rgba(14,26,23,0.95)_0%,rgba(14,26,23,0.55)_32%,rgba(14,26,23,0)_55%)]" />

        <div className="absolute bottom-0 z-[2] pointer-events-none left-1/2 -translate-x-[55%] max-[980px]:-translate-x-1/2 max-[980px]:opacity-50 max-[560px]:hidden">
          <Image
            src={heroPersonPhoto}
            alt="Dr inż. Michał Macherzyński"
            width={390}
            height={620}
            className="h-[620px] w-auto max-[980px]:h-[460px]"
            priority
          />
        </div>

        <div className="absolute left-0 top-[120px] bottom-[60px] z-[3] flex flex-col items-center max-[560px]:hidden">
          <span className="w-px flex-1 bg-gradient-to-b from-accent to-transparent" />
          <span className="mt-[14px] text-light-muted">
            <svg width="14" height="30" viewBox="0 0 14 30" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M7 0v27M1 21l6 7 6-7" />
            </svg>
          </span>
        </div>

        <div className="relative z-[3]">
          <div className={wrap}>
            <nav className="flex items-center justify-between py-[30px]">
              <Logo />
              <div className="flex gap-[38px] max-[980px]:hidden">
                <a href="#about" className={`${navLink} text-black after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[22px] after:h-0.5 after:bg-accent`}>O mnie</a>
                <a href="#areas" className={`${navLink} text-black/70 hover:text-black`}>Obszary</a>
                <Link href="/nadzor-spawalniczy" className={`${navLink} text-black/70 hover:text-black`}>Realizacje</Link>
                <a href="#workshop" className={`${navLink} text-black/70 hover:text-black`}>Warsztat</a>
                <a href="#contact" className={`${navLink} text-black/70 hover:text-black`}>Kontakt</a>
              </div>
            </nav>

            <div className="flex items-start justify-between pt-[56px] pb-[90px] max-[560px]:pt-[30px] max-[560px]:pb-[60px] max-[980px]:block">
              <div className="max-w-[460px] flex-shrink-0">
                <span className={`${eyebrow} mb-[22px]`}>Dr inż.</span>
                <h1 className="font-light text-[62px] leading-[1.02] tracking-[0.01em] text-white uppercase max-[980px]:text-[48px] max-[560px]:text-[38px]">
                  Michał<br />Macherzyński
                </h1>
                <div className="w-16 h-0.5 bg-accent mt-[34px] mb-[26px]" />
                <div className="font-montserrat font-light text-[22px] tracking-[0.22em] uppercase text-light leading-[1.5] whitespace-pre-line">
                  {heroSubtitle}
                </div>
                <button
                  className="inline-flex items-center gap-[30px] mt-[90px] border border-[#3A3A3A] px-[26px] py-[17px] font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-light transition-all duration-[250ms] bg-transparent cursor-pointer hover:bg-accent hover:border-accent hover:text-ink"
                  onClick={(e) => openModal('cv', e.currentTarget)}
                >
                  Dowiedz się więcej <ArrowRight />
                </button>
              </div>

              <div className="flex flex-col justify-start mr-[8%] max-[980px]:hidden">
                <div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-black">Teoria</div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-[#069364]">Doświadczenie</div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-black">Praktyka</div>
                </div>
                <div className="mt-4">
                  <hr className="border-[#ccc] mb-4" />
                  <p className="relative text-lg font-bold leading-[1.75] text-[#56544e] pl-5">
                    <span className="absolute left-0 top-0 text-3xl font-bold text-[#00A887]">{'"'}</span>
                    Doświadczeniem buduję
                    <br />
                    most pomiędzy teorią
                    <br />
                    a praktyką.
                    <span className="ml-1 text-3xl font-bold text-[#00A887]">{'"'}</span>
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
          <div className="grid [grid-template-columns:minmax(250px,0.7fr)_1.3fr] gap-[36px] items-stretch max-[700px]:grid-cols-1 max-[700px]:gap-8">

            <div className="relative p-[18px] h-full max-[700px]:aspect-[4/3]">
              {/* narożnik lewy górny */}
              <span className="absolute top-0 left-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-t border-l border-accent pointer-events-none" />
              {/* narożnik prawy górny */}
              <span className="absolute top-0 right-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-t border-r border-accent pointer-events-none" />
              {/* narożnik lewy dolny */}
              <span className="absolute bottom-0 left-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-b border-l border-accent pointer-events-none" />
              {/* narożnik prawy dolny */}
              <span className="absolute bottom-0 right-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-b border-r border-accent pointer-events-none" />
              <div className="relative z-10 h-full">
                {portraitUrl ? (
                  <Image src={portraitUrl} alt="Dr inż. Michał Macherzyński" fill className="object-cover object-top" />
                ) : (
                  <ImageSlot placeholder="Zdjęcie - Kim jestem" className="w-full h-full" />
                )}
              </div>
            </div>

            <div className="min-w-0">
              <span className={`${eyebrow} mb-[14px]`}>Kim jestem?</span>
              <h2 className="font-medium text-[27px] tracking-[0.02em] text-dark-text mt-[14px] mb-[22px] uppercase">
                Dr inż. Michał Macherzyński
              </h2>
              <p className="text-[15px] leading-[1.85] text-[#56544e]">
                {bioText}
              </p>

              <div className="flex justify-end mt-[26px] mb-1.5">
                <button
                  className="inline-flex items-center gap-3 bg-transparent border border-[#3A3A3A] text-accent font-montserrat text-xs font-semibold tracking-[0.14em] uppercase px-[18px] py-[11px] cursor-pointer transition-all duration-[220ms] hover:bg-accent hover:border-accent hover:text-white"
                  onClick={(e) => openModal('bio', e.currentTarget)}
                >
                  …więcej o mnie
                  <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-2.5">
                    <path d="M0 6h28M23 1l5 5-5 5" />
                  </svg>
                </button>
              </div>

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
            {AREA_DEFAULTS.map(({ href, slug, name }) => {
              const cmsArea = areaBySlug[slug]
              const displayName = cmsArea?.thumbnailTitle ?? name
              const thumbUrl = mediaUrl(cmsArea?.thumbnailImage)
              return (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col items-center justify-center gap-[22px] border border-hairline-light bg-white/40 px-[26px] pt-12 pb-10 text-center transition-all duration-[250ms] relative min-h-[230px] hover:border-accent hover:bg-white hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(14,26,23,0.10)] overflow-hidden"
                >
                  {thumbUrl ? (
                    <div className="relative w-full h-[120px] -mx-[26px] -mt-12 mb-0">
                      <Image src={thumbUrl} alt={displayName} fill className="object-cover" />
                    </div>
                  ) : (
                    <span className="text-[#3a3933] transition-colors duration-[250ms] group-hover:text-accent">{AREA_ICONS[slug]}</span>
                  )}
                  <span className="font-montserrat font-semibold text-[15px] tracking-[0.1em] uppercase text-dark-text leading-[1.5] whitespace-pre-line">{displayName}</span>
                  <span className="inline-flex items-center gap-[9px] font-montserrat text-[10.5px] font-semibold tracking-[0.16em] uppercase text-accent opacity-0 translate-y-1.5 transition-all duration-[250ms] group-hover:opacity-100 group-hover:translate-y-0">
                    Zobacz <ArrowRight className="w-5 h-[9px]" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-ink-3 text-light pt-16 pb-[26px] relative" id="contact">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1.2fr] gap-12 items-start max-[768px]:grid-cols-1">

            <div>
              <span className={`${eyebrow} mb-[18px]`}>Porozmawiajmy o Twoim projekcie</span>
              <h2 className="font-semibold text-[30px] tracking-[0.04em] uppercase text-white mb-[22px]">Skontaktuj się</h2>
              <div className="mb-[22px]">
                <div className="font-montserrat font-semibold text-[13px] tracking-[0.08em] text-white mb-[8px]">MCRAFT Michał Macherzyński</div>
                <div className="text-[13px] text-light-muted leading-[1.8]">
                  NIP: 5742046939<br />
                  REGON: 388131678
                </div>
              </div>
              {[
                {
                  href: 'tel:+48601488318',
                  label: '+48 601-488-318',
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
                <span>ul. Żołnierzy Września 36, 42-152 Wilkowiecko</span>
              </div>
            </div>

            <div className="border-l border-hairline-dark pl-[46px] max-[768px]:border-l-0 max-[768px]:pl-0 max-[768px]:border-t max-[768px]:border-hairline-dark max-[768px]:pt-[34px] overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=ul.+Żołnierzy+Września+36,+42-152+Wilkowiecko&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, filter: 'grayscale(1) invert(0.85) contrast(0.9)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokalizacja MCRAFT"
              />
            </div>
          </div>

          <div className="border-t border-hairline-dark mt-[46px] pt-[22px] text-center text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)]">
            © 2025 MCRAFT Michał Macherzyński. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </footer>

      {/* ====== MODAL ====== */}
      <div
        className={`fixed inset-0 z-[90] bg-[rgba(8,16,14,0.5)] [backdrop-filter:blur(9px)] ${isClosing ? 'transition-[opacity,visibility] duration-[200ms]' : 'transition-[opacity,visibility] duration-[420ms]'} ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeModal}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-[95] w-[min(880px,66vw)] max-h-[88vh] bg-cream shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col max-[980px]:w-[92vw] ${isOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
        style={{ transform, opacity, transition: isClosing ? 'transform 0.22s ease-in, opacity 0.18s ease-in' : 'transform 0.55s cubic-bezier(.16,1,.3,1), opacity 0.4s ease' }}
      >
        <button
          className="absolute top-4 right-4 z-[5] w-[42px] h-[42px] border border-white/35 bg-black/[0.18] text-white rounded-full text-xl leading-none cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-accent hover:border-accent"
          onClick={closeModal}
          aria-label="Zamknij"
        >
          &times;
        </button>
        <div className="overflow-y-auto h-full flex flex-col modal-scroll">
          {modalKey === 'cv' && <ModalCV cvModal={cvModal} />}
          {modalKey === 'bio' && <ModalBio bioModal={bioModal} />}
          {modalKey === 'tiles' && <ModalTiles tiles={tiles} />}
        </div>
      </div>
    </>
  )
}
