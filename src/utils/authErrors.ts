const MESSAGES: Record<string, string> = {
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/network-request-failed': 'Problema de conexión. Revisa tu internet.',
}

export function getAuthErrorMessage(code: string): string {
  return MESSAGES[code] ?? 'Ocurrió un error inesperado. Intenta de nuevo.'
}

export function extractAuthErrorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code: unknown }).code)
  }
  return 'unknown'
}
