export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import config from '@payload-config'
import { HomeContent } from '@/components/mcraft/HomeContent'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [hero, about, cvModal, bioModal, tilesResult, areasResult] = await Promise.all([
    payload.findGlobal({ slug: 'hero-section', depth: 1 }),
    payload.findGlobal({ slug: 'about-section', depth: 1 }),
    payload.findGlobal({ slug: 'cv-modal', depth: 1 }),
    payload.findGlobal({ slug: 'bio-modal', depth: 1 }),
    payload.find({ collection: 'stat-tiles', sort: 'order', limit: 100, depth: 0 }),
    payload.find({ collection: 'service-pages', depth: 1, limit: 10 }),
  ])

  return (
    <HomeContent
      hero={hero}
      about={about}
      cvModal={cvModal}
      bioModal={bioModal}
      tiles={tilesResult.docs}
      areas={areasResult.docs}
    />
  )
}
