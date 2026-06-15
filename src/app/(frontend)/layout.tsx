import { Barlow, Great_Vibes, Montserrat } from 'next/font/google'
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

export const metadata = {
  description: 'Dr inż. Michał Macherzyński — Inżynier spawalnik, IWE / IWI / VT2 / PT2',
  title: 'MCRAFT — Dr inż. Michał Macherzyński',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${montserrat.variable} ${barlow.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  )
}
