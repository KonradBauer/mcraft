export const instant = false

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Media, PortfolioProject, ServicePage } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { LanguageSwitcher } from '@/components/mcraft/LanguageSwitcher'
import { MobileNav } from '@/components/mcraft/MobileNav'
import { NavRealizacjeDropdown } from '@/components/mcraft/NavRealizacjeDropdown'
import { PageFallback } from '@/components/mcraft/PageFallback'
import { RealizacjaGaleria } from '@/components/mcraft/RealizacjaGaleria'
import { DEFAULT_LOCALE, getLocale, type Locale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'

const PORTFOLIO_PAGES = ['meble-premium', 'konstrukcje-stalowe', 'mk-gym']

type RealizacjaItem = NonNullable<ServicePage['realizacje']>[number]

// Tylko mk-gym ma realizacje jako zagnieżdżoną tablicę w ServicePage (natywny
// collapse-all + drag-drop w adminie). Meble premium i konstrukcje stalowe
// zostają na starym modelu - osobna kolekcja portfolio-projects.
async function findMkGymRealizacja(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  locale: Locale,
): Promise<{ servicePage: ServicePage; item: RealizacjaItem } | undefined> {
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'mk-gym' } },
    depth: 2,
    limit: 1,
    locale,
  })
  const servicePage = docs[0]
  if (!servicePage) return undefined

  const item = (servicePage.realizacje ?? []).find((r) => r.slug === slug)
  if (item) return { servicePage, item }
  if (locale === DEFAULT_LOCALE) return undefined

  // slug pole jest localized, ale migracja ustawiła tylko `pl` - dopasowanie po `en` slugu
  // nie ma fallbacku (w przeciwienstwie do odczytu wartosci pola), wiec probujemy jeszcze raz po `pl`.
  const fallback = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'mk-gym' } },
    depth: 2,
    limit: 1,
    locale: DEFAULT_LOCALE,
  })
  const fallbackServicePage = fallback.docs[0]
  if (!fallbackServicePage) return undefined
  const fallbackItem = (fallbackServicePage.realizacje ?? []).find((r) => r.slug === slug)
  if (!fallbackItem) return undefined
  return { servicePage: fallbackServicePage, item: fallbackItem }
}

async function findPortfolioItemBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  locale: Locale,
): Promise<PortfolioProject | undefined> {
  const { docs } = await payload.find({
    collection: 'portfolio-projects',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    locale,
  })
  if (docs[0]) return docs[0]
  if (locale === DEFAULT_LOCALE) return undefined

  // slug pole jest localized, ale migracja ustawiła tylko `pl` - dopasowanie po `en` slugu
  // nie ma fallbacku (w przeciwienstwie do odczytu wartosci pola), wiec probujemy jeszcze raz po `pl`.
  const fallback = await payload.find({
    collection: 'portfolio-projects',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    locale: DEFAULT_LOCALE,
  })
  return fallback.docs[0]
}

async function findRealizacja(
  payload: Awaited<ReturnType<typeof getPayload>>,
  serviceSlug: string,
  slug: string,
  locale: Locale,
): Promise<{ sp: ServicePage; item: RealizacjaItem | PortfolioProject } | undefined> {
  if (serviceSlug === 'mk-gym') {
    const found = await findMkGymRealizacja(payload, slug, locale)
    if (!found) return undefined
    return { sp: found.servicePage, item: found.item }
  }

  const item = await findPortfolioItemBySlug(payload, slug, locale)
  if (!item) return undefined
  const sp = typeof item.servicePage === 'object' && item.servicePage !== null ? (item.servicePage as ServicePage) : null
  if (!sp || sp.slug !== serviceSlug) return undefined
  return { sp, item }
}

const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink =
  'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase pb-1.5 relative transition-colors duration-200 text-white/70 hover:text-white'

function resolveUrl(field: string | Media | null | undefined): string | null {
  if (!field || typeof field === 'string') return null
  return field.url ?? null
}

function toGalleryImages(
  images: { image: string | Media | null | undefined; alt?: string | null }[] | null | undefined,
  fallbackAlt: string,
): { url: string; alt: string }[] {
  return (images ?? []).reduce<{ url: string; alt: string }[]>((acc, g) => {
    const url = resolveUrl(g.image)
    if (url) acc.push({ url, alt: g.alt ?? fallbackAlt })
    return acc
  }, [])
}

