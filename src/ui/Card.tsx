import type { PropsWithChildren } from 'react'

export function Card({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-xl2 border border-line bg-surface-2 p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}
