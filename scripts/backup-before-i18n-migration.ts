import 'dotenv/config'
import { writeFileSync } from 'fs'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const BACKUP_DIR =
  'C:/Users/Sakiro/AppData/Local/Temp/claude/C--dev-mcraft/cdbb25c6-1427-4611-a558-526ce9335ccb/scratchpad'

async function backup() {
  const payload = await getPayload({ config })

  const collections = ['service-pages', 'portfolio-projects', 'stat-tiles', 'globals']
  for (const name of collections) {
    const docs = await payload.db.connection.collection(name).find({}).toArray()
    writeFileSync(`${BACKUP_DIR}/backup-${name}.json`, JSON.stringify(docs, null, 2))
    console.log(`${name}: ${docs.length} dokumentow zapisanych`)
  }

  process.exit(0)
}

backup().catch((err) => {
  console.error(err)
  process.exit(1)
})
