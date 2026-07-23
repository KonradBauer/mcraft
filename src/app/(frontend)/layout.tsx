import type { Metadata } from 'next'
import { Barlow, Great_Vibes, Montserrat } from 'next/font/google'
import Script from 'next/script'
import React from 'react'
import { PageLoader } from '@/components/mcraft/PageLoader'
import { getLocale, type Locale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'
import './styles.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const barlow = Barlow({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
  weight: ['400'],
})

const siteUrl = 'https://mcraft.com.pl'
const ogImage = `${siteUrl}/og-image.png`

const OG_LOCALE: Record<Locale, string> = { pl: 'pl_PL', en: 'en_US' }

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.site.title,
      template: '%s | MCRAFT',
    },
    description: dict.meta.site.description,
    keywords: ['inżynier spawalnik', 'nadzór spawalniczy', 'IWE', 'IWI', 'spawalnictwo', 'konstrukcje stalowe', 'meble stalowe', 'MCRAFT', 'Macherzyński'],
    authors: [{ name: 'Michał Macherzyński', url: siteUrl }],
    creator: 'Michał Macherzyński',
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: siteUrl },
    icons: { icon: '/favicon.png' },
    openGraph: {
      title: dict.meta.site.ogTitle,
      description: dict.meta.site.ogDescription,
      url: siteUrl,
      siteName: 'MCRAFT',
      locale: OG_LOCALE[locale],
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'MCRAFT - Dr inż. Michał Macherzyński' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.site.ogTitle,
      description: dict.meta.site.ogDescription,
      images: [ogImage],
    },
  }
}

function buildSchemaOrg(dict: Awaited<ReturnType<typeof getDictionary>>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${siteUrl}/#business`,
        name: 'MCRAFT Michał Macherzyński',
        legalName: 'MCRAFT Michał Macherzyński',
        description: dict.schemaOrg.businessDescription,
        url: siteUrl,
        telephone: '+48601488318',
        email: 'kontakt@poczta-mcraft.pl',
        taxID: '5742046939',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Żołnierzy Września 36',
          addressLocality: 'Wilkowiecko',
          postalCode: '42-152',
          addressCountry: 'PL',
          addressRegion: 'śląskie',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 50.892, longitude: 18.942 },
        areaServed: { '@type': 'Country', name: 'PL' },
        sameAs: ['https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/'],
        founder: { '@id': `${siteUrl}/#person` },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Usługi spawalnicze i metalowe',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: dict.areas.names.nadzorSpawalniczy, url: `${siteUrl}/nadzor-spawalniczy` } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: dict.areas.names.konstrukcjeStalowe, url: `${siteUrl}/konstrukcje-stalowe` } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: dict.areas.names.meblePremium, url: `${siteUrl}/meble-premium` } },
          ],
        },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Michał Macherzyński',
        honorificPrefix: 'Dr inż.',
        jobTitle: 'Inżynier spawalnik',
        description: dict.schemaOrg.personDescription,
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', name: 'IWE - Międzynarodowy Inżynier Spawalnik' },
          { '@type': 'EducationalOccupationalCredential', name: 'IWI - Międzynarodowy Inspektor Spawalniczy' },
          { '@type': 'EducationalOccupationalCredential', name: 'VT2 - PN-EN ISO 9712, Instytut Spawalnictwa Gliwice' },
          { '@type': 'EducationalOccupationalCredential', name: 'PT2 - PN-EN ISO 9712, Instytut Spawalnictwa Gliwice' },
        ],
        alumniOf: [{ '@type': 'EducationalOrganization', name: 'Politechnika Częstochowska' }],
        worksFor: { '@id': `${siteUrl}/#business` },
        sameAs: ['https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/'],
        url: siteUrl,
      },
    ],
  })
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const dict = await getDictionary(locale)

  return (
    <html lang={locale} className={`${montserrat.variable} ${barlow.variable} ${greatVibes.variable}`}>
      <body>
        <PageLoader title={dict.modal.cv.title} />
        {children}
        <Script id="schema-org" type="application/ld+json">
          {buildSchemaOrg(dict)}
        </Script>
      </body>
    </html>
  )
}
