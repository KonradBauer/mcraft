import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from '@/lib/i18n/locale'
import { PolitykaPrywatnosciContentPl, politykaPrywatnosciPlText } from './content.pl'
import { PolitykaPrywatnosciContentEn, politykaPrywatnosciEnText } from './content.en'

export const metadata: Metadata = {
  title: 'Polityka prywatności',
  description: 'Polityka prywatności serwisu mcraft.com.pl - informacje o przetwarzaniu danych osobowych.',
  robots: { index: false },
}

const wrap = 'max-w-[860px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'

export default async function PolitykaPrywatnosci() {
  const locale = await getLocale()
  const text = locale === 'en' ? politykaPrywatnosciEnText : politykaPrywatnosciPlText

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-ink text-light py-6">
        <div className={wrap}>
          <Link href="/" className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">
            MCRAFT
          </Link>
        </div>
      </div>

      <main className={`${wrap} py-16`}>
        {locale === 'en' ? <PolitykaPrywatnosciContentEn /> : <PolitykaPrywatnosciContentPl />}

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-accent hover:text-dark-text transition-colors duration-200"
          >
            {text.backHome}
          </Link>
        </div>
      </main>

      <footer className="bg-ink-3 text-light py-6 mt-16">
        <div className={`${wrap} text-center text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)]`}>
          © {new Date().getFullYear()} {text.copyrightSuffix}
        </div>
      </footer>
    </div>
  )
}
