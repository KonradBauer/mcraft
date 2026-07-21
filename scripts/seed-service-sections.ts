import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const AUDIENCE_ITEMS = [
  { text: 'Zakłady produkcyjne' },
  { text: 'Firmy budowlane i wykonawcy' },
  { text: 'Inwestorzy prywatni' },
  { text: 'Projektanci i architekci' },
]

const REQUEST_PREP_ITEMS = [
  { text: 'rodzaj konstrukcji' },
  { text: 'rysunki lub szkice' },
  { text: 'podstawowe wymiary' },
  { text: 'przewidywane obciążenia' },
  { text: 'miejsce użytkowania: wewnątrz czy na zewnątrz' },
  { text: 'wymagany materiał' },
  { text: 'sposób zabezpieczenia powierzchni' },
  { text: 'miejsce dostawy' },
  { text: 'informacja, czy potrzebny jest montaż' },
  { text: 'planowany termin' },
]

async function main() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'konstrukcje-stalowe' } },
    limit: 1,
  })

  const page = docs[0]
  if (!page) {
    console.log('Dokument konstrukcje-stalowe nie istnieje - uruchom najpierw /api/seed')
    return
  }

  await payload.update({
    collection: 'service-pages',
    id: page.id,
    data: {
      audienceTitle: 'Dla kogo?',
      audienceItems: AUDIENCE_ITEMS,
      additionalSections: [
        { title: 'Jak przygotować zapytanie?', items: REQUEST_PREP_ITEMS },
      ],
    },
  })

  console.log('Zaktualizowano konstrukcje-stalowe: audienceItems + additionalSections (scopeItems nietknięte)')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
