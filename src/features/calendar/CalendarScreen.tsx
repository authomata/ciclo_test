import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'

export function CalendarScreen() {
  return (
    <div>
      <PageHeader
        title="Calendario"
        subtitle="Tus días, pintados con las cuatro estaciones"
      />
      <Card>
        <p className="text-sm text-content-soft">
          El calendario visual con las estaciones sobre cada día llega en la{' '}
          <span className="font-medium text-content">Fase 2</span>, junto al cálculo de
          fases y la ventana fértil estimada.
        </p>
      </Card>
    </div>
  )
}
