export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'

export const metadata: Metadata = {
  title: 'Meble stalowe premium - loft i industrial',
  description: 'Unikalne meble stalowe i loftowe tworzone z dbałością o detal: projekty autorskie na zamówienie, łączenie stali z drewnem i szkłem, wykończenie premium.',
  alternates: { canonical: 'https://mcraft.com.pl/meble-premium' },
  openGraph: {
    title: 'Meble stalowe premium - loft i industrial',
    description: 'Meble loftowe i industrialne, projekty autorskie na zamówienie, łączenie stali z drewnem i szkłem, wykończenie premium.',
    url: 'https://mcraft.com.pl/meble-premium',
    images: [{ url: 'https://mcraft.com.pl/og-image.png', width: 1200, height: 630 }],
  },
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
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'meble-premium' } },
    depth: 1,
    limit: 1,
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
        })
      ).docs
    : []

  return (
    <SubpageLayout
      {...toSubpageLayoutProps(servicePage, FALLBACK)}
      realizacje={toRealizacjeProps(portfolioDocs, 'meble-premium')}
    />
  )
}
