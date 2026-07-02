import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'CV (Hero)', plural: 'CV (Hero)' },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Tytuł',
      type: 'text',
    },
  ],
  upload: {
    staticDir: './public/media',
    mimeTypes: ['application/pdf'],
  },
}
