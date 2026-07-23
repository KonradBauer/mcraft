export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'
import { getLocale } from '@/lib/i18n/locale'

export const metadata: Metadata = {
  title: 'Konstrukcje stalowe - prefabrykacja i montaż',
  description: 'Projektowanie i realizacja konstrukcji stalowych: hale przemysłowe, elementy infrastruktury, prefabrykacja w warsztacie, montaż na obiekcie. Michał Macherzyński.',
  alternates: { canonical: 'https://mcraft.com.pl/konstrukcje-stalowe' },
  openGraph: {
    title: 'Konstrukcje stalowe - prefabrykacja i montaż',
    description: 'Konstrukcje przemysłowe i hale, elementy infrastruktury, prefabrykacja w warsztacie, montaż na obiekcie.',
    url: 'https://mcraft.com.pl/konstrukcje-stalowe',
    images: [{ url: 'https://mcraft.com.pl/og-image.png', width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Konstrukcje stalowe',
  description: 'Projektowanie i realizacja konstrukcji stalowych dla przemysłu, budownictwa i infrastruktury - z dbałością o jakość i terminowość.',
  items: [
    { text: 'Konstrukcje przemysłowe i hale' },
    { text: 'Elementy infrastruktury' },
    { text: 'Prefabrykacja w warsztacie' },
    { text: 'Montaż na obiekcie' },
  ],
}

export default async function KonstrukcjeStalowePage() {
  const payload = await getPayload({ config })
  const locale = await getLocale()
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'konstrukcje-stalowe' } },
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
      realizacje={toRealizacjeProps(portfolioDocs, 'konstrukcje-stalowe')}
      locale={locale}
    />
  )
}
