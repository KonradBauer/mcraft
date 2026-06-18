export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'

export const metadata: Metadata = {
  title: 'Konstrukcje stalowe - prefabrykacja i montaz | MCRAFT',
  description: 'Projektowanie i realizacja konstrukcji stalowych: hale przemyslowe, elementy infrastruktury, prefabrykacja w warsztacie, montaz na obiekcie. MCRAFT Michal Macherzynski.',
  alternates: { canonical: 'https://mcraft.pl/konstrukcje-stalowe' },
  openGraph: {
    title: 'Konstrukcje stalowe - prefabrykacja i montaz | MCRAFT',
    description: 'Konstrukcje przemyslowe i hale, elementy infrastruktury, prefabrykacja w warsztacie, montaz na obiekcie.',
    url: 'https://mcraft.pl/konstrukcje-stalowe',
    images: [{ url: 'https://mcraft.pl/opengraph-image', width: 1200, height: 630 }],
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
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'konstrukcje-stalowe' } },
    depth: 1,
    limit: 1,
  })

  return <SubpageLayout {...toSubpageLayoutProps(docs[0], FALLBACK)} />
}
