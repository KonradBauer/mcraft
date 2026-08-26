import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { PageFallback } from '@/components/mcraft/PageFallback'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'
import { getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return {
    title: { absolute: dict.meta.mkGym.title },
    description: dict.meta.mkGym.description,
    icons: { icon: '/mk-gym-favicon.png' },
    alternates: { canonical: 'https://mcraft.com.pl/mk-gym' },
    openGraph: {
      title: dict.meta.mkGym.ogTitle,
      description: dict.meta.mkGym.ogDescription,
      url: 'https://mcraft.com.pl/mk-gym',
      images: [{ url: 'https://mcraft.com.pl/og-image.png', width: 1200, height: 630 }],
    },
  }
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'MK Gym',
  description: '',
  items: [],
}

export default function MkGymPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <MkGymPageContent />
    </Suspense>
  )
}

async function MkGymPageContent() {
  // getLocale() (cookies()) musi wykonać się przed getPayload() - Payload przy zimnym
  // starcie połączenia z DB wewnętrznie odwołuje się do zegara, a Next wymaga żeby
  // rozpoznane dynamiczne API (cookies/headers) zadziałało jako pierwsze.
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'mk-gym' } },
    depth: 2,
    limit: 1,
    locale,
  })

  const servicePage = docs[0]

  return (
    <SubpageLayout
      {...toSubpageLayoutProps(servicePage, FALLBACK)}
      realizacje={toRealizacjeProps(servicePage?.realizacje ?? [], 'mk-gym')}
      realizacjeTitle={dict.mkGym.offerTitle}
      locale={locale}
      dict={dict}
      logoHref="https://mkcraft.com.pl"
      navOverride={{ href: 'https://mkcraft.com.pl', label: dict.mkGym.backToMcraft }}
      hideHeroOverlay
      navPaddingClassName="py-2"
      topbarBgClassName="bg-black"
      eyebrowColorClassName="text-white"
      dividerColorClassName="bg-white"
      showTopbarLogo={false}
      footerLogoImageUrl="/mk-gym-logo.png"
      titleLogoImageUrl="/mk-gym-logo.png"
      sectionBackgroundImages={{ 'Specjalizujemy się w hantlach': '/mk-gym-hantle-bg.avif' }}
      accentColor="#8a8a8a"
      accentColorBright="#a3a3a3"
    />
  )
}
