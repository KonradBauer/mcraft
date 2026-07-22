import Image from 'next/image'

export const dynamic = 'force-static'

export default function OgImagePage() {
  return (
    <div className="relative w-[1200px] h-[630px] overflow-hidden bg-ink text-light">
      <style>{'nextjs-portal { display: none !important; }'}</style>

      <div className="absolute inset-0 z-0 blueprint-bg opacity-60" />
      <div className="absolute top-[64px] left-[490px] w-[160px] h-[120px] opacity-40 dots-pattern z-0" />

      <div
        className="absolute inset-y-0 right-0 z-[1] flex items-end"
        style={{
          maskImage: 'linear-gradient(to left, black 62%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, black 62%, transparent 100%)',
        }}
      >
        <Image
          src="/hero-michal.png"
          alt=""
          width={430}
          height={684}
          className="h-[94%] w-auto"
          priority
        />
      </div>

      <div className="absolute inset-0 z-[2] [background:linear-gradient(to_right,rgba(14,26,23,1)_0%,rgba(14,26,23,0.85)_44%,rgba(14,26,23,0)_78%)]" />

      <div className="absolute top-[42px] left-[56px] z-[3] font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">
        MCRAFT
      </div>

      <div className="absolute top-[190px] left-[56px] z-[3] max-w-[620px]">
        <span className="block font-montserrat text-[15px] font-semibold tracking-[0.3em] uppercase text-accent-bright">
          Dr inż.
        </span>
        <h1 className="font-montserrat font-light text-[58px] leading-[1.08] tracking-[0.01em] text-white uppercase mt-[14px]">
          Michał<br />Macherzyński
        </h1>
        <div className="w-16 h-0.5 bg-accent mt-[26px] mb-[20px]" />
        <div className="font-montserrat font-light text-[18px] tracking-[0.2em] uppercase text-light leading-[1.5]">
          Inżynier spawalnik<br />IWE / IWI / VT2 / PT2
        </div>
      </div>

      <div className="absolute bottom-[36px] left-[56px] z-[3] font-montserrat font-light text-[13px] tracking-[0.32em] uppercase text-light-muted">
        mcraft.com.pl
      </div>
    </div>
  )
}