type Props = {
  params: Promise<{ serviceSlug: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceSlug, slug } = await params
  if (!PORTFOLIO_PAGES.includes(serviceSlug)) return {}

  const payload = await getPayload({ config })
  const locale = await getLocale()
  const found = await findRealizacja(payload, serviceSlug, slug, locale)
  if (!found) return {}
  const { item } = found

  if (serviceSlug === 'mk-gym') {
    return {
      title: { absolute: `MK Gym | ${item.title}` },
      icons: { icon: '/mk-gym-favicon.png' },
    }
  }

  return {
    title: item.title,
  }
}

export default function RealizacjaPage({ params }: Props) {
  return (
    <Suspense fallback={<PageFallback />}>
      <RealizacjaPageContent params={params} />
    </Suspense>
  )
}

async function RealizacjaPageContent({ params }: Props) {
  // getLocale() (cookies()) musi wykonać się przed getPayload() - Payload przy zimnym
  // starcie połączenia z DB wewnętrznie odwołuje się do zegara, a Next wymaga żeby
  // rozpoznane dynamiczne API (cookies/headers/connection) zadziałało jako pierwsze.
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const { serviceSlug, slug } = await params

  if (!PORTFOLIO_PAGES.includes(serviceSlug)) notFound()

  const payload = await getPayload({ config })

  const isMkGym = serviceSlug === 'mk-gym'

  const NAV_LINKS = isMkGym
    ? [{ href: 'https://mkcraft.com.pl', label: dict.mkGym.backToMcraft }]
    : [
        { href: '/#about', label: dict.nav.about },
        { href: '/#areas', label: dict.nav.areas },
        {
          label: dict.nav.realizations,
          sub: [
            { href: '/nadzor-spawalniczy', label: dict.areas.names.nadzorSpawalniczy },
            { href: '/meble-premium', label: dict.areas.names.meblePremium },
            { href: '/konstrukcje-stalowe', label: dict.areas.names.konstrukcjeStalowe },
          ],
        },
        { href: '/#contact', label: dict.nav.contact },
      ]

  const found = await findRealizacja(payload, serviceSlug, slug, locale)
  if (!found) notFound()
  const { sp, item } = found

  const galleryImages = toGalleryImages(item.images, item.title ?? '')

  const additionalGalleryGroups = (item.additionalGalleries ?? [])
    .map((group) => ({
      title: group.title ?? null,
      description: group.description ?? null,
      images: toGalleryImages(group.images, group.title ?? item.title ?? ''),
    }))
    .filter((group) => group.images.length > 0)

  return (
    <>
      {/* Topbar */}
      <div className="bg-ink text-light">
        <div className={wrap}>
          <nav className="flex items-center justify-between py-[30px]">
            <Link href={isMkGym ? 'https://mkcraft.com.pl' : '/'}>
              {isMkGym ? (
                <span className="inline-flex items-center justify-center bg-white p-[10px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- next/image requires images.localPatterns config for this one-off logo */}
                  <img src="/mk-gym-logo.png" alt="MK Gym" className="h-[102px] w-auto" />
                </span>
              ) : (
                <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">
                  MCRAFT
                </span>
              )}
            </Link>
            <div className="flex gap-[38px] max-[980px]:hidden">
              {isMkGym ? (
                <Link href="https://mkcraft.com.pl" className={navLink}>{dict.mkGym.backToMcraft}</Link>
              ) : (
                <>
                  <Link href="/#about" className={navLink}>{dict.nav.about}</Link>
                  <Link href="/#areas" className={navLink}>{dict.nav.areas}</Link>
                  <NavRealizacjeDropdown triggerClass={navLink} dict={dict} />
                  <Link href="/#contact" className={navLink}>{dict.nav.contact}</Link>
                </>
              )}
              <LanguageSwitcher locale={locale} triggerClassName={navLink} />
            </div>
            <MobileNav links={NAV_LINKS} locale={locale} dict={dict} logoImageUrl={isMkGym ? '/mk-gym-logo.png' : undefined} />
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-ink text-light relative overflow-hidden pt-16 pb-[64px]">
        <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
        <div className={`${wrap} relative`}>
          <Link
            href={`/${serviceSlug}`}
            className="inline-flex items-center gap-2 font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-[22px] hover:text-white transition-colors duration-200"
          >
            <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3 rotate-180">
              <path d="M0 6h28M23 1l5 5-5 5" />
            </svg>
            {sp.title ?? serviceSlug}
          </Link>
          <span className="block font-montserrat text-xs font-semibold tracking-[0.28em] uppercase text-accent mb-[18px]">
            {dict.realizacjaPage.eyebrow}
          </span>
          <h1 className="font-light text-[52px] tracking-[0.01em] uppercase text-white max-[980px]:text-[38px] max-[560px]:text-[30px]">
            {item.title}
          </h1>
          <div className="w-16 h-0.5 bg-accent mt-[26px]" />
        </div>
      </header>

      {/* Main: gallery + description */}
      <section className="py-20 bg-cream">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1fr] gap-[56px] items-start max-[980px]:grid-cols-1 max-[980px]:gap-12">
            {/* Left (desktop) / top (mobile): gallery */}
            <div className="min-w-0 overflow-hidden">
              <RealizacjaGaleria images={galleryImages} dict={dict} />
            </div>

            {/* Right (desktop) / below (mobile): description */}
            <div>
              {item.description ? (
                <RichText
                  data={item.description}
                  className="prose-mcraft"
                />
              ) : (
                <p className="text-dark-muted font-light text-base leading-relaxed">
                  {dict.realizacjaPage.noDescription}
                </p>
              )}
            </div>
          </div>

          {additionalGalleryGroups.map((group, i) => {
            // Naprzemienny układ: liczymy główną galerię wyżej jako "pierwszą" (normalny układ),
            // więc pierwsza dodatkowa grupa (i=0) jest "drugą" i ma układ odwrócony, kolejna znów normalny, itd.
            const isReversed = i % 2 === 0
            return (
              <div key={i} className="mt-20 pt-20 border-t border-[#e8e3d9]">
                {group.title && (
                  <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-8">
                    {group.title}
                  </h2>
                )}
                <div className="grid grid-cols-[1fr_1fr] gap-[56px] items-start max-[980px]:grid-cols-1 max-[980px]:gap-12">
                  <div className={`min-w-0 overflow-hidden max-[980px]:order-1 ${isReversed ? 'order-2' : 'order-1'}`}>
                    <RealizacjaGaleria images={group.images} dict={dict} />
                  </div>
                  <div className={`max-[980px]:order-2 ${isReversed ? 'order-1' : 'order-2'}`}>
                    {group.description && (
                      <RichText
                        data={group.description}
                        className="prose-mcraft"
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-2 py-16 text-center">
        <div className={wrap}>
          <h2 className="font-semibold text-2xl uppercase tracking-[0.03em] mb-[22px]">
            {dict.realizacjaPage.ctaSimilarProject}
          </h2>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-6 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.2em] uppercase px-[28px] py-[17px] transition-all duration-[220ms] hover:bg-accent hover:text-ink"
          >
            {dict.subpage.ctaButton}
            <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3">
              <path d="M0 6h28M23 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-3 text-light pt-16 pb-[26px]">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1.2fr] gap-12 items-start max-[768px]:grid-cols-1">
            <div>
              <span className="block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-[#008A58] mb-[18px]">
                {dict.footer.eyebrow}
              </span>
              <h2 className="font-semibold text-[30px] tracking-[0.04em] uppercase text-white mb-[22px]">
                {dict.footer.title}
              </h2>
              <div className="mb-[22px]">
                <div className="font-montserrat font-semibold text-[13px] tracking-[0.08em] text-white mb-[8px]">
                  MCRAFT Michał Macherzyński
                </div>
                <div className="text-[13px] text-light-muted leading-[1.8]">
                  NIP: 5742046939<br />
                  REGON: 388131678
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
                <a href="tel:+48601488318" className="hover:text-light transition-colors duration-200">
                  +48 601-488-318
                </a>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" />
                </svg>
                <a href="mailto:kontakt@poczta-mcraft.pl" className="hover:text-light transition-colors duration-200">
                  kontakt@poczta-mcraft.pl
                </a>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>ul. Żołnierzy Września 36, 42-152 Wilkowiecko</span>
              </div>
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] text-accent flex-none">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
                <a
                  href="https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-light transition-colors duration-200"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="border-l border-white/10 pl-[46px] max-[768px]:border-l-0 max-[768px]:pl-0 max-[768px]:border-t max-[768px]:border-white/10 max-[768px]:pt-[34px] overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=ul.+Żołnierzy+Września+36,+42-152+Wilkowiecko&output=embed&hl=${locale}`}
                className="w-full"
                height="300"
                style={{ border: 0, filter: 'grayscale(1) invert(0.85) contrast(0.9)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={dict.footer.mapsTitle}
              />
            </div>
          </div>

          <div className="border-t border-white/10 mt-[46px] pt-[22px] flex flex-row items-center justify-between gap-4 text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-2">
            <span>© {new Date().getFullYear()} {dict.footer.copyrightSuffix}</span>
            <Link href="/polityka-prywatnosci" className="hover:text-white/60 transition-colors duration-200">
              {dict.footer.privacyPolicy}
            </Link>
            <span>
              {dict.footer.builtBy}{' '}
              <a href="https://studiocodeart.pl" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors duration-200">
                studiocodeart.pl
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
