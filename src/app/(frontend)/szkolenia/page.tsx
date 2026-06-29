export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NadzorLayout } from '@/components/mcraft/NadzorLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'

export const metadata: Metadata = {
  title: 'Szkolenia spawalnicze - IWE / IWI | MCRAFT',
  description: 'Szkolenia spawalnicze prowadzone przez Dr inż. Michała Macherzyńskiego - IWE/IWI. Kurs na uprawnienia spawalnicze, szkolenia z nadzoru i technologii spawania.',
  alternates: { canonical: 'https://mcraft.pl/szkolenia' },
  openGraph: {
    title: 'Szkolenia spawalnicze - IWE / IWI | MCRAFT Michał Macherzyński',
    description: 'Szkolenia spawalnicze, kursy na uprawnienia, nadzór i technologia spawania.',
    url: 'https://mcraft.pl/szkolenia',
    images: [{ url: 'https://mcraft.pl/opengraph-image', width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Szkolenia',
  description: 'Szkolenia spawalnicze prowadzone przez certyfikowanego inżyniera IWE/IWI - od kursów na uprawnienia po szkolenia specjalistyczne z technologii spawania.',
  items: [
    { text: 'Szkolenia z technologii spawania' },
    { text: 'Przygotowanie do uprawnień spawalniczych' },
    { text: 'Kursy z nadzoru spawalniczego' },
    { text: 'Szkolenia z badań nieniszczących' },
  ],
}

export default async function SzkoleniaPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'szkolenia' } },
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
    <NadzorLayout
      {...toSubpageLayoutProps(servicePage, FALLBACK)}
      realizacje={toRealizacjeProps(portfolioDocs, 'szkolenia')}
    />
  )
}
