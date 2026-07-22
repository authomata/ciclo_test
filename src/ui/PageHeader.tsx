export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-content">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-content-soft">{subtitle}</p>}
    </header>
  )
}
