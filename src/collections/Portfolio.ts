import type { CollectionConfig } from 'payload'

import { stringToLexical } from '../lib/stringToLexical'
import { syncRealizacjeForServicePage } from '../lib/portfolioToRealizacje'

function relationshipId(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) return String((value as { id: unknown }).id)
  return undefined
}

export const Portfolio: CollectionConfig = {
  slug: 'portfolio-projects',
  labels: {
    singular: 'Realizacja',
    plural: 'Realizacje (Meble, Konstrukcje i MK Gym)',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'servicePage', 'order'],
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const currentServicePage = relationshipId(doc.servicePage)
        if (currentServicePage) await syncRealizacjeForServicePage(req.payload, currentServicePage)

        const previousServicePage = relationshipId(previousDoc?.servicePage)
        if (previousServicePage && previousServicePage !== currentServicePage) {
          await syncRealizacjeForServicePage(req.payload, previousServicePage)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const servicePage = relationshipId(doc.servicePage)
        if (servicePage) await syncRealizacjeForServicePage(req.payload, servicePage)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Tytuł realizacji',
      type: 'text',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
    {
      name: 'slug',
      label: 'Slug URL',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
      admin: {
        description: 'Używany w adresie URL. Małe litery, myślniki zamiast spacji. Nie zmieniaj po opublikowaniu. Np. stol-loftowy-debowy. Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola) - jeśli puste, używany jest polski slug.',
      },
    },
    {
      name: 'servicePage',
      label: 'Obszar (Meble lub Konstrukcje)',
      type: 'relationship',
      relationTo: 'service-pages',
      required: true,
      filterOptions: {
        slug: { in: ['meble-premium', 'konstrukcje-stalowe', 'mk-gym'] },
      },
      admin: {
        description: 'Tylko Meble premium, Konstrukcje stalowe lub MK Gym',
      },
    },
    {
      name: 'description',
      label: 'Opis realizacji',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
      hooks: {
        afterRead: [
          ({ value }) => {
            if (typeof value === 'string') return stringToLexical(value)
            return value
          },
        ],
      },
    },
    {
      name: 'thumbnail',
      label: 'Zdjęcie okładki (kafelek)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bulkUploadImages',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/BulkImageUpload',
        },
      },
    },
    {
      name: 'images',
      label: 'Zdjęcia galerii',
      type: 'array',
      fields: [
        {
          name: 'image',
          label: 'Zdjęcie',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          label: 'Opis zdjęcia (dostępność)',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
      ],
    },
    {
      name: 'additionalGalleries',
      label: 'Dodatkowe galerie z opisem',
      type: 'array',
      admin: {
        description: 'Osobne grupy zdjęć z własnym tytułem i opisem - np. dla akcesoriów, wariantów itp. Renderowane pod głównym opisem i galerią powyżej, w kolejności jak tutaj. Dowolna liczba grup.',
        components: {
          RowLabel: '@/components/admin/AdditionalSectionRowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          label: 'Tytuł grupy (np. Akcesoria)',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
        {
          name: 'description',
          label: 'Opis grupy',
          type: 'richText',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
          hooks: {
            afterRead: [
              ({ value }) => {
                if (typeof value === 'string') return stringToLexical(value)
                return value
              },
            ],
          },
        },
        {
          name: 'images',
          label: 'Zdjęcia grupy',
          type: 'array',
          fields: [
            {
              name: 'image',
              label: 'Zdjęcie',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              label: 'Opis zdjęcia (dostępność)',
              type: 'text',
              localized: true,
              admin: {
                description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'order',
      label: 'Kolejność wyświetlania (mniejsza = wyżej)',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
