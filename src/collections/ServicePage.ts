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
      admin: {
        components: {
          RowLabel: '@/components/admin/ScopeItemRowLabel',
        },
      },
      fields: [
        {
          name: 'icon',
          label: 'Ikonka',
          type: 'select',
          defaultValue: 'ShieldCheck',
          options: [
            { label: 'Award',          value: 'Award' },
            { label: 'BadgeCheck',     value: 'BadgeCheck' },
            { label: 'Box',            value: 'Box' },
            { label: 'Briefcase',      value: 'Briefcase' },
            { label: 'Calendar',       value: 'Calendar' },
            { label: 'CheckCircle',    value: 'CheckCircle' },
            { label: 'ClipboardCheck', value: 'ClipboardCheck' },
            { label: 'ClipboardList',  value: 'ClipboardList' },
            { label: 'Clock',          value: 'Clock' },
            { label: 'Cpu',            value: 'Cpu' },
            { label: 'Droplets',       value: 'Droplets' },
            { label: 'Eye',            value: 'Eye' },
            { label: 'Factory',        value: 'Factory' },
            { label: 'FileSearch',     value: 'FileSearch' },
            { label: 'FileText',       value: 'FileText' },
            { label: 'Flame',          value: 'Flame' },
            { label: 'FlaskConical',   value: 'FlaskConical' },
            { label: 'Globe',          value: 'Globe' },
            { label: 'GraduationCap',  value: 'GraduationCap' },
            { label: 'HardHat',        value: 'HardHat' },
            { label: 'Layers',         value: 'Layers' },
            { label: 'Microscope',     value: 'Microscope' },
            { label: 'PenTool',        value: 'PenTool' },
            { label: 'Ruler',          value: 'Ruler' },
            { label: 'Search',         value: 'Search' },
            { label: 'Settings2',      value: 'Settings2' },
            { label: 'ShieldCheck',    value: 'ShieldCheck' },
            { label: 'Star',           value: 'Star' },
            { label: 'Timer',          value: 'Timer' },
            { label: 'Train',          value: 'Train' },
            { label: 'TrendingUp',     value: 'TrendingUp' },
            { label: 'UserCheck',      value: 'UserCheck' },
            { label: 'Users',          value: 'Users' },
            { label: 'Warehouse',      value: 'Warehouse' },
            { label: 'Wrench',         value: 'Wrench' },
            { label: 'Zap',            value: 'Zap' },
          ],
          admin: {
            condition: (data) => data?.slug === 'nadzor-spawalniczy',
            components: {
              Field: '@/components/admin/IconPickerField',
            },
          },
        },
        {
          name: 'text',
          label: 'Tytuł punktu',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Opis punktu (opcjonalny, krótki - widoczny na karcie)',
          type: 'textarea',
          admin: {
            condition: (data) => data?.slug === 'nadzor-spawalniczy',
          },
        },
        {
          name: 'modalDescription',
          label: 'Rozwinięty opis (w oknie modal po kliknięciu)',
          type: 'textarea',
          admin: {
            condition: (data) => data?.slug === 'nadzor-spawalniczy',
            description: 'Jeśli puste, w oknie modal użyty zostanie krótki opis z karty.',
          },
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
      name: 'heroImage',
      label: 'Zdjęcie tła nagłówka (hero)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Tło w sekcji nagłówka podstrony. Jeśli puste — tylko wzór blueprint.',
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
