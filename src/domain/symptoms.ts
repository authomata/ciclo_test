// Catálogo de síntomas físicos y anímicos para la multiselección del registro.
// Los ids son estables; las etiquetas pueden cambiar sin romper datos guardados.

export interface SymptomDef {
  id: string
  label: string
  emoji: string
  group: 'cuerpo' | 'animo' | 'energia' | 'piel' | 'digestivo'
}

export const SYMPTOMS: SymptomDef[] = [
  { id: 'cramps', label: 'Cólicos', emoji: '🌀', group: 'cuerpo' },
  { id: 'headache', label: 'Dolor de cabeza', emoji: '💢', group: 'cuerpo' },
  { id: 'backache', label: 'Dolor lumbar', emoji: '🔻', group: 'cuerpo' },
  { id: 'breast_tenderness', label: 'Sensibilidad en el pecho', emoji: '🫧', group: 'cuerpo' },
  { id: 'bloating', label: 'Hinchazón', emoji: '🎈', group: 'digestivo' },
  { id: 'nausea', label: 'Náusea', emoji: '🤢', group: 'digestivo' },
  { id: 'cravings', label: 'Antojos', emoji: '🍫', group: 'digestivo' },
  { id: 'acne', label: 'Brotes en la piel', emoji: '🌋', group: 'piel' },
  { id: 'fatigue', label: 'Cansancio', emoji: '🥱', group: 'energia' },
  { id: 'insomnia', label: 'Insomnio', emoji: '🌙', group: 'energia' },
  { id: 'irritability', label: 'Irritabilidad', emoji: '⚡', group: 'animo' },
  { id: 'anxiety', label: 'Ansiedad', emoji: '🌫️', group: 'animo' },
  { id: 'sadness', label: 'Tristeza', emoji: '💧', group: 'animo' },
  { id: 'focus', label: 'Claridad mental', emoji: '🔎', group: 'animo' },
  { id: 'sociable', label: 'Ganas de gente', emoji: '💬', group: 'animo' },
  { id: 'libido', label: 'Libido alta', emoji: '🔥', group: 'cuerpo' },
]

export const SYMPTOMS_BY_ID: Record<string, SymptomDef> = Object.fromEntries(
  SYMPTOMS.map((s) => [s.id, s]),
)
