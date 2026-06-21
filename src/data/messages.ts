export function bigExpenseMessage(): string {
  return '🐜 Ese gasto venía con ejército incluido.'
}

export function queenMessage(categoryLabel: string): string {
  return `👑 La Reina ${categoryLabel} está gobernando la colonia.`
}

export function bossWeakenedMessage(): string {
  return '⚔️ El jefe está debilitado. Sigue atacando.'
}

export function netWorthGrowingMessage(): string {
  return '💰 Tu reino financiero está creciendo.'
}

export function walletCriticalMessage(): string {
  return '🚨 La colonia está tomando el control.'
}

export function goalCompletedMessage(title: string): string {
  return `🚀 ¡Misión cumplida! "${title}" está completa.`
}

export function levelUpMessage(level: number): string {
  return `✨ ¡Subiste a nivel ${level}!`
}
