import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HomeContent } from '@/components/mcraft/HomeContent'
import { PageFallback } from '@/components/mcraft/PageFallback'
import { getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'

export default function HomePage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HomePageContent />
    </Suspense>
  )
}

async function HomePageContent() {
  // getLocale() (cookies()) musi wykonać się przed getPayload() - Payload przy zimnym
  // starcie połączenia z DB wewnętrznie odwołuje się do zegara, a Next wymaga żeby
  // rozpoznane dynamiczne API (cookies/headers) zadziałało jako pierwsze.
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const payload = await getPayload({ config })

  const [hero, about, cvModal, bioModal, tilesResult, areasResult] = await Promise.all([
    payload.findGlobal({ slug: 'hero-section', depth: 1, locale, fallbackLocale: false }),
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
      dict={dict}
    />
  )
}
