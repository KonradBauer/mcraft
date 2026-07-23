import type { GlobalConfig } from 'payload'

export const AboutSection: GlobalConfig = {
  slug: 'about-section',
  label: 'Sekcja Kim Jestem',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'portraitPhoto',
      label: 'Zdjęcie portretowe',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bioText',
      label: 'Tekst bio (paragraf)',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
  ],
}
