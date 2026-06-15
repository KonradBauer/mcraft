import Link from 'next/link'

interface LogoProps {
  strokeColor?: string
  size?: number
}

export function Logo({ strokeColor = '#fff', size = 38 }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-[14px]">
      <svg
        viewBox="0 0 60 60"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <path d="M8 50V12l22 24 22-24v38" />
        <path d="M8 12h6M52 12h-6" />
      </svg>
      <span className="font-montserrat font-semibold text-[20px] tracking-[0.34em]">MCRAFT</span>
    </Link>
  )
}
