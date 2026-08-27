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
import { SubpageFooter } from './SubpageFooter'

function ScopeIcon({ icon }: { icon?: string | null }) {
  const Icon = icon ? ICON_REGISTRY[icon] : null
  if (!Icon) return <span className="w-[28px] h-[28px] bg-accent rotate-45 flex-none" />
  return <Icon size={56} strokeWidth={1.4} className="text-accent flex-none" />
}

function Bullet({ style, index }: { style: BulletStyle; index: number }) {
  switch (style) {
    case 'check':
      return (
        <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] mb-[2px] flex-none text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l5 5L20 6" />
        </svg>
      )
    case 'step-number':
      return (
        <span className="font-montserrat text-[12px] font-bold tracking-[0.04em] text-accent flex-none w-[20px]">
          {String(index + 1).padStart(2, '0')}
        </span>
      )
    case 'vertical-accent':
      return <span className="w-[2px] self-stretch bg-accent flex-none" />
    case 'arrow':
      return (
        <svg viewBox="0 0 20 12" className="w-[18px] h-[11px] mb-[3px] flex-none text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6h15M11 1l5 5-5 5" />
        </svg>
      )
    case 'plus':
      return (
        <svg viewBox="0 0 16 16" className="w-[13px] h-[13px] mb-[2px] flex-none text-accent" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M8 1v14M1 8h14" />
        </svg>
      )
    case 'short-line':
    default:
      return <span className="w-[9px] h-[2px] bg-accent mb-[6px] flex-none" />
  }
}

