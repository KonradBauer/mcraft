import Image from 'next/image'
import Link from 'next/link'
import type {
  AboutSection,
  BioModal,
  CvModal,
  HeroSection,
  Media,
  ServicePage,
  StatTile,
} from '@/payload-types'
import { mediaUrl } from '@/lib/mediaUrl'
import { ImageSlot } from './ImageSlot'
import { ImageWithSkeleton } from './ImageWithSkeleton'
import { LocationCard } from './LocationCard'
import { MobileNav } from './MobileNav'
import { NavRealizacjeDropdown } from './NavRealizacjeDropdown'
import { ModalProvider } from './ModalProvider'
import { ModalTrigger } from './ModalTrigger'
import { TilesMarquee } from './TilesMarquee'

export interface HomeContentProps {
  hero: HeroSection
  about: AboutSection
  cvModal: CvModal
  bioModal: BioModal
  tiles: StatTile[]
  areas: Pick<ServicePage, 'slug' | 'thumbnailTitle' | 'thumbnailImage'>[]
}

/* ─── reusable class strings ─── */
const eyebrow = 'block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-[#008A58]'
const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase relative transition-colors duration-200'

const HOME_NAV_LINKS = [
  { href: '#about', label: 'O mnie' },
  { href: '#areas', label: 'Obszary' },
  {
    label: 'Realizacje',
    sub: [
      { href: '/nadzor-spawalniczy', label: 'Nadzór spawalniczy' },
      { href: '/meble-premium', label: 'Meble premium' },
      { href: '/konstrukcje-stalowe', label: 'Konstrukcje stalowe' },
    ],
  },
  { href: '#contact', label: 'Kontakt' },
]

