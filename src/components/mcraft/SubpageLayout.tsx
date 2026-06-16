import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ImageSlot } from './ImageSlot'

export interface SubpageLayoutProps {
  eyebrow?: string | null
  title: string
  description?: string | null
  items: { text: string }[]
  mainImageUrl?: string | null
  galleryImages?: { url: string; alt?: string | null }[]
  ctaLabel?: string
}

const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase pb-1.5 relative transition-colors duration-200 text-white/70 hover:text-white'

export function SubpageLayout({
  eyebrow,
  title,
  description,
  items,
  mainImageUrl,
  galleryImages = [],
  ctaLabel = 'Zainteresowany współpracą?',
}: SubpageLayoutProps) {
  return (
    <>
      {/* Topbar */}
      <div className="bg-ink text-light">
        <div className={wrap}>
          <nav className="flex items-center justify-between py-[30px]">
            <Link href="/">
              <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">MCRAFT</span>
            </Link>
            <div className="flex gap-[38px] max-[980px]:hidden">
              <Link href="/#about" className={navLink}>O mnie</Link>
              <Link href="/#areas" className={navLink}>Obszary</Link>
              <Link href="/nadzor-spawalniczy" className={navLink}>Realizacje</Link>
              <Link href="/#workshop" className={navLink}>Warsztat</Link>
              <Link href="/#contact" className={navLink}>Kontakt</Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Page header */}
      <header className="bg-ink text-light relative overflow-hidden pt-16 pb-[72px]">
        <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
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
        <div className={wrap}>
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-[60px] items-start max-[980px]:grid-cols-1 max-[980px]:gap-10">
            <div>
              <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">Zakres</h2>
              <ul className="flex flex-col gap-4">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[15.5px] leading-[1.6] text-[#56544e]">
                    <span className="w-[9px] h-[9px] bg-accent mt-[7px] flex-none rotate-45" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {mainImageUrl ? (
                <div className="relative w-full h-[340px]">
                  <Image src={mainImageUrl} alt={title} fill className="object-cover" />
                </div>
              ) : (
                <ImageSlot placeholder={`Zdjęcie - ${title}`} className="w-full h-[340px]" />
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="mt-[18px]">
            <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">Realizacje</h2>
            <div className="grid grid-cols-3 gap-[18px] max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
              {galleryImages.length > 0
                ? galleryImages.map((img, i) => (
                    <div key={i} className="relative w-full h-[220px]">
                      <Image src={img.url} alt={img.alt ?? `Realizacja ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))
                : (['Realizacja 1', 'Realizacja 2', 'Realizacja 3'] as const).map((ph) => (
                    <ImageSlot key={ph} placeholder={ph} className="w-full h-[220px]" />
                  ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-2 py-16 text-center">
        <div className={wrap}>
          <h2 className="font-semibold text-2xl uppercase tracking-[0.03em] mb-[22px]">{ctaLabel}</h2>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-6 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.2em] uppercase px-[28px] py-[17px] transition-all duration-[220ms] hover:bg-accent hover:text-ink"
          >
            Skontaktuj się
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
              <span className="block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-[#008A58] mb-[18px]">Porozmawiajmy o Twoim projekcie</span>
              <h2 className="font-semibold text-[30px] tracking-[0.04em] uppercase text-white mb-[22px]">Skontaktuj się</h2>
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
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>ul. Żołnierzy Września 36, 42-152 Wilkowiecko</span>
              </div>
            </div>

            <div className="border-l border-white/10 pl-[46px] max-[768px]:border-l-0 max-[768px]:pl-0 max-[768px]:border-t max-[768px]:border-white/10 max-[768px]:pt-[34px] overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=ul.+Żołnierzy+Września+36,+42-152+Wilkowiecko&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, filter: 'grayscale(1) invert(0.85) contrast(0.9)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokalizacja MCRAFT"
              />
            </div>

          </div>

          <div className="border-t border-white/10 mt-[46px] pt-[22px] text-center text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)]">
            © 2025 MCRAFT Michał Macherzyński. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </>
  )
}
