import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps } from '@/lib/servicePageData'

export const metadata = {
  title: 'MCRAFT — Konstrukcje stalowe',
  description: 'Projektowanie i realizacja konstrukcji stalowych dla przemysłu, budownictwa i infrastruktury.',
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Konstrukcje stalowe',
  description: 'Projektowanie i realizacja konstrukcji stalowych dla przemysłu, budownictwa i infrastruktury — z dbałością o jakość i terminowość.',
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
