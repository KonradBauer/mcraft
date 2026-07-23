import { Barlow, Montserrat } from 'next/font/google'
import Link from 'next/link'
import { getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'
import './(frontend)/styles.css'

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

export const metadata = {
  title: '404 - Nie znaleziono strony | MCRAFT',
}

export default async function NotFound() {
  const locale = await getLocale()
  const dict = await getDictionary(locale)

  return (
    <html lang={locale} className={`${montserrat.variable} ${barlow.variable}`}>
      <body className="bg-ink text-light min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="font-montserrat font-semibold text-[120px] leading-none text-white/[0.06] select-none max-[560px]:text-[80px]">
            404
          </div>
          <div className="-mt-6 relative z-10">
            <div className="w-10 h-px bg-accent mx-auto mb-6" />
            <span className="block font-montserrat text-[11px] font-semibold tracking-[0.28em] uppercase text-accent mb-4">
              {dict.notFound.eyebrow}
            </span>
            <h1 className="font-light text-[32px] uppercase tracking-[0.04em] text-white mb-3 max-[560px]:text-[24px]">
              {dict.notFound.title}
            </h1>
            <p className="text-[15px] leading-[1.75] text-light-muted font-light max-w-[360px] mx-auto mb-10">
              {dict.notFound.description}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-6 border border-white/[0.22] px-6 py-4 font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-light transition-all duration-[250ms] hover:bg-accent hover:border-accent hover:text-ink"
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[10px]">
                <path d="M30 6H2M7 1 2 6l5 5" />
              </svg>
              {dict.notFound.backHome}
            </Link>
          </div>
        </div>

        <footer className="py-6 text-center font-montserrat text-[11px] tracking-[0.14em] uppercase text-light-faint">
          {dict.notFound.footer}
        </footer>
      </body>
    </html>
  )
}
