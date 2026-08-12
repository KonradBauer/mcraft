import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/mcraft/LanguageSwitcher'
import { MobileNav } from '@/components/mcraft/MobileNav'
import { NavRealizacjeDropdown } from '@/components/mcraft/NavRealizacjeDropdown'
import { PageFallback } from '@/components/mcraft/PageFallback'
import { getLocale } from '@/lib/i18n/locale'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { PolitykaPrywatnosciContentPl } from './content.pl'
import { PolitykaPrywatnosciContentEn } from './content.en'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return {
    title: dict.meta.privacyPolicy.title,
    description: dict.meta.privacyPolicy.description,
    robots: { index: false },
  }
}

const wrap = 'max-w-[860px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase pb-1.5 relative transition-colors duration-200 text-white/70 hover:text-white'

export default function PolitykaPrywatnosci() {
  return (
    <Suspense fallback={<PageFallback className="bg-cream" />}>
      <PolitykaPrywatnosciContent />
    </Suspense>
  )
}

async function PolitykaPrywatnosciContent() {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const ContentComponent = locale === 'en' ? PolitykaPrywatnosciContentEn : PolitykaPrywatnosciContentPl

  const NAV_LINKS = [
    { href: '/#about', label: dict.nav.about },
    { href: '/#areas', label: dict.nav.areas },
    {
      label: dict.nav.realizations,
      sub: [
        { href: '/nadzor-spawalniczy', label: dict.areas.names.nadzorSpawalniczy },
        { href: '/meble-premium', label: dict.areas.names.meblePremium },
        { href: '/konstrukcje-stalowe', label: dict.areas.names.konstrukcjeStalowe },
      ],
    },
    { href: '/#contact', label: dict.nav.contact },
  ]

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-ink text-light">
        <div className={wrap}>
          <nav className="flex items-center justify-between py-[30px]">
            <Link href="/" className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">
              MCRAFT
            </Link>
            <div className="flex gap-[38px] max-[980px]:hidden">
              <Link href="/#about" className={navLink}>{dict.nav.about}</Link>
              <Link href="/#areas" className={navLink}>{dict.nav.areas}</Link>
              <NavRealizacjeDropdown triggerClass={navLink} dict={dict} />
              <Link href="/#contact" className={navLink}>{dict.nav.contact}</Link>
              <LanguageSwitcher locale={locale} triggerClassName={navLink} />
            </div>
            <MobileNav links={NAV_LINKS} locale={locale} dict={dict} />
          </nav>
        </div>
      </div>

      <main className={`${wrap} py-16`}>
        <ContentComponent />

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-accent hover:text-dark-text transition-colors duration-200"
          >
            - {dict.notFound.backHome}
          </Link>
        </div>
      </main>

      <footer className="bg-ink-3 text-light py-6 mt-16">
        <div className={`${wrap} text-center text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)]`}>
          © {new Date().getFullYear()} {dict.footer.copyrightSuffix}
        </div>
      </footer>
    </div>
  )
}
