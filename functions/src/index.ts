import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret, defineString } from 'firebase-functions/params'
import { logger } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import OpenAI from 'openai'

initializeApp()

const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY')
// Adjust to whatever economical model your OpenAI account has access to.
const OPENAI_MODEL = defineString('OPENAI_MODEL', { default: 'gpt-4o-mini' })

// Kept in sync with src/config/admin.ts on the frontend.
const ADMIN_EMAIL = 'alvarolucascc96@gmail.com'

type InsightType = 'warning' | 'success' | 'achievement' | 'motivation' | 'strategy'

interface FinancialSnapshot {
  netWorth: number
  totalAssets: number
  totalDebt: number
  monthlyAntExpenses: number
  monthlyBudget: number
  queenCategory: string | null
  queenAmount: number
  mainBossName: string | null
  bossHealth: number
  level: number
  xp: number
  completedGoals: number
  completedBosses: number
}

interface AIInsightPayload {
  type: InsightType
  title: string
  message: string
  triggerEvent?: string
}

const VALID_TYPES: InsightType[] = ['warning', 'success', 'achievement', 'motivation', 'strategy']

const SYSTEM_PROMPT = `Eres AntAI Advisor.
Eres el consejero financiero oficial de ANTWallet, un RPG financiero gamificado.
Observas la evolución del jugador a través de un resumen de su reino financiero.
Hablas como un narrador RPG financiero: inteligente, motivador y entretenido.
Analizas únicamente la información entregada en el snapshot. Nunca inventes números que no te dieron.
Nunca hagas recomendaciones de inversión. Nunca entregues consejos financieros profesionales o legales.
Genera mensajes breves, máximo 80 palabras en el campo "message".
Utiliza conceptos como: Reina Hormiga, colonia, reino financiero, jefes de deuda, nivel, patrimonio, billetera.
Responde EXCLUSIVAMENTE con un objeto JSON con esta forma exacta, sin texto adicional:
{"type": "warning|success|achievement|motivation|strategy", "title": "...", "message": "...", "triggerEvent": "..."}
El campo "triggerEvent" debe repetir el eventType recibido si fue entregado, o ser un string vacío si no.`

const FALLBACK_MESSAGES: AIInsightPayload[] = [
  {
    type: 'warning',
    title: 'El oráculo está descansando',
    message: 'AntAI no pudo consultar los archivos del reino en este momento. Intenta de nuevo en unos minutos.',
  },
  {
    type: 'warning',
    title: 'Consejo real no disponible',
    message: 'El consejero financiero está fuera de la sala del trono. Tu progreso sigue guardado, solo el análisis falló.',
  },
  {
    type: 'warning',
    title: 'AntAI no pudo consultar los archivos del reino',
    message: 'Hubo un problema de conexión con el oráculo. Vuelve a intentarlo más tarde.',
  },
]

function pickFallback(): AIInsightPayload {
  return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)]
}

function isValidSnapshot(value: unknown): value is FinancialSnapshot {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.netWorth === 'number' &&
    typeof s.totalAssets === 'number' &&
    typeof s.totalDebt === 'number' &&
    typeof s.monthlyAntExpenses === 'number' &&
    typeof s.monthlyBudget === 'number' &&
    typeof s.bossHealth === 'number' &&
    typeof s.level === 'number' &&
    typeof s.xp === 'number' &&
    typeof s.completedGoals === 'number' &&
    typeof s.completedBosses === 'number'
  )
}

async function isUserAllowed(email: string | undefined): Promise<boolean> {
  if (!email) return false
  const normalized = email.toLowerCase()
  if (normalized === ADMIN_EMAIL.toLowerCase()) return true

  const doc = await getFirestore().collection('allowedUsers').doc(normalized).get()
  return doc.exists && doc.data()?.active === true
}

function parseInsight(raw: string): AIInsightPayload | null {
  try {
    const parsed = JSON.parse(raw) as Partial<AIInsightPayload>
    if (
      typeof parsed.title === 'string' &&
      typeof parsed.message === 'string' &&
      typeof parsed.type === 'string' &&
      VALID_TYPES.includes(parsed.type as InsightType)
    ) {
      return {
        type: parsed.type as InsightType,
        title: parsed.title.slice(0, 120),
        message: parsed.message.slice(0, 600),
        triggerEvent: typeof parsed.triggerEvent === 'string' ? parsed.triggerEvent : undefined,
      }
    }
    return null
  } catch {
    return null
  }
}

export const generateFinancialInsight = onCall(
  { secrets: [OPENAI_API_KEY], region: 'us-central1', cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debes iniciar sesión para consultar a AntAI.')
    }

    const allowed = await isUserAllowed(request.auth.token.email as string | undefined)
    if (!allowed) {
      throw new HttpsError('permission-denied', 'Tu cuenta no tiene acceso a ANTWallet.')
    }

    const { snapshot, eventType } = (request.data ?? {}) as { snapshot?: unknown; eventType?: string }

    if (!isValidSnapshot(snapshot)) {
      throw new HttpsError('invalid-argument', 'El snapshot financiero es inválido o está incompleto.')
    }

    const userPrompt = JSON.stringify({ snapshot, eventType: eventType ?? null })

    let payload: AIInsightPayload | null = null

    try {
      const client = new OpenAI({ apiKey: OPENAI_API_KEY.value() })
      const completion = await client.chat.completions.create({
        model: OPENAI_MODEL.value(),
        response_format: { type: 'json_object' },
        max_tokens: 300,
        temperature: 0.8,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      })

      const raw = completion.choices[0]?.message?.content
      payload = raw ? parseInsight(raw) : null
    } catch (error) {
      logger.error('AntAI OpenAI call failed', error)
    }

    if (!payload) {
      payload = { ...pickFallback(), triggerEvent: eventType }
    }

    return {
      id: globalThis.crypto.randomUUID(),
      type: payload.type,
      title: payload.title,
      message: payload.message,
      triggerEvent: payload.triggerEvent || eventType || undefined,
      generatedAt: new Date().toISOString(),
    }
  },
)
