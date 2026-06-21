export const ADMIN_EMAIL = 'alvarolucascc96@gmail.com'

export function isAdminEmail(email: string | null | undefined): boolean {
  return (email ?? '').toLowerCase() === ADMIN_EMAIL.toLowerCase()
}
