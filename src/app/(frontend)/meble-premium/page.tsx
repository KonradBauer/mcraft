export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'

export const metadata: Metadata = {
  title: 'Meble stalowe premium - loft i industrial | MCRAFT',
  description: 'Unikalne meble stalowe i loftowe tworzone z dbałością o detal: projekty autorskie na zamowienie, laczenie stali z drewnem i szklem, wykonczenie premium.',
  alternates: { canonical: 'https://mcraft.pl/meble-premium' },
  openGraph: {
    title: 'Meble stalowe premium - loft i industrial | MCRAFT',
    description: 'Meble loftowe i industrialne, projekty autorskie na zamowienie, laczenie stali z drewnem i szklem, wykonczenie premium.',
    url: 'https://mcraft.pl/meble-premium',
    images: [{ url: 'https://mcraft.pl/opengraph-image', width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Meble premium',
  description: 'Unikalne meble stalowe i loftowe tworzone z dbałością o detal - projekty autorskie i realizacje na zamówienie.',
  items: [
    { text: 'Meble loftowe i industrialne' },
    { text: 'Projekty autorskie na zamówienie' },
    { text: 'Łączenie stali z drewnem i szkłem' },
    { text: 'Wykończenie premium' },
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

  return <SubpageLayout {...toSubpageLayoutProps(docs[0], FALLBACK)} />
}
