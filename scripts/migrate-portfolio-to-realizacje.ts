import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { syncRealizacjeForServicePage } from '../src/lib/portfolioToRealizacje.js'

// Tylko mk-gym przechodzi na zagnieżdżoną tablicę realizacje - meble-premium
// i konstrukcje-stalowe zostają na starej kolekcji portfolio-projects.
// (syncRealizacjeForServicePage sam pomija podstrony spoza tej listy)
const PORTFOLIO_SERVICE_SLUGS = ['mk-gym']

async function migrate() {
  const payload = await getPayload({ config })

  for (const slug of PORTFOLIO_SERVICE_SLUGS) {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const servicePage = docs[0]
    if (!servicePage) {
      console.log(`  ${slug}: brak dokumentu service-pages, pomijam`)
      continue
    }

    await syncRealizacjeForServicePage(payload, servicePage.id)
    console.log(`  ${slug}: zsynchronizowano`)
  }

  console.log('Migracja portfolio-projects -> service-pages.realizacje zakonczona.')
  console.log('Stara kolekcja portfolio-projects NIE zostala usunieta (recznie w kolejnym kroku).')
  process.exit(0)
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
