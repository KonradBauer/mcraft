export type BulletStyle = 'short-line' | 'check' | 'step-number' | 'vertical-accent' | 'arrow' | 'plus'

export interface BulletStyleOption {
  value: BulletStyle
  label: string
  description: string
}

export const BULLET_STYLE_OPTIONS: BulletStyleOption[] = [
  { value: 'short-line', label: 'Krótka linia', description: 'Dla kogo, materiały, zastosowania i neutralne listy.' },
  { value: 'check', label: 'Potwierdzenie', description: 'Korzyści, zakres w cenie i to, co otrzymuje klient.' },
  { value: 'step-number', label: 'Numer etapu', description: 'Proces współpracy, realizacji albo produkcji.' },
  { value: 'vertical-accent', label: 'Pionowy akcent', description: 'Ważna informacja, wymaganie techniczne lub uwaga.' },
  { value: 'arrow', label: 'Strzałka', description: 'Kroki, kierunki działania lub przekierowanie uwagi.' },
  { value: 'plus', label: 'Plus', description: 'Dodatkowe elementy, rozszerzenia lub opcje do wyboru.' },
]

export const DEFAULT_BULLET_STYLE: BulletStyle = 'short-line'
