import type { GlobalConfig } from 'payload'

export const CvModal: GlobalConfig = {
  slug: 'cv-modal',
  label: 'Modal CV (Dowiedz się więcej)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'experience',
      label: 'Doświadczenie zawodowe',
      type: 'array',
      fields: [
        {
          name: 'year',
          label: 'Okres / rok',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Stanowisko',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
        {
          name: 'company',
          label: 'Firma / instytucja',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
      ],
    },
    {
      name: 'qualifications',
      label: 'Kwalifikacje',
      type: 'array',
      fields: [
        {
          name: 'code',
          label: 'Kod / skrót (np. IWE)',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Opis',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
      ],
    },
    {
      name: 'education',
      label: 'Edukacja',
      type: 'array',
      fields: [
        {
          name: 'year',
          label: 'Okres / rok',
          type: 'text',
          required: true,
        },
        {
          name: 'institution',
          label: 'Uczelnia / instytucja',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
        {
          name: 'description',
          label: 'Opis / kierunek',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
      ],
    },
    {
      name: 'additionalQualifications',
      label: 'Dodatkowe kwalifikacje',
      type: 'array',
      fields: [
        {
          name: 'year',
          label: 'Data',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Opis',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
      ],
    },
    {
      name: 'skills',
      label: 'Umiejętności (tekst)',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
    {
      name: 'interests',
      label: 'Zainteresowania i hobby',
      type: 'text',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
    {
      name: 'cvFile',
      label: 'Plik CV (PDF)',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: false,
    },
  ],
}
