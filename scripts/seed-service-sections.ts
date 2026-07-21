import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { stringToLexical } from '../src/lib/stringToLexical.js'

const AUDIENCE_ITEMS = [
  { text: stringToLexical('Zakłady produkcyjne') },
  { text: stringToLexical('Firmy budowlane i wykonawcy') },
  { text: stringToLexical('Inwestorzy prywatni') },
  { text: stringToLexical('Projektanci i architekci') },
]

const REQUEST_PREP_ITEMS = [
  { text: stringToLexical('rodzaj konstrukcji') },
  { text: stringToLexical('rysunki lub szkice') },
  { text: stringToLexical('podstawowe wymiary') },
  { text: stringToLexical('przewidywane obciążenia') },
  { text: stringToLexical('miejsce użytkowania: wewnątrz czy na zewnątrz') },
  { text: stringToLexical('wymagany materiał') },
  { text: stringToLexical('sposób zabezpieczenia powierzchni') },
  { text: stringToLexical('miejsce dostawy') },
  { text: stringToLexical('informacja, czy potrzebny jest montaż') },
  { text: stringToLexical('planowany termin') },
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