function BulletList({ title, items, bulletStyle, backgroundImageUrl }: { title: string; items: { text: DefaultTypedEditorState }[]; bulletStyle: BulletStyle; backgroundImageUrl?: string }) {
  const bulletColorStyle = { '--color-accent': backgroundImageUrl ? '#F0F0F0' : '#000000' } as React.CSSProperties
  const content = (
    <>
      <h2 className={`font-semibold text-[26px] uppercase tracking-[0.03em] mb-6 ${backgroundImageUrl ? 'text-[#F0F0F0]' : ''}`}>{title}</h2>
      <ul className="flex flex-col gap-4" style={bulletColorStyle}>
        {items.map((item, i) => (
          <li key={i} className="flex items-baseline gap-4">
            <Bullet style={bulletStyle} index={i} />
            <div className="prose-mcraft prose-mcraft-list flex-1">
              <RichText data={item.text} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )

  if (!backgroundImageUrl) return <div>{content}</div>

  return (
    <div className="relative left-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div
        className="relative overflow-hidden py-[42px] max-[560px]:py-6"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '--color-dark-text': '#F0F0F0',
          '--color-dark-muted': 'rgba(240,240,240,0.75)',
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-ink/70" />
        <div className={`relative ${wrap}`}>{content}</div>
      </div>
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
  additionalSections?: { title: string; bulletStyle: BulletStyle; renderAfterRealizacje: boolean; items: { text: DefaultTypedEditorState }[] }[]
  realizacje?: { href: string; title: string; thumbnailUrl: string | null }[]
  realizacjeTitle?: string
  hideScopeSection?: boolean
  ctaLabel?: string
  locale?: Locale
  dict: Dictionary
  logoImageUrl?: string | null
  logoHref?: string
  navOverride?: { href: string; label: string } | null
  hideHeroOverlay?: boolean
  navPaddingClassName?: string
  topbarBgClassName?: string
  eyebrowColorClassName?: string
  dividerColorClassName?: string
  showTopbarLogo?: boolean
  footerLogoImageUrl?: string | null
  titleLogoImageUrl?: string | null
  sectionBackgroundImages?: Record<string, string>
  accentColor?: string
  accentColorBright?: string
  pageBackgroundImageUrl?: string
  descriptionColorClassName?: string
  tileTextColorClassName?: string
  hideDivider?: boolean
  eyebrowBelowTitle?: boolean
}

const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase py-1.5 relative transition-colors duration-200 text-white/70 hover:text-white'

export function SubpageLayout({
  eyebrow,
  title,
  description,
  heroImageUrl,
  items,
  audience,
  additionalSections,
  realizacje,
  realizacjeTitle,
  hideScopeSection = false,
  ctaLabel,
  locale = 'pl',
  dict,
  logoImageUrl,
  logoHref = '/',
  navOverride,
  hideHeroOverlay = false,
  navPaddingClassName = 'py-[30px]',
  topbarBgClassName = 'bg-ink',
  eyebrowColorClassName = 'text-accent',
  dividerColorClassName = 'bg-accent',
  showTopbarLogo = true,
  footerLogoImageUrl,
  titleLogoImageUrl,
  sectionBackgroundImages,
  accentColor,
  accentColorBright,
  pageBackgroundImageUrl,
  descriptionColorClassName = 'text-light-muted',
  tileTextColorClassName = 'text-white',
  hideDivider = false,
  eyebrowBelowTitle = false,
}: SubpageLayoutProps) {
  const resolvedCtaLabel = ctaLabel ?? dict.subpage.ctaDefault

  const SUBPAGE_NAV_LINKS = navOverride
    ? [{ href: navOverride.href, label: navOverride.label }]
    : [
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

  const rootStyle = {
    ...(accentColor && { '--color-accent': accentColor, '--color-accent-bright': accentColorBright ?? accentColor }),
    ...(pageBackgroundImageUrl && {
      backgroundImage: `url(${pageBackgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'top center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }),
  } as React.CSSProperties

  return (
    <div style={rootStyle}>
    <ModalProvider dict={dict}>
      {/* Topbar */}
      <div className={`${topbarBgClassName} text-light`}>
        <div className={wrap}>
          <nav className={`flex items-center justify-between ${navPaddingClassName}`}>
            {showTopbarLogo ? (
              <Link href={logoHref}>
                {logoImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- next/image requires images.localPatterns config for this one-off logo
                  <img src={logoImageUrl} alt="MK Gym" className="h-[70px] w-auto" />
                ) : (
                  <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">MCRAFT</span>
                )}
              </Link>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-[38px] max-[980px]:hidden">
              {navOverride ? (
                <Link href={navOverride.href} className={navLink}>{navOverride.label}</Link>
              ) : (
                <>
                  <Link href="/#about" className={navLink}>{dict.nav.about}</Link>
                  <Link href="/#areas" className={navLink}>{dict.nav.areas}</Link>
                  <NavRealizacjeDropdown triggerClass={navLink} dict={dict} />
                  <Link href="/#contact" className={navLink}>{dict.nav.contact}</Link>
                </>
              )}
              <LanguageSwitcher locale={locale} triggerClassName={navLink} />
            </div>
            <MobileNav links={SUBPAGE_NAV_LINKS} locale={locale} dict={dict} logoImageUrl={logoImageUrl} showLogo={showTopbarLogo} />
          </nav>
        </div>
      </div>

      {/* Page header */}
      <header className="bg-ink text-light relative overflow-hidden pt-16 pb-[72px]">
        {heroImageUrl ? (
          <>
            <ImageWithSkeleton src={heroImageUrl} alt="" className="object-cover" />
            {!hideHeroOverlay && <div className="absolute inset-0 bg-ink/70" />}
          </>
        ) : (
          <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
        )}
        <div className={`${wrap} relative`}>
          {!eyebrowBelowTitle && eyebrow && (
            <span className={`block font-montserrat text-xs font-semibold tracking-[0.28em] uppercase ${eyebrowColorClassName} mb-[18px]`}>{eyebrow}</span>
          )}
          <h1 className="font-light text-[52px] tracking-[0.01em] uppercase text-white max-[980px]:text-[38px] flex items-center gap-4">
            {titleLogoImageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- next/image requires images.localPatterns config for this one-off logo */}
                <img src={titleLogoImageUrl} alt="MK" className="h-[92px] w-auto max-[980px]:h-[64px]" />
                GYM
              </>
            ) : title}
          </h1>
          {!hideDivider && <div className={`w-16 h-0.5 ${dividerColorClassName} my-[26px]`} />}
          {eyebrowBelowTitle && eyebrow && (
            <span className={`block font-montserrat text-xs font-semibold tracking-[0.28em] uppercase ${eyebrowColorClassName} ${hideDivider ? 'mt-[26px]' : ''} mb-[14px]`}>{eyebrow}</span>
          )}
          {description && (
            <p className={`max-w-[560px] text-base leading-[1.75] font-light ${hideDivider && !eyebrowBelowTitle ? 'mt-[26px]' : ''} ${descriptionColorClassName}`}>{description}</p>
          )}
        </div>
      </header>

      {/* Body */}
      <section className="py-20">
        <div className={`${wrap} flex flex-col gap-[54px]`}>
          {audience && audience.items.length > 0 && (
            <BulletList title={audience.title} items={audience.items} bulletStyle={audience.bulletStyle} />
          )}

          {!hideScopeSection && (
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
          )}

          {additionalSections
            ?.filter((section) => !section.renderAfterRealizacje)
            .map((section, i) => (
              <BulletList key={i} title={section.title} items={section.items} bulletStyle={section.bulletStyle} backgroundImageUrl={sectionBackgroundImages?.[section.title]} />
            ))}

          {realizacje && realizacje.length > 0 && (
            <div>
              <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">{realizacjeTitle ?? dict.subpage.realizationsTitle}</h2>
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
                      <span className={`font-montserrat text-[13px] font-semibold tracking-[0.08em] uppercase ${tileTextColorClassName}`}>
                        {item.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {additionalSections
            ?.filter((section) => section.renderAfterRealizacje)
            .map((section, i) => (
              <BulletList key={i} title={section.title} items={section.items} bulletStyle={section.bulletStyle} backgroundImageUrl={sectionBackgroundImages?.[section.title]} />
            ))}
        </div>
      </section>

      {/* CTA */}
      {!navOverride && (
        <section className="bg-cream-2 py-16 text-center">
          <div className={wrap}>
            <h2 className="font-semibold text-2xl uppercase tracking-[0.03em] mb-[22px]">{resolvedCtaLabel}</h2>
            <ModalTrigger
              modalKey="contact"
              ariaLabel={dict.subpage.ctaButton}
              className="inline-flex items-center gap-6 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.2em] uppercase px-[28px] py-[17px] transition-all duration-[220ms] hover:bg-accent hover:text-ink cursor-pointer border-none"
            >
              {dict.subpage.ctaButton}
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3">
                <path d="M0 6h28M23 1l5 5-5 5" />
              </svg>
            </ModalTrigger>
          </div>
        </section>
      )}

      {/* Footer */}
      <SubpageFooter isMkGym={Boolean(navOverride)} locale={locale} dict={dict} logoImageUrl={footerLogoImageUrl} />
    </ModalProvider>
    </div>
  )
}
