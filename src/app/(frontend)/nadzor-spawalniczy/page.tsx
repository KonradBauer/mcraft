export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NadzorLayout } from '@/components/mcraft/NadzorLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'

export const metadata: Metadata = {
  title: 'Nadzor spawalniczy - IWE / IWI / VT2 / PT2 | MCRAFT',
  description: 'Kompleksowy nadzor spawalniczy: kwalifikowanie technologii WPS/WPQR, badania nieniszczace VT/PT, dokumentacja jakosciowa. Dr inz. Michal Macherzynski IWE/IWI.',
  alternates: { canonical: 'https://mcraft.pl/nadzor-spawalniczy' },
  openGraph: {
    title: 'Nadzor spawalniczy - IWE / IWI | MCRAFT Michal Macherzynski',
    description: 'Kwalifikowanie technologii WPS/WPQR, nadzor nad jakoscia zlacz spawanych, badania VT/PT, dokumentacja odbiorowa.',
    url: 'https://mcraft.pl/nadzor-spawalniczy',
    images: [{ url: 'https://mcraft.pl/opengraph-image', width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Nadzór spawalniczy',
  description: 'Kompleksowy nadzór nad procesami spawalniczymi zgodnie z normami i wymaganiami jakości - od kwalifikowania technologii po dokumentację odbiorową.',
  items: [
    { text: 'Kwalifikowanie technologii spawania (WPS / WPQR)' },
    { text: 'Nadzór nad jakością złączy spawanych' },
    { text: 'Badania nieniszczące VT / PT' },
    { text: 'Dokumentacja jakościowa i odbiorowa' },
  ],
}

export default async function NadzorSpawalniczyPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'nadzor-spawalniczy' } },
    depth: 1,
    limit: 1,
  })

  return <NadzorLayout {...toSubpageLayoutProps(docs[0], FALLBACK)} />
}
