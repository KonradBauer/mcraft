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
    title: dict.meta.mkGym.title,
    description: dict.meta.mkGym.description,
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

export default async function MkGymPage() {
  const payload = await getPayload({ config })
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'mk-gym' } },
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
      realizacje={toRealizacjeProps(portfolioDocs, 'mk-gym')}
      locale={locale}
      dict={dict}
      logoImageUrl="/mk-gym-logo.png"
      logoHref="https://mcraft.com.pl"
      navOverride={{ href: 'https://mcraft.com.pl', label: dict.mkGym.backToMcraft }}
    />
  )
}
