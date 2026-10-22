import crypto from 'node:crypto'

// Every monetary amount in the system is stored and passed around as an
// integer number of kobo (1 naira = 100 kobo). Floating point never touches
// a price, so a total can never be off by a fraction of a naira.
export const KIBO_PER_NAIRA = 100

// Accepts a number of naira (25000) or a string ('25000.50') and returns
// integer kobo. Anything unparsable becomes 0 rather than NaN.
export function toKobo(naira) {
  const value = typeof naira === 'string' ? Number(naira.trim()) : naira
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.round(value * KIBO_PER_NAIRA)
}

// Converts kobo back to a naira number for display.
export function toNaira(kobo) {
  if (typeof kobo !== 'number' || !Number.isFinite(kobo)) return 0
  return kobo / KIBO_PER_NAIRA
}

// Formats kobo as a plain currency string, e.g. 2500000 -> "25,000.00".
export function formatNaira(kobo) {
  return toNaira(kobo).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Human readable reference such as "ENR-7F3K2Q".
export function makeReference(prefix) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.randomBytes(6)
  let out = ''
  for (const byte of bytes) out += alphabet[byte % alphabet.length]
  return `${prefix}-${out}`
}

// URL safe random token used for session and refresh tokens.
export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url')
}

// SHA-256 hash of a token. Only the hash is stored in the database.
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Constant-time comparison for webhook signatures.
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}
