import type { CollectionConfig } from 'payload'

export const ServicePage: CollectionConfig = {
  slug: 'service-pages',
  labels: {
    singular: 'Podstrona',
    plural: 'Podstrony usługowe',
  },
  access: {
    read: () => true,
    create: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    hidden: true,
  },
  fields: [
    {
      name: 'slug',
      label: 'Slug URL',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Hardcoded - nie zmieniaj.',
      },
    },
    {
      name: 'eyebrow',
      label: 'Nadtytuł (mały tekst nad tytułem)',
      type: 'text',
    },
    {
      name: 'title',
      label: 'Tytuł strony',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Opis (lead pod tytułem)',
      type: 'textarea',
    },
    {
      name: 'scopeItems',
      label: 'Zakres usług (lista)',
      type: 'array',
      fields: [
        {
          name: 'text',
          label: 'Punkt zakresu',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'mainImage',
      label: 'Główne zdjęcie (prawa kolumna)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'galleryImages',
      label: 'Galeria realizacji',
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
          label: 'Opis zdjęcia (dla dostępności)',
          type: 'text',
        },
      ],
    },
    {
      name: 'thumbnailTitle',
      label: 'Tytuł kafelka na stronie głównej',
      type: 'text',
      admin: {
        description: 'Tekst widoczny w sekcji "Obszary działalności" na stronie głównej',
      },
    },
    {
      name: 'thumbnailImage',
      label: 'Zdjęcie kafelka na stronie głównej (opcjonalne)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Jeśli puste — wyświetlana jest ikona SVG',
      },
    },
  ],
}