/* ─── icon helpers ─── */
function ArrowRight({ className = 'w-5 h-3 flex-none' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M0 6h28M23 1l5 5-5 5" />
    </svg>
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

/* ─── main component (server) ─── */
export function HomeContent({ hero, about, cvModal, bioModal, tiles, areas }: HomeContentProps) {
  const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]))

  const heroBackground = mediaUrl(hero.backgroundImage) ?? '/hero-tlo-v2.png'
  const heroPersonPhoto = mediaUrl(hero.personPhoto) ?? '/hero-michal.png'
  const heroSubtitle = hero.subtitle ?? 'Inżynier spawalnik\nIWE / IWI / VT2 / PT2'
  const portraitUrl = mediaUrl(about.portraitPhoto) ?? '/kim-jestem.jpg'
  const bioText = about.bioText ?? 'Główny Spawalnik oraz Kierownik Projektów B+R w ZUGIL S.A. Od ponad 18 lat związany ze spawalnictwem i konstrukcjami stalowymi. Krótka prezentacja, doświadczenie i wartości - pełny opis zostanie wczytany z zasobów.'

  const cvBtnClass = 'inline-flex items-center gap-[30px] mt-[clamp(30px,4.69vw,90px)] max-[980px]:hidden border border-[#3A3A3A] px-[26px] py-[clamp(12px,0.89vw,17px)] font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-light transition-all duration-[250ms] bg-transparent cursor-pointer hover:bg-accent hover:border-accent hover:text-ink'
  const cvBtnMobileClass = 'inline-flex items-center gap-[30px] border border-[#3A3A3A] px-[26px] py-[17px] font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-light transition-all duration-[250ms] bg-transparent cursor-pointer hover:bg-accent hover:border-accent hover:text-ink'

  return (
    <ModalProvider cvModal={cvModal} bioModal={bioModal} tiles={tiles}>
      {/* ====== HERO ====== */}
      <header className="relative w-full bg-ink text-light aspect-[48/18] max-[980px]:aspect-auto max-[980px]:min-h-[100svh] overflow-hidden" id="top">
        <Image
          src={heroBackground}
          fill
          sizes="100vw"
          quality={65}
          alt=""
          priority
          className="z-0 object-cover object-[33%]"
        />

        <div className="absolute inset-0 z-[1] pointer-events-none max-[980px]:hidden [background:linear-gradient(to_right,rgba(14,26,23,0.95)_0%,rgba(14,26,23,0.55)_32%,rgba(14,26,23,0)_55%)]" />
        <div className="hidden max-[980px]:block absolute inset-0 z-[1] pointer-events-none [background:linear-gradient(to_right,rgba(14,26,23,0.98)_0%,rgba(14,26,23,0.85)_55%,rgba(14,26,23,0.5)_100%)]" />

        <div className="absolute inset-y-0 z-[2] pointer-events-none shrink-0 flex items-end left-1/2 -translate-x-[55%] max-[980px]:top-auto max-[980px]:bottom-0 max-[980px]:-translate-x-1/2 max-[980px]:opacity-100 max-[560px]:translate-x-0 max-[560px]:left-auto max-[560px]:right-0">
          <Image
            src={heroPersonPhoto}
            alt="Dr inż. Michał Macherzyński"
            width={390}
            height={620}
            sizes="(max-width: 980px) 290px, 390px"
            className="h-[92%] w-auto max-[980px]:h-[420px] shrink-0"
            priority
          />
        </div>

        <div className="absolute left-0 top-[120px] bottom-[60px] z-[3] flex flex-col items-center max-[980px]:hidden">
          <span className="w-px flex-1 bg-gradient-to-b from-accent to-transparent" />
          <span className="mt-[14px] text-light-muted">
            <svg width="14" height="30" viewBox="0 0 14 30" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M7 0v27M1 21l6 7 6-7" />
            </svg>
          </span>
        </div>

        <div className="relative z-[5]">
          <div className={wrap}>
            <nav className="flex items-center justify-between py-[clamp(14px,1.56vw,30px)]">
              <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">MCRAFT</span>
              <div className="flex items-center gap-[24px] max-[980px]:hidden rounded-2xl bg-white/30 backdrop-blur-md px-1.5 py-px">
                <a href="#about" className={`${navLink} text-black`}>O mnie</a>
                <a href="#areas" className={`${navLink} text-black/70 hover:text-black`}>Obszary</a>
                <NavRealizacjeDropdown triggerClass={`${navLink} text-black/70 hover:text-black`} />
                <a href="#contact" className={`${navLink} text-black/70 hover:text-black`}>Kontakt</a>
              </div>
              <MobileNav links={HOME_NAV_LINKS} />
            </nav>

            <div className="flex items-start justify-between pt-[clamp(24px,2.92vw,56px)] pb-[clamp(30px,4.69vw,90px)] max-[980px]:pt-[24px] max-[980px]:pb-[16px] max-[980px]:block">
              <div className="max-w-[460px] flex-shrink-0">
                <span className={`${eyebrow} mb-[clamp(10px,1.15vw,22px)] text-[clamp(12px,0.94vw,18px)]`}>Dr inż.</span>
                <h1 className="font-light text-[clamp(30px,3.23vw,62px)] leading-[1.05] tracking-[0.01em] text-white uppercase max-[980px]:text-[38px]">
                  Michał<br />Macherzyński
                </h1>
                <div className="w-16 h-0.5 bg-accent mt-[clamp(16px,1.77vw,34px)] mb-[clamp(12px,1.35vw,26px)] max-[980px]:mt-[18px] max-[980px]:mb-[14px]" />
                <div className="font-montserrat font-light text-[clamp(14px,1.15vw,22px)] tracking-[0.22em] uppercase text-light leading-[1.4] whitespace-pre-line max-[980px]:hidden">
                  {heroSubtitle}
                </div>
                <ModalTrigger modalKey="cv" className={cvBtnClass}>
                  Dowiedz się więcej <ArrowRight />
                </ModalTrigger>
              </div>

              <div className="hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 max-[980px]:hidden">
                <div className="flex flex-col justify-start mr-[8%]">
                  <div>
                    <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-black">Teoria</div>
                    <div
                      className="font-montserrat font-semibold text-[40px] leading-[1.15] text-[#069364]">Doświadczenie
                    </div>
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
        </div>

        {/* Mobile/tablet bottom CTA */}
        <div
          className="hidden max-[980px]:flex absolute bottom-[36px] left-0 right-0 z-[4] flex-col items-start px-5 gap-[14px]">
          <p
            className="font-montserrat font-light text-[11px] tracking-[0.22em] uppercase text-white whitespace-pre-line leading-[1.9]">
            {heroSubtitle}
          </p>
          <ModalTrigger modalKey="cv" className={cvBtnMobileClass}>
            Dowiedz się więcej <ArrowRight />
          </ModalTrigger>
        </div>
      </header>

      {/* ====== ABOUT ====== */}
      <section className="bg-cream relative pt-24 pb-[78px]" id="about">
        <div className="absolute top-[46px] left-[34px] w-[120px] h-[90px] opacity-50 dots-pattern z-[2]" />
        <div className={wrap}>
          <div
            className="grid [grid-template-columns:minmax(250px,0.55fr)_1.45fr] gap-[36px] items-stretch max-[700px]:grid-cols-1 max-[700px]:gap-8">

            <div className="relative p-[18px] max-[700px]:aspect-square">
              <span
                className="absolute top-0 left-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-t border-l border-accent pointer-events-none" />
              <span className="absolute top-0 right-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-t border-r border-accent pointer-events-none" />
              <span className="absolute bottom-0 left-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-b border-l border-accent pointer-events-none" />
              <span className="absolute bottom-0 right-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-b border-r border-accent pointer-events-none" />
              <div className="relative h-full">
                {portraitUrl ? (
                  <ImageWithSkeleton src={portraitUrl} alt="Dr inż. Michał Macherzyński" className="object-cover object-top" sizes="(max-width: 700px) 100vw, 35vw" />
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
                <ModalTrigger
                  modalKey="bio"
                  className="inline-flex items-center gap-3 bg-transparent border border-[#3A3A3A] text-accent font-montserrat text-xs font-semibold tracking-[0.14em] uppercase px-[18px] py-[11px] cursor-pointer transition-all duration-[220ms] hover:bg-accent hover:border-accent hover:text-white"
                >
                  ...więcej o mnie
                  <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-2.5">
                    <path d="M0 6h28M23 1l5 5-5 5" />
                  </svg>
                </ModalTrigger>
              </div>

              <TilesMarquee tiles={tiles} />
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
              const thumbUrl = mediaUrl(cmsArea?.thumbnailImage as Media | string | null | undefined)
              return (
                <Link
                  key={href}
                  href={href}
                  className="group relative overflow-hidden min-h-[280px] flex items-end"
                >
                  {/* Background */}
                  {thumbUrl ? (
                    <div className="absolute inset-0">
                      <ImageWithSkeleton
                        src={thumbUrl}
                        alt={displayName}
                        className="object-cover group-hover:scale-[1.06] transition-transform duration-500"
                        sizes="(max-width: 980px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-ink-2 flex items-center justify-center">
                      <span className="text-accent/60">{AREA_ICONS[slug]}</span>
                    </div>
                  )}
                  {/* Gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  {/* Text frame */}
                  <div className="relative w-full px-[22px] py-[20px]">
                    <span className="block font-montserrat font-semibold text-[15px] tracking-[0.1em] uppercase text-white leading-[1.5] whitespace-pre-line">
                      {displayName}
                    </span>
                    <span className="inline-flex items-center gap-[9px] font-montserrat text-[10.5px] font-semibold tracking-[0.16em] uppercase text-accent mt-[10px] opacity-0 translate-y-1.5 transition-all duration-[250ms] group-hover:opacity-100 group-hover:translate-y-0">
                      Zobacz <ArrowRight className="w-5 h-[9px]" />
                    </span>
                  </div>
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
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>ul. Żołnierzy Września 36, 42-152 Wilkowiecko</span>
              </div>
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] text-accent flex-none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                <a href="https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/" target="_blank" rel="noopener noreferrer" className="hover:text-light transition-colors duration-200">LinkedIn</a>
              </div>
            </div>

            <div className="border-l border-hairline-dark pl-[46px] max-[768px]:border-l-0 max-[768px]:pl-0 max-[768px]:border-t max-[768px]:border-hairline-dark max-[768px]:pt-[34px] overflow-hidden">
              <LocationCard />
            </div>
          </div>

          <div className="border-t border-hairline-dark mt-[46px] pt-[22px] flex flex-row items-center justify-between gap-4 text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-2">
            <span>© {new Date().getFullYear()} MCRAFT Michał Macherzyński. Wszystkie prawa zastrzeżone.</span>
            <Link href="/polityka-prywatnosci" className="hover:text-light/60 transition-colors duration-200">Polityka prywatności</Link>
            <span>Wykonanie: <a href="https://studiocodeart.pl" target="_blank" rel="noopener noreferrer" className="hover:text-light/60 transition-colors duration-200">studiocodeart.pl</a></span>
          </div>
        </div>
      </footer>
    </ModalProvider>
  )
}
