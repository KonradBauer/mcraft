import { RichText } from '@payloadcms/richtext-lexical/react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import Link from 'next/link'
import React from 'react'
import type { BulletStyle } from '@/lib/bulletStyles'
import type { Locale } from '@/lib/i18n/locale'
import type { Dictionary } from '@/lib/i18n/dictionaries/pl'
import { ICON_REGISTRY } from '@/lib/tileIcons'
import { ImageSlot } from './ImageSlot'
import { ImageWithSkeleton } from './ImageWithSkeleton'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileNav } from './MobileNav'
import { ModalProvider } from './ModalProvider'
import { ModalTrigger } from './ModalTrigger'
import { NavRealizacjeDropdown } from './NavRealizacjeDropdown'

function ScopeIcon({ icon }: { icon?: string | null }) {
  const Icon = icon ? ICON_REGISTRY[icon] : null
  if (!Icon) return <span className="w-[28px] h-[28px] bg-accent rotate-45 flex-none" />
  return <Icon size={56} strokeWidth={1.4} className="text-accent flex-none" />
}

function Bullet({ style, index }: { style: BulletStyle; index: number }) {
  switch (style) {
    case 'check':
      return (
        <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] mt-[6px] flex-none text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l5 5L20 6" />
        </svg>
      )
    case 'step-number':
      return (
        <span className="font-montserrat text-[12px] font-bold tracking-[0.04em] text-accent mt-[3px] flex-none w-[20px]">
          {String(index + 1).padStart(2, '0')}
        </span>
      )
    case 'vertical-accent':
      return <span className="w-[2px] self-stretch bg-accent flex-none" />
    case 'arrow':
      return (
        <svg viewBox="0 0 20 12" className="w-[18px] h-[11px] mt-[8px] flex-none text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6h15M11 1l5 5-5 5" />
        </svg>
      )
    case 'plus':
      return (
        <svg viewBox="0 0 16 16" className="w-[13px] h-[13px] mt-[8px] flex-none text-accent" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M8 1v14M1 8h14" />
        </svg>
      )
    case 'short-line':
    default:
      return <span className="w-[9px] h-[2px] bg-accent mt-[11px] flex-none" />
  }
}

