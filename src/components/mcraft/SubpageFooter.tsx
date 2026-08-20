import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locale'
import type { Dictionary } from '@/lib/i18n/dictionaries/pl'
import { LocaleFlag } from './FlagIcon'
import { LazyMap } from './LazyMap'

const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'

export interface SubpageFooterProps {
  isMkGym?: boolean
  locale?: Locale
  dict: Dictionary
}

export function SubpageFooter({ isMkGym = false, locale = 'pl', dict }: SubpageFooterProps) {
  return (
    <footer className="bg-ink-3 text-light pt-16 pb-[26px]">
      <div className={wrap}>
        <div className="grid grid-cols-[1fr_1.2fr] gap-12 items-start max-[768px]:grid-cols-1">

          <div>
            {!isMkGym && (
              <span className="block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-[#008A58] mb-[18px]">{dict.footer.eyebrow}</span>
            )}
            <h2 className="font-semibold text-[30px] tracking-[0.04em] uppercase text-white mb-[22px]">{isMkGym ? 'M&K GYM' : dict.footer.title}</h2>
            {!isMkGym && (
              <div className="mb-[22px]">
                <div className="font-montserrat font-semibold text-[13px] tracking-[0.08em] text-white mb-[8px]">MCRAFT Michał Macherzyński</div>
                <div className="text-[13px] text-light-muted leading-[1.8]">
                  NIP: 5742046939<br />
                  REGON: 388131678
                </div>
              </div>
            )}
            {isMkGym ? (
              <>
                <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                  <a href="tel:+48601488318" className="hover:text-light transition-colors duration-200">Michał: +48 601-488-318</a>
                  <span className="flex items-center gap-1.5">
                    <LocaleFlag code="pl" />
                    <LocaleFlag code="en" />
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                  <a href="tel:+48662050419" className="hover:text-light transition-colors duration-200">Kamil: +48 662-050-419</a>
                  <span className="flex items-center gap-1.5">
                    <LocaleFlag code="pl" />
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                <a href="tel:+48601488318" className="hover:text-light transition-colors duration-200">+48 601-488-318</a>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
              <a href="mailto:kontakt@poczta-mcraft.pl" className="hover:text-light transition-colors duration-200">kontakt@poczta-mcraft.pl</a>
            </div>
            <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>ul. Żołnierzy Września 36, 42-152 Wilkowiecko</span>
            </div>
            {isMkGym ? (
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] text-accent flex-none"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9H16l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z" /></svg>
                <a href="https://www.facebook.com/SteelHandsMKGYM" target="_blank" rel="noopener noreferrer" className="hover:text-light transition-colors duration-200">Facebook</a>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] text-accent flex-none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                <a href="https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/" target="_blank" rel="noopener noreferrer" className="hover:text-light transition-colors duration-200">LinkedIn</a>
              </div>
            )}
          </div>

          <div className="border-l border-white/10 pl-[46px] max-[768px]:border-l-0 max-[768px]:pl-0 max-[768px]:border-t max-[768px]:border-white/10 max-[768px]:pt-[34px] overflow-hidden">
            <LazyMap title={dict.footer.mapsTitle} locale={locale} />
          </div>

        </div>

        <div className="border-t border-white/10 mt-[46px] pt-[22px] flex flex-row items-center justify-between gap-4 text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-2">
          <span>© {new Date().getFullYear()} {dict.footer.copyrightSuffix}</span>
          <Link href="/polityka-prywatnosci" className="hover:text-white/60 transition-colors duration-200">{dict.footer.privacyPolicy}</Link>
          <span>{dict.footer.builtBy} <a href="https://studiocodeart.pl" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors duration-200">studiocodeart.pl</a></span>
        </div>
      </div>
    </footer>
  )
}
