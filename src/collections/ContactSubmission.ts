import type { CollectionConfig } from 'payload'

export const ContactSubmission: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Zgłoszenie kontaktowe',
    plural: 'Zgłoszenia kontaktowe',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Imię i nazwisko',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'text',
    },
    {
      name: 'message',
      label: 'Wiadomość',
      type: 'textarea',
      required: true,
    },
  ],
  timestamps: true,
}
