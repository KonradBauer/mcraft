import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'

export const metadata = {
  title: 'MCRAFT — Nadzór spawalniczy',
  description: 'Kompleksowy nadzór nad procesami spawalniczymi zgodnie z normami i wymaganiami jakości.',
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Nadzór spawalniczy',
  description: 'Kompleksowy nadzór nad procesami spawalniczymi zgodnie z normami i wymaganiami jakości — od kwalifikowania technologii po dokumentację odbiorową.',
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

  return <SubpageLayout {...toSubpageLayoutProps(docs[0], FALLBACK)} />
}
