export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'
import { getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return {
    title: dict.meta.meblePremium.title,
    description: dict.meta.meblePremium.description,
    alternates: { canonical: 'https://mcraft.com.pl/meble-premium' },
    openGraph: {
      title: dict.meta.meblePremium.ogTitle,
      description: dict.meta.meblePremium.ogDescription,
      url: 'https://mcraft.com.pl/meble-premium',
      images: [{ url: 'https://mcraft.com.pl/og-image.png', width: 1200, height: 630 }],
    },
  }
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Meble premium',
  description: 'Unikalne meble stalowe i loftowe tworzone z dbałością o detal - projekty autorskie i realizacje na zamówienie.',
  items: [
    { text: 'Autorskie meble premium' },
    { text: 'Realizacje indywidualne na zamówienie' },
    { text: 'Stal, kamień, drewno i szkło' },
    { text: 'Konstrukcje wykonywane ręcznie' },
    { text: 'Detale i wykończenia klasy premium' },
  ],
}

export default async function MeblePremiumPage() {
  const payload = await getPayload({ config })
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'meble-premium' } },
    depth: 1,
    limit: 1,
    locale,
  })

  const servicePage = docs[0]
  const portfolioDocs = servicePage
    ? (
        await payload.find({
          collection: 'portfolio-projects',
          where: { servicePage: { equals: servicePage.id } },
          sort: 'order',
          depth: 1,
          limit: 100,
          locale,
        })
      ).docs
    : []

  return (
    <SubpageLayout
      {...toSubpageLayoutProps(servicePage, FALLBACK)}
      realizacje={toRealizacjeProps(portfolioDocs, 'meble-premium')}
      locale={locale}
      dict={dict}
    />
  )
}
