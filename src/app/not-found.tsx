import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Barlow, Montserrat } from 'next/font/google'
import Link from 'next/link'
import { DEFAULT_LOCALE, getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { preserveAcronymCase } from '@/lib/preserveAcronymCase'
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return { title: dict.notFound.metaTitle }
}

// Ten route ma własny root <html> (poza (frontend)/layout.tsx). Ten sam wzorzec co w
// (frontend)/layout.tsx: statyczne lang domyślne + inline script koryguje je dla en.
const LOCALE_LANG_SYNC_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )locale=([^;]+)/);if(m&&m[1]==='en'){document.documentElement.lang='en'}}catch(e){}})();`

export default function NotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={`${montserrat.variable} ${barlow.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_LANG_SYNC_SCRIPT }} />
      </head>
      <body className="bg-ink text-light min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <NotFoundContent />
        </Suspense>
      </body>
    </html>
  )
}

async function NotFoundContent() {
  const locale = await getLocale()
  const dict = await getDictionary(locale)

  return (
    <>
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
        {preserveAcronymCase(dict.notFound.footer)}
      </footer>
    </>
  )
}
