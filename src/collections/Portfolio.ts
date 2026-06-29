import type { CollectionConfig } from 'payload'

function stringToLexical(text: string) {
  const paragraphs = text.split('\n').filter((line) => line.trim())
  return {
    root: {
      type: 'root',
      children: paragraphs.length > 0
        ? paragraphs.map((line) => ({
            type: 'paragraph',
            children: [{ type: 'text', text: line, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          }))
        : [{ type: 'paragraph', children: [], direction: null, format: '', indent: 0, textFormat: 0, textStyle: '', version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

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
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug URL',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Używany w adresie URL. Małe litery, myślniki zamiast spacji. Nie zmieniaj po opublikowaniu. Np. stol-loftowy-debowy',
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
