import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'

export const metadata = {
  title: 'MCRAFT — Meble premium',
  description: 'Unikalne meble stalowe i loftowe tworzone z dbałością o detal i najwyższą jakość.',
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Meble premium',
  description: 'Unikalne meble stalowe i loftowe tworzone z dbałością o detal i najwyższą jakość — projekty autorskie i realizacje na zamówienie.',
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
