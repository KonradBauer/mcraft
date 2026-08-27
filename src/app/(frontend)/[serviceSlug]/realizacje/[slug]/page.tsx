export const instant = false

import { Suspense } from 'react'
import type { CSSProperties } from 'react'
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
import { SubpageFooter } from '@/components/mcraft/SubpageFooter'
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
  'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase py-1.5 relative transition-colors duration-200 text-white/70 hover:text-white'

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

  const page = (
    <>
      {/* Topbar */}
      <div className={`${isMkGym ? 'bg-black' : 'bg-ink'} text-light`}>
        <div className={wrap}>
          <nav className={`flex items-center justify-between ${isMkGym ? 'py-2' : 'py-[30px]'}`}>
            {isMkGym ? (
              <span />
            ) : (
              <Link href="/">
                <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">
                  MCRAFT
                </span>
              </Link>
            )}
            <div className="flex items-center gap-[38px] max-[980px]:hidden">
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
            <MobileNav links={NAV_LINKS} locale={locale} dict={dict} showLogo={!isMkGym} />
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-ink text-light relative overflow-hidden pt-16 pb-[64px]">
        <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
        <div className={`${wrap} relative`}>
          <Link
            href={`/${serviceSlug}`}
            className={`inline-flex items-center gap-2 font-montserrat text-xs font-semibold tracking-[0.2em] uppercase mb-[22px] hover:text-white transition-colors duration-200 ${isMkGym ? 'text-white/70' : 'text-accent'}`}
          >
            <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3 rotate-180">
              <path d="M0 6h28M23 1l5 5-5 5" />
            </svg>
            {sp.title ?? serviceSlug}
          </Link>
          <span className={`block font-montserrat text-xs font-semibold tracking-[0.28em] uppercase mb-[18px] ${isMkGym ? 'text-white' : 'text-accent'}`}>
            {dict.realizacjaPage.eyebrow}
          </span>
          <h1 className="font-light text-[52px] tracking-[0.01em] uppercase text-white max-[980px]:text-[38px] max-[560px]:text-[30px]">
            {item.title}
          </h1>
          <div className={`w-16 h-0.5 mt-[26px] ${isMkGym ? 'bg-white' : 'bg-accent'}`} />
        </div>
      </header>

      {/* Main: gallery + description */}
      <section className={`py-20 ${isMkGym ? '' : 'bg-cream'}`}>
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

      {/* Footer */}
      <SubpageFooter isMkGym={isMkGym} locale={locale} dict={dict} logoImageUrl={isMkGym ? '/mk-gym-logo.png' : undefined} />
    </>
  )

  return isMkGym ? (
    <div
      style={{
        '--color-accent': '#8a8a8a',
        '--color-accent-bright': '#a3a3a3',
        backgroundImage: 'url(/mk-gym-page-bg.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      } as CSSProperties}
    >
      {page}
    </div>
  ) : page
}
