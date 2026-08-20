import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { sortByOrder, toRealizacjaRow, type Doc } from './lib/portfolio-to-realizacje-helpers.js'

// Tylko mk-gym przechodzi na zagnieżdżoną tablicę realizacje - meble-premium
// i konstrukcje-stalowe zostają na starej kolekcji portfolio-projects.
const PORTFOLIO_SERVICE_SLUGS = ['mk-gym']

async function migrate() {
  const payload = await getPayload({ config })
  const servicePages = payload.db.connection.collection('service-pages')
  const portfolioProjects = payload.db.connection.collection('portfolio-projects')

  for (const slug of PORTFOLIO_SERVICE_SLUGS) {
    const servicePageDoc = await servicePages.findOne({ slug })
    if (!servicePageDoc) {
      console.log(`  ${slug}: brak dokumentu service-pages, pomijam`)
      continue
    }

    const portfolioDocs = (await portfolioProjects
      .find({ servicePage: servicePageDoc._id })
      .toArray()) as Doc[]

    const realizacje = sortByOrder(portfolioDocs).map(toRealizacjaRow)

    await servicePages.updateOne({ _id: servicePageDoc._id }, { $set: { realizacje } })
    console.log(`  ${slug}: ${realizacje.length} realizacji zmigrowanych`)
  }

  console.log('Migracja portfolio-projects -> service-pages.realizacje zakonczona.')
  console.log('Stara kolekcja portfolio-projects NIE zostala usunieta (recznie w kolejnym kroku).')
  process.exit(0)
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
