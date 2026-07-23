import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { StatTile } from './collections/StatTile'
import { ServicePage } from './collections/ServicePage'
import { Portfolio } from './collections/Portfolio'
import { HeroSection } from './globals/HeroSection'
import { AboutSection } from './globals/AboutSection'
import { CvModal } from './globals/CvModal'
import { BioModal } from './globals/BioModal'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'dark',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
    },
  },
  collections: [Users, Media, Documents, StatTile, ServicePage, Portfolio],
  globals: [HeroSection, AboutSection, CvModal, BioModal],
  localization: {
    locales: [
      { code: 'pl', label: 'Polski' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'pl',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
