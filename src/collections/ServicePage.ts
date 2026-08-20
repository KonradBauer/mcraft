import type { CollectionConfig } from 'payload'

import { BULLET_STYLE_OPTIONS, DEFAULT_BULLET_STYLE } from '../lib/bulletStyles'
import { stringToLexical } from '../lib/stringToLexical'

const bulletStyleField = (name: string, label: string) => ({
  name,
  label,
  type: 'select' as const,
  defaultValue: DEFAULT_BULLET_STYLE,
  options: BULLET_STYLE_OPTIONS.map(({ value, label: optionLabel }) => ({ value, label: optionLabel })),
  admin: {
    components: {
      Field: '@/components/admin/BulletStylePickerField',
    },
  },
})

const richTextItemField = {
  name: 'text' as const,
  label: 'Treść punktu',
  type: 'richText' as const,
  localized: true,
  hooks: {
    afterRead: [
      ({ value }: { value?: unknown }) => (typeof value === 'string' ? stringToLexical(value) : value),
    ],
  },
}

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
      name: 'visibleOnHomepage',
      label: 'Widoczne na stronie głównej',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Odznacz, żeby tymczasowo ukryć tę sekcję w obszarach działalności na stronie głównej. Podstrona i dane w panelu pozostają bez zmian.',
        condition: (data) => data?.slug !== 'mk-gym',
      },
    },
    {
      name: 'eyebrow',
      label: 'Nadtytuł (mały tekst nad tytułem)',
      type: 'text',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
    {
      name: 'title',
      label: 'Tytuł strony',
      type: 'text',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
    {
      name: 'description',
      label: 'Opis (lead pod tytułem)',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
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
            { label: 'Barbell',        value: 'Barbell' },
            { label: 'Box',            value: 'Box' },
            { label: 'Briefcase',      value: 'Briefcase' },
            { label: 'Calendar',       value: 'Calendar' },
            { label: 'CheckCircle',    value: 'CheckCircle' },
            { label: 'ClipboardCheck', value: 'ClipboardCheck' },
            { label: 'ClipboardList',  value: 'ClipboardList' },
            { label: 'Clock',          value: 'Clock' },
            { label: 'Cpu',            value: 'Cpu' },
            { label: 'Droplets',       value: 'Droplets' },
            { label: 'Dumbbell',       value: 'Dumbbell' },
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
            { label: 'Rows3',          value: 'Rows3' },
            { label: 'Ruler',          value: 'Ruler' },
            { label: 'Search',         value: 'Search' },
            { label: 'Settings2',      value: 'Settings2' },
            { label: 'ShieldCheck',    value: 'ShieldCheck' },
            { label: 'SlidersHorizontal', value: 'SlidersHorizontal' },
            { label: 'Star',           value: 'Star' },
            { label: 'Timer',          value: 'Timer' },
            { label: 'Train',          value: 'Train' },
            { label: 'TrendingUp',     value: 'TrendingUp' },
            { label: 'Truck',          value: 'Truck' },
            { label: 'UserCheck',      value: 'UserCheck' },
            { label: 'Users',          value: 'Users' },
            { label: 'Warehouse',      value: 'Warehouse' },
            { label: 'Weight',         value: 'Weight' },
            { label: 'Wrench',         value: 'Wrench' },
            { label: 'Zap',            value: 'Zap' },
          ],
          admin: {
            components: {
              Field: '@/components/admin/IconPickerField',
            },
          },
        },
        {
          name: 'text',
          label: 'Tytuł punktu',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
        {
          name: 'description',
          label: 'Opis punktu (opcjonalny, krótki - widoczny na karcie)',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
        {
          name: 'modalDescription',
          label: 'Rozwinięty opis (w oknie modal po kliknięciu)',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Jeśli puste, w oknie modal użyty zostanie krótki opis z karty. Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
      ],
    },
    {
      name: 'hideScopeSection',
      label: 'Ukryj sekcję "Zakres" na podstronie',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Zaznacz, żeby ukryć sekcję Zakres na podstronie bez kasowania listy powyżej. Dane pozostają zapisane w panelu.',
      },
    },
    {
      name: 'audienceTitle',
      label: 'Tytuł sekcji "Dla kogo?"',
      type: 'text',
      defaultValue: 'Dla kogo?',
      localized: true,
      admin: {
        description: 'Renderowana jako pierwsza sekcja treści, przed Zakresem. Puste punkty listy - sekcja się nie wyświetla. Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
    bulletStyleField('audienceBulletStyle', 'Styl punktora listy "Dla kogo?"'),
    {
      name: 'audienceItems',
      label: 'Punkty listy "Dla kogo?"',
      type: 'array',
      admin: {
        components: {
          RowLabel: '@/components/admin/RichTextItemRowLabel',
        },
      },
      fields: [richTextItemField],
    },
    {
      name: 'additionalSections',
      label: 'Dodatkowe sekcje (tytuł + lista)',
      type: 'array',
      admin: {
        description: 'Dowolna liczba dodatkowych sekcji treści, renderowanych między Zakresem a Realizacjami.',
        components: {
          RowLabel: '@/components/admin/AdditionalSectionRowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          label: 'Tytuł sekcji',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
        bulletStyleField('bulletStyle', 'Styl punktora'),
        {
          name: 'items',
          label: 'Punkty listy',
          type: 'array',
          admin: {
            components: {
              RowLabel: '@/components/admin/RichTextItemRowLabel',
            },
          },
          fields: [richTextItemField],
        },
        {
          name: 'renderAfterRealizacje',
          label: 'Wyświetl po sekcji Realizacje (np. dla FAQ)',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Domyślnie sekcja renderuje się między Zakresem a Realizacjami. Zaznacz, żeby przenieść ją niżej, między Realizacje a sekcję kontaktową.',
          },
        },
      ],
    },
    {
      name: 'realizacje',
      label: 'Realizacje',
      type: 'array',
      admin: {
        description: 'Realizacje wyświetlane w siatce na tej podstronie, w kolejności jak tutaj. Przeciągnij za uchwyt żeby zmienić kolejność.',
        components: {
          RowLabel: '@/components/admin/RealizacjaRowLabel',
        },
        condition: (data) => data?.slug === 'mk-gym',
      },
      fields: [
        {
          name: 'title',
          label: 'Tytuł realizacji',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
        },
        {
          name: 'slug',
          label: 'Slug URL',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Używany w adresie URL. Małe litery, myślniki zamiast spacji. Nie zmieniaj po opublikowaniu. Np. stol-loftowy-debowy. Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola) - jeśli puste, używany jest polski slug.',
          },
          validate: (value: string | null | undefined, { data }: { data?: { realizacje?: { slug?: string | null }[] } }) => {
            if (!value) return true
            const duplicates = (data?.realizacje ?? []).filter((r) => r.slug === value).length
            return duplicates > 1 ? 'Ten slug jest już użyty w innej realizacji tej podstrony - musi być unikalny.' : true
          },
        },
        {
          name: 'description',
          label: 'Opis realizacji',
          type: 'richText',
          localized: true,
          admin: {
            description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
          },
          hooks: {
            afterRead: [
              ({ value }: { value?: unknown }) => (typeof value === 'string' ? stringToLexical(value) : value),
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
              localized: true,
              admin: {
                description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
              },
            },
          ],
        },
        {
          name: 'additionalGalleries',
          label: 'Dodatkowe galerie z opisem',
          type: 'array',
          admin: {
            description: 'Osobne grupy zdjęć z własnym tytułem i opisem - np. dla akcesoriów, wariantów itp. Renderowane pod głównym opisem i galerią powyżej, w kolejności jak tutaj. Dowolna liczba grup.',
            components: {
              RowLabel: '@/components/admin/AdditionalSectionRowLabel',
            },
          },
          fields: [
            {
              name: 'title',
              label: 'Tytuł grupy (np. Akcesoria)',
              type: 'text',
              localized: true,
              admin: {
                description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
              },
            },
            {
              name: 'description',
              label: 'Opis grupy',
              type: 'richText',
              localized: true,
              admin: {
                description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
              },
              hooks: {
                afterRead: [
                  ({ value }: { value?: unknown }) => (typeof value === 'string' ? stringToLexical(value) : value),
                ],
              },
            },
            {
              name: 'images',
              label: 'Zdjęcia grupy',
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
                  localized: true,
                  admin: {
                    description: 'Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'ctaHeader',
      label: 'Nagłówek sekcji CTA (na dole strony)',
      type: 'text',
      defaultValue: 'Zainteresowany współpracą?',
      localized: true,
      admin: {
        description: 'Tekst nad przyciskiem "Skontaktuj się" na dole podstrony. Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
      },
    },
    {
      name: 'thumbnailTitle',
      label: 'Tytuł kafelka na stronie głównej',
      type: 'text',
      localized: true,
      admin: {
        description: 'Tekst widoczny w sekcji "Obszary działalności" na stronie głównej. Pamiętaj o aktualizacji tłumaczenia angielskiego (zakładka EN w edytorze pola).',
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
        condition: (data) => data?.slug !== 'mk-gym',
      },
    },
  ],
}
