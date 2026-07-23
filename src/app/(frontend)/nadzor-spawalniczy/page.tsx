export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'
import { getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'

export const metadata: Metadata = {
  title: 'Nadzór spawalniczy - IWE / IWI / VT2 / PT2',
  description: 'Kompleksowy nadzór spawalniczy: kwalifikowanie technologii WPS/WPQR, badania nieniszczące VT/PT, dokumentacja jakościowa. Dr inż. Michał Macherzyński IWE/IWI.',
  alternates: { canonical: 'https://mcraft.com.pl/nadzor-spawalniczy' },
  openGraph: {
    title: 'Nadzór spawalniczy - IWE / IWI | Michał Macherzyński',
    description: 'Kwalifikowanie technologii WPS/WPQR, nadzór nad jakością złączy spawanych, badania VT/PT, dokumentacja odbiorowa.',
    url: 'https://mcraft.com.pl/nadzor-spawalniczy',
    images: [{ url: 'https://mcraft.com.pl/og-image.png', width: 1200, height: 630 }],
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
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'nadzor-spawalniczy' } },
    depth: 1,
    limit: 1,
    locale,
  })

  return <SubpageLayout {...toSubpageLayoutProps(docs[0], FALLBACK)} locale={locale} dict={dict} />
}
