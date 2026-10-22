import crypto from 'node:crypto'
import { ApiError } from '../utils/ApiError.js'
import { safeCompare } from '../utils/money.js'

const SECRET = process.env.PAYSTACK_SECRET_KEY || ''

// The Paystack API is called with plain fetch, so no SDK dependency is
// needed. All amounts are sent in kobo.
const BASE_URL = 'https://api.paystack.co'

export function paystackConfigured() {
  return Boolean(SECRET)
}

async function call(path, { method = 'GET', body = null } = {}) {
  if (!SECRET) throw new ApiError(503, 'Payments are not configured on this server')

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.status !== true) {
    const message = json.message || 'Payment provider request failed'
    throw new ApiError(502, message)
  }
  return json.data
}

// Creates a transaction and returns the authorization URL the customer is
// redirected to.
export async function initializeTransaction({ email, amountKobo, reference, callbackUrl, metadata = {} }) {
  return call('/transaction/initialize', {
    method: 'POST',
    body: {
      email,
      amount: amountKobo,
      reference,
      currency: 'NGN',
      callback_url: callbackUrl,
      metadata,
    },
  })
}

// Verifies a transaction with Paystack before access is granted. The API is
// the source of truth; the browser redirect is never trusted.
export async function verifyTransaction(reference) {
  return call(`/transaction/verify/${encodeURIComponent(reference)}`)
}

// Verifies the webhook signature Paystack sends in the x-paystack-signature
// header. It is an HMAC-SHA512 of the raw body using the secret key.
export function verifyWebhookSignature(rawBody, signature) {
  if (!SECRET || !signature || !rawBody) return false
  const expected = crypto.createHmac('sha512', SECRET).update(rawBody).digest('hex')
  return safeCompare(expected, signature)
}

// Creates a refund against a previous transaction.
export async function refundTransaction({ transactionReference, amountKobo, reason }) {
  return call('/transaction/refund', {
    method: 'POST',
    body: {
      transaction: transactionReference,
      amount: amountKobo,
      reason: reason || 'Customer request',
    },
  })
}
