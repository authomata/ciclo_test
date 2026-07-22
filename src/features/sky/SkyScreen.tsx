import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'

export function SkyScreen() {
  return (
    <div>
      <PageHeader title="Cielo" subtitle="El registro visual de tus ciclos" />
      <Card>
        <p className="text-sm text-content-soft">
          Cada ciclo completo se convertirá en una{' '}
          <span className="font-medium text-content">constelación única</span>, generada a
          partir de tus datos de ese mes. Se irán juntando aquí, en tu cielo personal.
          Llega en la Fase 4.
        </p>
      </Card>
    </div>
  )
}
