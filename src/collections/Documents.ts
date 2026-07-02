import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Dokument', plural: 'Dokumenty' },
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
    staticDir: './documents-media',
    mimeTypes: ['application/pdf'],
  },
}
