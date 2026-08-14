import {
  Award,
  BadgeCheck,
  Box,
  Briefcase,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Cpu,
  Droplets,
  Dumbbell,
  Eye,
  Factory,
  FileSearch,
  FileText,
  Flame,
  FlaskConical,
  Globe,
  GraduationCap,
  HardHat,
  Layers,
  Microscope,
  PenTool,
  Rows3,
  Ruler,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Timer,
  Train,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Warehouse,
  Weight,
  Wrench,
  Zap,
  type LucideProps,
} from 'lucide-react'

type IconComponent = React.ComponentType<LucideProps>

function Barbell({ size = 24, strokeWidth = 2, color = 'currentColor', className, ...rest }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <line x1="6" y1="12" x2="18" y2="12" />
      <rect x="2.5" y="7" width="3" height="10" rx="1" />
      <rect x="18.5" y="7" width="3" height="10" rx="1" />
      <rect x="5.5" y="9" width="2" height="6" rx="0.5" />
      <rect x="16.5" y="9" width="2" height="6" rx="0.5" />
    </svg>
  )
}

export const ICON_REGISTRY: Record<string, IconComponent> = {
  Award,
  BadgeCheck,
  Barbell,
  Box,
  Briefcase,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Cpu,
  Droplets,
  Dumbbell,
  Eye,
  Factory,
  FileSearch,
  FileText,
  Flame,
  FlaskConical,
  Globe,
  GraduationCap,
  HardHat,
  Layers,
  Microscope,
  PenTool,
  Rows3,
  Ruler,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Timer,
  Train,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Warehouse,
  Weight,
  Wrench,
  Zap,
}

const NUMBER_FALLBACK: Record<string, IconComponent> = {
  '18+':      Clock,
  '10+':      ClipboardList,
  '5+':       TrendingUp,
  '550+':     Warehouse,
  '500+':     Users,
  '111':      Zap,
  '131':      Zap,
  '135':      Zap,
  '136/138':  Zap,
  '141':      Flame,
  'IWE':      GraduationCap,
  'IWI':      Search,
  'VT2':      Eye,
  'PT2':      Droplets,
  'WPS':      FileText,
  'WPQR':     ClipboardCheck,
  'ISO 3834': ShieldCheck,
  'EN 1090':  Layers,
  'EN 15085': Train,
  'ISO 9606': UserCheck,
  'ISO 14732':Settings2,
  'ISO 14731':Briefcase,
  'B1':       Globe,
  'B+R':      FlaskConical,
  '2D':       PenTool,
  '3D':       Box,
}

export function getTileIcon(number: string, iconName?: string | null): IconComponent {
  if (iconName) return ICON_REGISTRY[iconName] ?? FileSearch
  return NUMBER_FALLBACK[number] ?? FileSearch
}