function BulletList({ title, items, bulletStyle }: { title: string; items: { text: DefaultTypedEditorState }[]; bulletStyle: BulletStyle }) {
  return (
    <div>
      <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">{title}</h2>
      <ul className="flex flex-col gap-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4">
            <Bullet style={bulletStyle} index={i} />
            <div className="prose-mcraft prose-mcraft-list flex-1">
              <RichText data={item.text} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface SubpageLayoutProps {
  eyebrow?: string | null
  title: string
  description?: string | null
  heroImageUrl?: string | null
  items: { icon?: string | null; text: string; description?: string | null; modalDescription?: string | null }[]
  audience?: { title: string; bulletStyle: BulletStyle; items: { text: DefaultTypedEditorState }[] } | null
  additionalSections?: { title: string; bulletStyle: BulletStyle; items: { text: DefaultTypedEditorState }[] }[]
  realizacje?: { href: string; title: string; thumbnailUrl: string | null }[]
  ctaLabel?: string
  locale?: Locale
  dict: Dictionary
}

const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase pb-1.5 relative transition-colors duration-200 text-white/70 hover:text-white'

export function SubpageLayout({
  eyebrow,
  title,
  description,
  heroImageUrl,
  items,
  audience,
  additionalSections,
  realizacje,
  ctaLabel,
  locale = 'pl',
  dict,
}: SubpageLayoutProps) {
  const resolvedCtaLabel = ctaLabel ?? dict.subpage.ctaDefault

  const SUBPAGE_NAV_LINKS = [
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
    <ModalProvider dict={dict}>
      {/* Topbar */}
      <div className="bg-ink text-light">
        <div className={wrap}>
          <nav className="flex items-center justify-between py-[30px]">
            <Link href="/">
              <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">MCRAFT</span>
            </Link>
            <div className="flex gap-[38px] max-[980px]:hidden">
              <Link href="/#about" className={navLink}>{dict.nav.about}</Link>
              <Link href="/#areas" className={navLink}>{dict.nav.areas}</Link>
              <NavRealizacjeDropdown triggerClass={navLink} dict={dict} />
              <Link href="/#contact" className={navLink}>{dict.nav.contact}</Link>
              <LanguageSwitcher locale={locale} triggerClassName={navLink} />
            </div>
            <MobileNav links={SUBPAGE_NAV_LINKS} locale={locale} dict={dict} />
          </nav>
        </div>
      </div>

      {/* Page header */}
      <header className="bg-ink text-light relative overflow-hidden pt-16 pb-[72px]">
        {heroImageUrl ? (
          <>
            <ImageWithSkeleton src={heroImageUrl} alt="" className="object-cover" />
            <div className="absolute inset-0 bg-ink/70" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
        )}
        <div className={`${wrap} relative`}>
          {eyebrow && (
            <span className="block font-montserrat text-xs font-semibold tracking-[0.28em] uppercase text-accent mb-[18px]">{eyebrow}</span>
          )}
          <h1 className="font-light text-[52px] tracking-[0.01em] uppercase text-white max-[980px]:text-[38px]">{title}</h1>
          <div className="w-16 h-0.5 bg-accent my-[26px]" />
          {description && (
            <p className="max-w-[560px] text-base leading-[1.75] text-light-muted font-light">{description}</p>
          )}
        </div>
      </header>

      {/* Body */}
      <section className="py-20">
        <div className={`${wrap} flex flex-col gap-[54px]`}>
          {audience && audience.items.length > 0 && (
            <BulletList title={audience.title} items={audience.items} bulletStyle={audience.bulletStyle} />
          )}

          <div>
            <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">{dict.subpage.scopeTitle}</h2>
            <div className="flex flex-col gap-[18px]">
              {items.map((item, i) => {
                const cardClass = 'relative flex items-center gap-5 bg-white border border-[#e8e3d9] p-[28px]'
                const content = (
                  <>
                    <span className="absolute top-0 left-0 w-[22px] h-[22px] border-t border-l border-accent pointer-events-none" />
                    <ScopeIcon icon={item.icon} />
                    <span className="block font-montserrat font-semibold text-[17px] text-dark-text leading-[1.4]">
                      {item.text}
                    </span>
                  </>
                )

                if (!item.description) {
                  return <div key={i} className={cardClass}>{content}</div>
                }

                return (
                  <ModalTrigger
                    key={i}
                    modalKey="scope"
                    asDiv
                    ariaLabel={item.text}
                    content={{ title: item.text, description: item.modalDescription || item.description }}
                    className={`${cardClass} cursor-pointer transition-colors duration-200 hover:border-accent`}
                  >
                    {content}
                  </ModalTrigger>
                )
              })}
            </div>
          </div>

          {additionalSections?.map((section, i) => (
            <BulletList key={i} title={section.title} items={section.items} bulletStyle={section.bulletStyle} />
          ))}

          {realizacje && realizacje.length > 0 && (
            <div>
              <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">{dict.subpage.realizationsTitle}</h2>
              <div className="grid grid-cols-3 gap-[18px] max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
                {realizacje.map((item, i) => (
                  <Link key={i} href={item.href} className="group block relative w-full h-[220px] overflow-hidden">
                    {item.thumbnailUrl ? (
                      <ImageWithSkeleton
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 33vw"
                      />
                    ) : (
                      <ImageSlot placeholder={item.title} className="w-full h-full" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 py-3">
                      <span className="font-montserrat text-[13px] font-semibold tracking-[0.08em] text-white uppercase">
                        {item.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-2 py-16 text-center">
        <div className={wrap}>
          <h2 className="font-semibold text-2xl uppercase tracking-[0.03em] mb-[22px]">{resolvedCtaLabel}</h2>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-6 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.2em] uppercase px-[28px] py-[17px] transition-all duration-[220ms] hover:bg-accent hover:text-ink"
          >
            {dict.subpage.ctaButton}
            <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3">
              <path d="M0 6h28M23 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-3 text-light pt-16 pb-[26px]">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1.2fr] gap-12 items-start max-[768px]:grid-cols-1">

            <div>
              <span className="block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-[#008A58] mb-[18px]">{dict.footer.eyebrow}</span>
              <h2 className="font-semibold text-[30px] tracking-[0.04em] uppercase text-white mb-[22px]">{dict.footer.title}</h2>
              <div className="mb-[22px]">
                <div className="font-montserrat font-semibold text-[13px] tracking-[0.08em] text-white mb-[8px]">MCRAFT Michał Macherzyński</div>
                <div className="text-[13px] text-light-muted leading-[1.8]">
                  NIP: 5742046939<br />
                  REGON: 388131678
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                <a href="tel:+48601488318" className="hover:text-light transition-colors duration-200">+48 601-488-318</a>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
                <a href="mailto:kontakt@poczta-mcraft.pl" className="hover:text-light transition-colors duration-200">kontakt@poczta-mcraft.pl</a>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>ul. Żołnierzy Września 36, 42-152 Wilkowiecko</span>
              </div>
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] text-accent flex-none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                <a href="https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/" target="_blank" rel="noopener noreferrer" className="hover:text-light transition-colors duration-200">LinkedIn</a>
              </div>
            </div>

            <div className="border-l border-white/10 pl-[46px] max-[768px]:border-l-0 max-[768px]:pl-0 max-[768px]:border-t max-[768px]:border-white/10 max-[768px]:pt-[34px] overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=ul.+Żołnierzy+Września+36,+42-152+Wilkowiecko&output=embed&hl=${locale}`}
                width="100%"
                height="300"
                style={{ border: 0, filter: 'grayscale(1) invert(0.85) contrast(0.9)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={dict.footer.mapsTitle}
              />
            </div>

          </div>

          <div className="border-t border-white/10 mt-[46px] pt-[22px] flex flex-row items-center justify-between gap-4 text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-2">
            <span>© {new Date().getFullYear()} {dict.footer.copyrightSuffix}</span>
            <Link href="/polityka-prywatnosci" className="hover:text-white/60 transition-colors duration-200">{dict.footer.privacyPolicy}</Link>
            <span>{dict.footer.builtBy} <a href="https://studiocodeart.pl" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors duration-200">studiocodeart.pl</a></span>
          </div>
        </div>
      </footer>
    </ModalProvider>
  )
}
