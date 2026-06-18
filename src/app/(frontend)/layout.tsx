import type { Metadata } from 'next'
import { Barlow, Great_Vibes, Montserrat } from 'next/font/google'
import Script from 'next/script'
import React from 'react'
import './styles.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700'],
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

const siteUrl = 'https://mcraft.pl'
const ogImage = `${siteUrl}/opengraph-image`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Inzynier spawalnik Dr inz. Michal Macherzynski | MCRAFT',
    template: '%s | MCRAFT',
  },
  description: 'Dr inz. Michal Macherzynski - inzynier spawalnik IWE/IWI/VT2/PT2. Nadzor spawalniczy, konstrukcje stalowe, meble premium. Wilkowiecko, woj. slaskie.',
  keywords: ['inzynier spawalnik', 'nadzor spawalniczy', 'IWE', 'IWI', 'spawalnictwo', 'konstrukcje stalowe', 'meble stalowe', 'MCRAFT', 'Macherzynski'],
  authors: [{ name: 'Michal Macherzynski', url: siteUrl }],
  creator: 'Michal Macherzynski',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Inzynier spawalnik Dr inz. Michal Macherzynski | MCRAFT',
    description: 'Nadzor spawalniczy, konstrukcje stalowe, meble premium. IWE/IWI/VT2/PT2. Wilkowiecko, woj. slaskie.',
    url: siteUrl,
    siteName: 'MCRAFT',
    locale: 'pl_PL',
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'MCRAFT - Dr inz. Michal Macherzynski' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inzynier spawalnik Dr inz. Michal Macherzynski | MCRAFT',
    description: 'Nadzor spawalniczy, konstrukcje stalowe, meble premium. IWE/IWI/VT2/PT2.',
    images: [ogImage],
  },
}

const schemaOrg = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': `${siteUrl}/#business`,
      name: 'MCRAFT Michal Macherzynski',
      legalName: 'MCRAFT Michal Macherzynski',
      description: 'Nadzor spawalniczy, konstrukcje stalowe i meble premium. Dr inz. Michal Macherzynski - inzynier spawalnik IWE/IWI/VT2/PT2.',
      url: siteUrl,
      telephone: '+48601488318',
      email: 'kontakt@poczta-mcraft.pl',
      taxID: '5742046939',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Zolnierzy Wrzesnia 36',
        addressLocality: 'Wilkowiecko',
        postalCode: '42-152',
        addressCountry: 'PL',
        addressRegion: 'slaskie',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 50.892, longitude: 18.942 },
      areaServed: { '@type': 'Country', name: 'PL' },
      sameAs: ['https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/'],
      founder: { '@id': `${siteUrl}/#person` },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Uslugi spawalnicze i metalowe',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nadzor spawalniczy', url: `${siteUrl}/nadzor-spawalniczy` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Konstrukcje stalowe', url: `${siteUrl}/konstrukcje-stalowe` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Meble premium', url: `${siteUrl}/meble-premium` } },
        ],
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Michal Macherzynski',
      honorificPrefix: 'Dr inz.',
      jobTitle: 'Inzynier spawalnik',
      description: 'Glowny Spawalnik i Kierownik Projektow B+R w ZUGIL S.A. Ponad 18 lat doswiadczenia w spawalnictwie.',
      hasCredential: [
        { '@type': 'EducationalOccupationalCredential', name: 'IWE - Miedzynarodowy Inzynier Spawalnik' },
        { '@type': 'EducationalOccupationalCredential', name: 'IWI - Miedzynarodowy Inspektor Spawalniczy' },
        { '@type': 'EducationalOccupationalCredential', name: 'VT2 - PN-EN ISO 9712, Instytut Spawalnictwa Gliwice' },
        { '@type': 'EducationalOccupationalCredential', name: 'PT2 - PN-EN ISO 9712, Instytut Spawalnictwa Gliwice' },
      ],
      alumniOf: [{ '@type': 'EducationalOrganization', name: 'Politechnika Czestochowska' }],
      worksFor: { '@id': `${siteUrl}/#business` },
      sameAs: ['https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/'],
      url: siteUrl,
    },
  ],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${montserrat.variable} ${barlow.variable} ${greatVibes.variable}`}>
      <body>
        {children}
        <Script id="schema-org" type="application/ld+json">
          {schemaOrg}
        </Script>
      </body>
    </html>
  )
}
