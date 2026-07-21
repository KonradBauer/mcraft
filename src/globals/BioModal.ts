import type { GlobalConfig } from 'payload'

import { stringToLexical } from '../lib/stringToLexical'

export const BioModal: GlobalConfig = {
  slug: 'bio-modal',
  label: 'Modal Życiorys (Więcej o mnie)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sections',
      label: 'Sekcje życiorysu',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Tytuł sekcji',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          label: 'Treść',
          type: 'richText',
          required: true,
          hooks: {
            afterRead: [
              ({ value }: { value?: unknown }) => (typeof value === 'string' ? stringToLexical(value) : value),
            ],
          },
        },
      ],
    },
    {
      name: 'bioFile',
      label: 'Plik życiorysu (PDF)',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
