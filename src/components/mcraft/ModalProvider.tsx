'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { BioModal, CvModal, StatTile } from '@/payload-types'
import type { Dictionary } from '@/lib/i18n/dictionaries/pl'
import { getTileIcon } from '@/lib/tileIcons'
import { mediaUrl } from '@/lib/mediaUrl'

export type ModalKey = 'cv' | 'bio' | 'tiles' | 'scope'

export interface ScopeModalContent {
  title: string
  description: string
}

interface ModalContextValue {
  openModal: (key: ModalKey, el: HTMLElement, content?: ScopeModalContent) => void
  closeModal: () => void
  isOpen: boolean
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal outside ModalProvider')
  return ctx
}

/** Jak useModal(), ale zwraca null zamiast rzucac - dla komponentow renderowanych
 *  tez poza ModalProvider (np. MobileNav na stronie realizacji/[slug]). */
export function useOptionalModal() {
  return useContext(ModalContext)
}

/* ─── modal sub-components ─── */

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  )
}

function ModalHead({ eyebrowText, title, sub }: { eyebrowText?: string; title: string; sub?: string }) {
  return (
    <div className="bg-ink text-light px-12 pt-7 pb-6 relative overflow-hidden flex-none max-[980px]:px-7">
      <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
      <div className="relative">
        {eyebrowText && <span className="font-montserrat text-[11px] font-semibold tracking-[0.26em] uppercase text-accent-bright">{eyebrowText}</span>}
        <h2 className={`font-light text-[34px] uppercase tracking-[0.02em] text-white max-[980px]:text-[27px] ${eyebrowText ? 'mt-[14px]' : ''}`}>{title}</h2>
        {sub && <div className="font-montserrat font-light text-[14px] tracking-[0.14em] uppercase text-light-muted mt-2.5">{sub}</div>}
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
  return <button className={cls}><DownloadIcon />{label}</button>
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

function ModalCV({ cvModal, dict }: { cvModal: CvModal; dict: Dictionary }) {
  const hasData = (cvModal.experience?.length ?? 0) > 0
  const cvFileUrl = mediaUrl(cvModal.cvFile) ?? undefined

  return (
    <>
      <ModalHead eyebrowText={dict.modal.cv.eyebrow} title={dict.modal.cv.title} sub={dict.modal.cv.sub} />
      <div className="px-12 pt-4 pb-4 max-[980px]:px-7">
        {hasData ? (
          <>
            {cvModal.experience && cvModal.experience.length > 0 && (
              <ModalBodySection title={dict.modal.cv.sections.experience}>
                <ul className="flex flex-col gap-2">
                  {cvModal.experience.map((item) => (
                    <CvLi key={item.id ?? item.year} year={item.year} title={item.description ?? ''} sub={item.company ?? undefined} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.qualifications && cvModal.qualifications.length > 0 && (
              <ModalBodySection title={dict.modal.cv.sections.qualifications}>
                <ul className="flex flex-col gap-2">
                  {cvModal.qualifications.map((item) => (
                    <CvLi key={item.id ?? item.code} year={item.code} title={item.description ?? ''} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.education && cvModal.education.length > 0 && (
              <ModalBodySection title={dict.modal.cv.sections.education}>
                <ul className="flex flex-col gap-2">
                  {cvModal.education.map((item) => (
                    <CvLi key={item.id ?? item.year + item.institution} year={item.year} title={item.institution ?? ''} sub={item.description ?? undefined} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.additionalQualifications && cvModal.additionalQualifications.length > 0 && (
              <ModalBodySection title={dict.modal.cv.sections.additionalQualifications}>
                <ul className="flex flex-col gap-2">
                  {cvModal.additionalQualifications.map((item) => (
                    <CvLi key={item.id ?? item.year} year={item.year} title={item.description ?? ''} />
                  ))}
                </ul>
              </ModalBodySection>
            )}
            {cvModal.skills && (
              <ModalBodySection title={dict.modal.cv.sections.skills}>
                <p className="text-[13.5px] leading-[1.65] text-[#56544e] whitespace-pre-line">{cvModal.skills}</p>
              </ModalBodySection>
            )}
            {cvModal.interests && (
              <ModalBodySection title={dict.modal.cv.sections.interests}>
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
      <ModalDownloadBtn label={dict.modal.cv.downloadLabel} href={cvFileUrl} />
    </>
  )
}

function ModalBio({ bioModal, dict }: { bioModal: BioModal; dict: Dictionary }) {
  const sectionsWithContent = (bioModal.sections ?? []).filter(
    (s): s is typeof s & { title: string; content: NonNullable<typeof s.content> } => Boolean(s.title) && Boolean(s.content),
  )
  const hasData = sectionsWithContent.length > 0
  return (
    <>
      <ModalHead eyebrowText={dict.modal.bio.eyebrow} title={dict.modal.bio.title} sub={dict.modal.bio.sub} />
      <div className="px-12 pt-4 pb-4 max-[980px]:px-7">
        {hasData ? (
          sectionsWithContent.map((section) => (
            <ModalBodySection key={section.id ?? section.title} title={section.title}>
              <div className="prose-mcraft">
                <RichText data={section.content} />
              </div>
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

function ModalTilesContent({ tiles, dict }: { tiles: StatTile[]; dict: Dictionary }) {
  return (
    <>
      <ModalHead title={dict.modal.tiles.title} />
      <div className="grid grid-cols-4 p-[20px_48px_24px] max-[980px]:grid-cols-2 max-[980px]:p-5 max-[560px]:grid-cols-1">
        {tiles.map((t) => {
          const Icon = getTileIcon(t.number, t.icon)
          return (
            <div key={t.id} className="overflow-hidden p-[14px_14px] border border-hairline-light -m-px">
              <Icon className="w-[30px] h-[30px] text-accent mb-3 opacity-75" strokeWidth={1.4} />
              <div className="font-montserrat font-semibold text-[26px] text-dark-text leading-none break-all">{t.number}</div>
              <div className="font-montserrat text-[10px] font-semibold tracking-[0.08em] uppercase text-accent mt-2 mb-1.5 leading-[1.4] break-words">{t.label}</div>
              <p className="text-[12px] leading-[1.5] text-[#6a6862] m-0">{t.description}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}

function ModalScopeContent({ title, description, dict }: ScopeModalContent & { dict: Dictionary }) {
  return (
    <>
      <ModalHead eyebrowText={dict.modal.scope.eyebrow} title={title} />
      <div className="px-12 pt-4 pb-8 max-[980px]:px-7">
        <p className="text-[13.5px] leading-[1.65] text-[#56544e]">{description}</p>
      </div>
    </>
  )
}

/* ─── provider ─── */

interface ModalProviderProps {
  children: React.ReactNode
  cvModal?: CvModal
  bioModal?: BioModal
  tiles?: StatTile[]
  dict: Dictionary
}

export function ModalProvider({ children, cvModal, bioModal, tiles, dict }: ModalProviderProps) {
  const [modalKey, setModalKey] = useState<ModalKey | null>(null)
  const [scopeContent, setScopeContent] = useState<ScopeModalContent | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [transform, setTransform] = useState('translate(-50%, -50%) scale(0.12)')
  const [opacity, setOpacity] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const lastOrigin = useRef({ dx: 0, dy: 0 })
  const scrollYRef = useRef(0)

  const openModal = useCallback((key: ModalKey, el: HTMLElement, content?: ScopeModalContent) => {
    const r = el.getBoundingClientRect()
    const dx = r.left + r.width / 2 - window.innerWidth / 2
    const dy = r.top + r.height / 2 - window.innerHeight / 2
    lastOrigin.current = { dx, dy }
    setModalKey(key)
    setScopeContent(content ?? null)
    setTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.12)`)
    setOpacity(0)
    setIsOpen(true)
    scrollYRef.current = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.width = '100%'
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
    const y = scrollYRef.current
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo({ top: y, behavior: 'instant' })
    setTimeout(() => { setIsOpen(false); setModalKey(null); setIsClosing(false) }, 250)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}

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
          aria-label={dict.modal.closeAria}
        >
          &times;
        </button>
        <div className="overflow-y-auto h-full flex flex-col modal-scroll">
          {modalKey === 'cv' && cvModal && <ModalCV cvModal={cvModal} dict={dict} />}
          {modalKey === 'bio' && bioModal && <ModalBio bioModal={bioModal} dict={dict} />}
          {modalKey === 'tiles' && tiles && <ModalTilesContent tiles={tiles} dict={dict} />}
          {modalKey === 'scope' && scopeContent && <ModalScopeContent {...scopeContent} dict={dict} />}
        </div>
      </div>
    </ModalContext.Provider>
  )
}
