import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import {
  type Doc,
  migrateAboutSection,
  migrateBioModal,
  migrateCvModal,
  migrateHeroSection,
  migratePortfolio,
  migrateServicePage,
  migrateStatTile,
} from './lib/localize-migration-helpers.js'

async function migrateCollection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  migrateFn: (doc: Doc) => boolean,
): Promise<number> {
  const collection = payload.db.connection.collection(slug)
  const cursor = collection.find({})
  let migratedCount = 0
  for await (const doc of cursor) {
    if (migrateFn(doc as Doc)) {
      await collection.replaceOne({ _id: doc._id }, doc)
      migratedCount++
    }
  }
  return migratedCount
}

async function migrateGlobal(
  payload: Awaited<ReturnType<typeof getPayload>>,
  globalType: string,
  migrateFn: (doc: Doc) => boolean,
): Promise<boolean> {
  const collection = payload.db.connection.collection('globals')
  const doc = await collection.findOne({ globalType })
  if (!doc) return false
  const changed = migrateFn(doc as Doc)
  if (changed) {
    await collection.replaceOne({ _id: doc._id }, doc)
  }
  return changed
}

async function migrate() {
  const payload = await getPayload({ config })

  const servicePagesMigrated = await migrateCollection(payload, 'service-pages', migrateServicePage)
  const portfolioMigrated = await migrateCollection(payload, 'portfolio-projects', migratePortfolio)
  const statTilesMigrated = await migrateCollection(payload, 'stat-tiles', migrateStatTile)
  const heroSectionMigrated = await migrateGlobal(payload, 'hero-section', migrateHeroSection)
  const aboutSectionMigrated = await migrateGlobal(payload, 'about-section', migrateAboutSection)
  const cvModalMigrated = await migrateGlobal(payload, 'cv-modal', migrateCvModal)
  const bioModalMigrated = await migrateGlobal(payload, 'bio-modal', migrateBioModal)

  console.log('Migracja lokalizacji zakonczona:')
  console.log(`  service-pages: ${servicePagesMigrated} dokumentow zmigrowanych`)
  console.log(`  portfolio-projects: ${portfolioMigrated} dokumentow zmigrowanych`)
  console.log(`  stat-tiles: ${statTilesMigrated} dokumentow zmigrowanych`)
  console.log(`  hero-section: ${heroSectionMigrated ? 'zmigrowano' : 'bez zmian'}`)
  console.log(`  about-section: ${aboutSectionMigrated ? 'zmigrowano' : 'bez zmian'}`)
  console.log(`  cv-modal: ${cvModalMigrated ? 'zmigrowano' : 'bez zmian'}`)
  console.log(`  bio-modal: ${bioModalMigrated ? 'zmigrowano' : 'bez zmian'}`)

  process.exit(0)
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
