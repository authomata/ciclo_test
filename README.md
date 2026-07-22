# Ciclo

App de ciclo menstrual **gamificada, respetuosa y privada**. Modela el ciclo como
cuatro estaciones internas —Invierno/La Cueva, Primavera/El Brote, Verano/La Cumbre,
Otoño/El Refugio— y usa la fase como *contexto*, nunca como imposición.

Web-first, responsive, instalable como PWA. Sin backend en la v1: los datos viven solo
en tu dispositivo.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS con tokens de color por estación (CSS variables)
- Dexie.js (IndexedDB) para persistencia local
- Zustand para estado de UI
- Framer Motion para transiciones
- Recharts (vista de patrones, Fase 4)

## Arquitectura

```
src/
  app/        Entry, router, layout, sincronización de tema
  db/         Dexie + repositorios (única puerta a los datos)
  domain/     Lógica pura y testeable: tipos, estaciones, catálogos
  features/   Onboarding, Hoy, Calendario, Cielo, Ajustes
  stores/     Zustand (tema, estación activa)
  ui/         Componentes base
  lib/        Utilidades (fechas, y cifrado en Fase 5)
```

**Decisión clave:** modelo por *eventos diarios*. Cada día es un registro
independiente (`DayLog`); los ciclos y las fases se **derivan**, no se almacenan. Así
no hay estados "rancios" que reconciliar y la predicción del Oráculo es fácil de testear.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # build de producción
npm run lint     # chequeo de tipos
```

## Roadmap por fases

1. **Fase 1 (actual)** — Estructura, modelo de datos, persistencia local, navegación base y onboarding.
2. Fase 2 — Registro diario, cálculo de fases y calendario con las cuatro estaciones.
3. Fase 3 — Compañero, XP/niveles, misiones, rachas suaves y el Oráculo (niebla que se despeja).
4. Fase 4 — Constelaciones, vista de patrones, logros y pulido de animaciones.
5. Fase 5 — PWA instalable, bloqueo con PIN, export/import cifrado, `PRIVACY.md` y accesibilidad.

## Privacidad

Datos de salud reproductiva tratados con máxima seriedad: almacenamiento local por
defecto, sin cuenta, sin analytics de terceros, sin telemetría. Detalle completo en
`PRIVACY.md` (Fase 5).

> Las predicciones son estimaciones. Ciclo no es un método anticonceptivo ni sustituye
> el consejo médico.
