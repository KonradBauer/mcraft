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
          required: true,
        },
        {
          name: 'company',
          label: 'Firma / instytucja',
          type: 'text',
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
          required: true,
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
          required: true,
        },
        {
          name: 'description',
          label: 'Opis / kierunek',
          type: 'text',
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
          required: true,
        },
      ],
    },
    {
      name: 'skills',
      label: 'Umiejętności (tekst)',
      type: 'textarea',
    },
    {
      name: 'interests',
      label: 'Zainteresowania i hobby',
      type: 'text',
    },
    {
      name: 'cvFile',
      label: 'Plik CV (PDF)',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
