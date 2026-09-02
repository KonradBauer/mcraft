import { preserveAcronymCase } from '@/lib/preserveAcronymCase'

export function ModalHead({ eyebrowText, title, sub }: { eyebrowText?: string; title: string; sub?: string }) {
  return (
    <div className="bg-ink text-light px-12 pt-7 pb-6 relative overflow-hidden flex-none max-[980px]:px-7">
      <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
      <div className="relative">
        {eyebrowText && <span className="font-montserrat text-[11px] font-semibold tracking-[0.26em] uppercase text-accent-bright">{eyebrowText}</span>}
        <h2 className={`font-light text-[34px] uppercase tracking-[0.02em] text-white max-[980px]:text-[27px] ${eyebrowText ? 'mt-[14px]' : ''}`}>{preserveAcronymCase(title)}</h2>
        {sub && <div className="font-montserrat font-light text-[14px] tracking-[0.14em] uppercase text-light-muted mt-2.5">{sub}</div>}
      </div>
    </div>
  )
}

export function ModalBodySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3 className="font-montserrat font-semibold text-[11px] tracking-[0.16em] uppercase text-accent mt-4 first:mt-0 mb-2 pb-1.5 border-b border-hairline-light">{title}</h3>
      {children}
    </>
  )
}

type ParsedTextBlock = { type: 'p' | 'ul'; lines: string[] }

function parseTextBlocks(text: string): ParsedTextBlock[] {
  const blocks: ParsedTextBlock[] = []
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('- ') || line === '-') {
      const content = line.replace(/^-\s*/, '')
      const last = blocks[blocks.length - 1]
      if (last?.type === 'ul') last.lines.push(content)
      else blocks.push({ type: 'ul', lines: [content] })
    } else {
      blocks.push({ type: 'p', lines: [line] })
    }
  }
  return blocks
}

/** Renderuje tekst z textarea: każdy Enter to osobny akapit, linie zaczynające się od "-" tworzą listę wypunktowaną. */
export function ParsedText({ text, className }: { text: string; className?: string }) {
  const blocks = parseTextBlocks(text)
  return (
    <div className={`flex flex-col gap-2.5 ${className ?? ''}`}>
      {blocks.map((block, i) =>
        block.type === 'ul' ? (
          <ul key={i} className="flex flex-col gap-1.5 pl-4 list-disc marker:text-accent">
            {block.lines.map((line, j) => <li key={j}>{line}</li>)}
          </ul>
        ) : (
          <p key={i}>{block.lines[0]}</p>
        ),
      )}
    </div>
  )
}
