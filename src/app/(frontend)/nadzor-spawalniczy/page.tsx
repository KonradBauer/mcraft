export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'
import { getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return {
    title: dict.meta.nadzorSpawalniczy.title,
    description: dict.meta.nadzorSpawalniczy.description,
    alternates: { canonical: 'https://mcraft.com.pl/nadzor-spawalniczy' },
    openGraph: {
      title: dict.meta.nadzorSpawalniczy.ogTitle,
      description: dict.meta.nadzorSpawalniczy.ogDescription,
      url: 'https://mcraft.com.pl/nadzor-spawalniczy',
      images: [{ url: 'https://mcraft.com.pl/og-image.png', width: 1200, height: 630 }],
    },
  }
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
