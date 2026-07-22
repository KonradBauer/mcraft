const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=ul.+%C5%BBo%C5%82nierzy+Wrze%C5%9Bnia+36%2C+42-152+Wilkowiecko'

export function LocationCard() {
  return (
    <a
      href={MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-[300px] w-full flex-col items-center justify-center gap-4 overflow-hidden bg-white/5 text-center transition-colors duration-200 hover:bg-white/[0.07]"
    >
      <div className="absolute inset-0 opacity-30 dots-pattern pointer-events-none" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="relative w-8 h-8 text-accent">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
      <span className="relative font-montserrat text-[13px] font-light tracking-[0.02em] text-light-muted leading-[1.6] max-w-[220px]">
        ul. Żołnierzy Września 36<br />42-152 Wilkowiecko
      </span>
      <span className="relative inline-flex items-center gap-2 border border-[#3A3A3A] px-[16px] py-[9px] font-montserrat text-[11px] font-semibold tracking-[0.14em] uppercase text-light transition-all duration-200 group-hover:bg-accent group-hover:border-accent group-hover:text-ink">
        Otwórz w Google Maps
      </span>
    </a>
  )
}
