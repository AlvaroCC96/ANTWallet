import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'
import type { AIInsight, FinancialSnapshot } from '../types/ai'

interface GenerateInsightRequest {
  snapshot: FinancialSnapshot
  eventType?: string
}

const callGenerateInsight = httpsCallable<GenerateInsightRequest, AIInsight>(functions, 'generateFinancialInsight')

const LOCAL_FALLBACKS: Omit<AIInsight, 'id' | 'generatedAt' | 'triggerEvent'>[] = [
  {
    type: 'warning',
    title: 'AntAI no pudo consultar los archivos del reino',
    message: 'Hubo un problema de conexión con el oráculo financiero. Tus datos están a salvo, solo el consejo falló.',
  },
  {
    type: 'warning',
    title: 'El oráculo está descansando',
    message: 'AntAI no respondió a tiempo. Intenta generar el consejo de nuevo en unos momentos.',
  },
  {
    type: 'warning',
    title: 'El consejo real no está disponible',
    message: 'No se pudo contactar al consejero del reino. Tu progreso financiero sigue intacto.',
  },
]

function buildLocalFallback(eventType?: string): AIInsight {
  const base = LOCAL_FALLBACKS[Math.floor(Math.random() * LOCAL_FALLBACKS.length)]
  return {
    ...base,
    id: `local-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    triggerEvent: eventType,
  }
}

export async function generateFinancialInsight(snapshot: FinancialSnapshot, eventType?: string): Promise<AIInsight> {
  try {
    const result = await callGenerateInsight({ snapshot, eventType })
    return result.data
  } catch (error) {
    console.error('AntAI Advisor call failed', error)
    return buildLocalFallback(eventType)
  }
}
