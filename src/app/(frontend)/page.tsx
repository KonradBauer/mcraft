export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import config from '@payload-config'
import { HomeContent } from '@/components/mcraft/HomeContent'
import { getLocale } from '@/lib/i18n/locale'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const locale = await getLocale()

  const [hero, about, cvModal, bioModal, tilesResult, areasResult] = await Promise.all([
    payload.findGlobal({ slug: 'hero-section', depth: 1, locale }),
    payload.findGlobal({ slug: 'about-section', depth: 1, locale }),
    payload.findGlobal({ slug: 'cv-modal', depth: 1, locale }),
    payload.findGlobal({ slug: 'bio-modal', depth: 1, locale }),
    payload.find({ collection: 'stat-tiles', sort: 'order', limit: 100, depth: 0, locale }),
    payload.find({ collection: 'service-pages', depth: 1, limit: 10, locale }),
  ])

  return (
    <HomeContent
      hero={hero}
      about={about}
      cvModal={cvModal}
      bioModal={bioModal}
      tiles={tilesResult.docs}
      areas={areasResult.docs}
      locale={locale}
    />
  )
}
