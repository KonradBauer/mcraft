import type { CollectionConfig } from 'payload'

import { stringToLexical } from '../lib/stringToLexical'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio-projects',
  labels: {
    singular: 'Realizacja',
    plural: 'Realizacje (Meble i Konstrukcje)',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'servicePage', 'order'],
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
        slug: { in: ['meble-premium', 'konstrukcje-stalowe'] },
      },
      admin: {
        description: 'Tylko Meble premium lub Konstrukcje stalowe',
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
      name: 'order',
      label: 'Kolejność wyświetlania (mniejsza = wyżej)',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
