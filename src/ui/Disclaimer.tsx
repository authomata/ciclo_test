// Aviso siempre visible: la app estima, no diagnostica, y no es anticonceptivo.
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-content-soft">
        Las predicciones son estimaciones. Esta app no es un método anticonceptivo ni
        sustituye el consejo médico.
      </p>
    )
  }
  return (
    <div className="rounded-xl2 border border-line bg-surface px-4 py-3">
      <p className="text-xs leading-relaxed text-content-soft">
        <span className="font-medium text-content">Un recordatorio honesto:</span> todo lo
        que ves aquí son <em>estimaciones</em> basadas en tus datos. Ciclo no sirve como
        método anticonceptivo ni reemplaza el consejo de un profesional de la salud.
      </p>
    </div>
  )
}
