import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'solido' | 'contorno' | 'plano'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variante?: Variante
  /** Color del slice que esta acción invoca. */
  color?: string
  icono?: ReactNode
}

export function Button({
  children,
  variante = 'solido',
  color = '#16202E',
  icono,
  className = '',
  style,
  ...resto
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ' +
    'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  const estilos: Record<Variante, string> = {
    solido: 'text-white shadow-sm hover:brightness-110 active:brightness-95',
    contorno: 'border bg-white hover:bg-slate-50',
    plano: 'hover:bg-slate-100',
  }

  const colorEstilo =
    variante === 'solido'
      ? { backgroundColor: color, ...style }
      : variante === 'contorno'
        ? { borderColor: color, color, ...style }
        : { color, ...style }

  return (
    <button
      className={`${base} ${estilos[variante]} ${className}`}
      style={{ ...colorEstilo, ['--tw-ring-color' as string]: color }}
      {...resto}
    >
      {icono}
      {children}
    </button>
  )
}
