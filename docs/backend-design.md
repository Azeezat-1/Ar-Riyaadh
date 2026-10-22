# Ar-Riyaadh Academy — Backend Design

The backend is a **MERN** service: MongoDB, Express, React-ready REST, Node.
It extends the API that already exists without breaking a single endpoint the
public site depends on.

> **Scope rule.** The React frontend is not modified. Every new capability is
> added as new routes; the seven routes the frontend already calls keep their
> exact request and response shapes.

---

## 1. Stack

| Layer | Choice | Why it was already there |
|---|---|---|
| Runtime | Node.js 20+ (ES modules) | The existing server is ESM. |
| HTTP | Express 4.21 | Already used. |
| Database | MongoDB 6+ via Mongoose 8.7 | Already used. |
| Validation | express-validator 7.2 | Already used. |
| Auth | Opaque bearer tokens + `node:crypto` scrypt | No new dependency. |
| Payments | Paystack, called with native `fetch` | No new dependency. |
| Tests | `node:test` + `mongodb-memory-server` | Built-in runner; the memory server removes the need for a local MongoDB. |

**Zero new runtime dependencies** were added to `server/package.json`. The only
addition is `mongodb-memory-server`, which is a dev dependency used by the test
suite.

### Why MERN and not SQL

This was an explicit decision: *"technologies used should be based on what was
used before"*. The original brief (`al-riyadh-academy-prompt (3).md`) specifies
MERN, the existing server is MERN, and the existing models are Mongoose
schemas. MySQL was considered and set aside for later — the data model is
documented in a way that can be ported if that decision is revisited.

---

## 2. Layout

```
server/
  data/seed.js              reference data + admin account + slot calendar
  src/
    app.js                  Express assembly (exported, never self-listen)
    server.js               process entry point
    config/db.js            Mongoose connection helpers
    models/                 28 Mongoose schemas — the data model
    controllers/            request handlers
    routes/                 route tables
    middleware/             auth, validation, audit, error handling
    services/               Paystack integration
    utils/                  money, security, asyncHandler, ApiError
  test/                     node:test suites
```

`api/index.js` (repo root) mounts the same Express app for Vercel's serverless
runtime and lazily connects on first request.

---

## 3. Data model

28 collections. Money is always an **integer number of kobo** in a field whose
name ends in `Kobo`; there is no floating-point money anywhere.

### 3.1 Identity and access

| Collection | Purpose | Key fields |
|---|---|---|
| `User` | Accounts | `email` (unique), `passwordHash` (`select: false`), `roles[]`, `status`, `profile`, `lastLoginAt`, `failedLoginAttempts`, `lockedUntil` |
| `Session` | Live access tokens | `userId`, `tokenHash` (unique, TTL), `expiresAt`, `ip`, `userAgent` |
| `RefreshToken` | Refresh token families | `userId`, `familyId`, `tokenHash` (unique, TTL), `revokedAt`, `replacedBy` |

`roles` is an embedded array, not a join table: `student`, `customer`, `admin`.
`admin` is **never** assignable through a public endpoint — registration
always forces `['student']`.

### 3.2 Content (public, read-only to the site)

| Collection | Purpose | Key fields |
|---|---|---|
| `Class` | A learning product | `title`, `slug` (unique, sparse), `category`, `subjectId`, `description`, `accessType` (`free`/`paid`), `deliveryMode` (`live`/`recorded`/`hybrid`), `priceKobo`, `capacity`, `durationWeeks`, `startDate`, `enrollmentDeadline`, `telegramChannel`, `featured`, `displayOrder` |
| `Lecture` | A scheduled session | `title`, `classId`, `sessionNumber`, `startsAt`, `durationMinutes`, `isRecorded`, `recordingUrl`, `status`, `displayOrder` |
| `Lesson` | A unit inside a class | `classId`, `title`, `order`, `durationMinutes`, `isPreview` |
| `ClassSession` | A live meeting of a class | `classId`, `startsAt`, `endsAt`, `meetingUrl`, `status` |
| `Subject` | A topic taxonomy | `name`, `slug` (unique), `description`, `icon`, `displayOrder` |
| `Testimonial` | Social proof | `name`, `content`, `category`, `rating`, `approved`, `userId`, `displayOrder` |
| `HomeschoolingArticle` | Long-form writing | `title`, `slug` (unique), `excerpt`, `content`, `status`, `tags[]`, `publishedAt`, `viewCount` |
| `ContactMessage` | Contact form | `name`, `email`, `phone`, `message`, `status`, `priority`, `reply`, `repliedAt` |

`accessType` and `deliveryMode` are **independent axes**. A class can be free
and live, paid and recorded, and so on. The frontend shows both.

### 3.3 Commerce

| Collection | Purpose | Key fields |
|---|---|---|
| `Service` | A bookable appointment (e.g. Hijaamah) | `title`, `slug` (unique), `category`, `durationMinutes`, `priceKobo`, `capacityPerSlot`, `requiresHealthForm`, `preparationNotes`, `location`, `active` |
| `ServiceSlot` | A bookable window | `serviceId`, `startsAt`, `endsAt`, `capacity`, `bookedCount`, `status` |
| `Booking` | A reserved slot | `reference` (unique), `userId`, `serviceId`, `slotId`, `status`, `amountKobo`, `healthForm` (embedded), `statusHistory` (embedded), `orderId` |
| `Enrollment` | A student in a class | `userId`, `classId`, `status`, `progress` (Map of lessonId→Boolean), `orderId`, `startedAt`, `completedAt` |
| `EnrollmentTransfer` | Audit trail for a class move | `enrollmentId`, `fromClassId`, `toClassId`, `reason`, `movedBy` |
| `Consultation` | A question thread | `reference` (unique), `userId`, `guestName/Email/Phone`, `subject`, `category`, `priority`, `status`, `priceKobo`, `assignedTo`, `responseDueAt`, `firstResponseAt` |
| `ConsultationMessage` | A message in a thread | `consultationId`, `author` (`customer`/`agent`), `body`, `channel`, `readAt` |
| `Order` | A priced basket | `reference` (unique), `userId`, `orderType`, `classId`/`bookingId`/`consultationId`, `amountKobo`, `discountKobo`, `taxKobo`, `totalKobo`, `refundedKobo`, `currency`, `status`, `couponCode`, `paystackReference`, `paidAt` |
| `PaymentEvent` | Every webhook delivery | `providerEventId` (unique), `event`, `orderReference`, `amountKobo`, `currency`, `status`, `payload` |
| `Refund` | A refund record | `orderId`, `providerReference`, `amountKobo`, `reason`, `status`, `processedBy`, `processedAt` |
| `Coupon` | A discount | `code` (unique), `percentOff`, `valueKobo`, `minAmountKobo`, `startsAt`, `endsAt`, `maxRedemptions`, `redemptionCount`, `active` |
| `CouponRedemption` | One coupon use | `couponId`, `userId`, `orderId`, `amountKobo` |

### 3.4 Operations

| Collection | Purpose | Key fields |
|---|---|---|
| `Notification` | In-app messages | `userId`, `type`, `title`, `body`, `readAt` |
| `AuditLog` | Who did what | `actor`, `action`, `entity`, `entityId`, `ip`, `userAgent`, `changes` |
| `Setting` | Editable configuration | `key` (unique), `value`, `description` |
| `OutboxMessage` | Queued outbound messages | `channel`, `to`, `template`, `payload`, `status`, `attempts` |

### 3.5 Indexes that carry the load

| Index | Why |
|---|---|
| `User.email` unique | Login lookup + duplicate prevention. |
| `Session.tokenHash` unique + TTL | Opaque token lookup; MongoDB expires the document. |
| `RefreshToken.tokenHash` unique + TTL | Same, for refresh tokens. |
| `Enrollment {userId, classId}` unique | One active enrolment per student per class. |
| `ServiceSlot {serviceId, startsAt}` | The slot calendar query. |
| `PaymentEvent.providerEventId` unique | Webhook idempotency. |
| `Order.reference`, `Booking.reference`, `Consultation.reference` unique | Human-quotable references. |
| `HomeschoolingArticle.slug` unique | The frontend fetches articles by slug. |

---

## 4. Authentication

There is no JWT library. Tokens are **opaque random strings**; only their
SHA-256 hash is stored, so a database leak cannot be replayed against the API.

### 4.1 Passwords

`node:crypto` scrypt, format `scrypt$<salt b64>$<hash b64>`, 64-byte output,
16-byte random salt. Verification uses `crypto.timingSafeEqual`.

```
POST /api/auth/register  ->  { data: user, x-access-token, x-refresh-token }
POST /api/auth/login     ->  { data: user, x-access-token, x-refresh-token }
```

Tokens are returned in the `x-access-token` / `x-refresh-token` response
headers **and** in the body, so a browser client can use either. The frontend
does not use them yet — it has no login page.

### 4.2 Sessions

- **Access token**: 15 minutes, stored as a `Session` document.
- **Refresh token**: 30 days, stored as a `RefreshToken` document with a
  `familyId`.
- Refresh rotates: using a refresh token issues a new one and revokes the old.
- **Reuse detection**: if a refresh token that was already rotated is
  presented again, the entire family is revoked. This is the standard
  response to a stolen token.
- Changing the password revokes every session belonging to the account.

### 4.3 Guards

| Middleware | Effect |
|---|---|
| `requireAuth` | 401 unless a valid access token is present. |
| `optionalAuth` | Attaches the user when a token is present; never rejects. |
| `requireRole('admin')` | 403 unless the user holds the role. |
| `requireSelfOrRole(param)` | The owner passes, plus any admin. |
| `validObjectId` | 400 for a malformed id. |

### 4.4 Roles and the seeded admin

`npm run seed` creates one admin from `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` (never hard-coded in the repository). Everyone else
starts as `student`.

---

## 5. Payments

Paystack is the provider. Flow:

```
client                api                     MongoDB            Paystack
  |  POST /payments/orders      ->            Order (pending)
  |  POST /payments/initialize  ->            Order.paystackReference
  |                                                     |
  |  <----- authorization_url -------------------------  |
  |  (user pays on Paystack)                             |
  |                                       <---- webhook --+
  |                                     PaymentEvent (unique id)
  |                                     verify with Paystack API
  |                                     Order -> paid, Enrollment/Booking activated
```

### 5.1 Webhook security

1. The raw request body is captured before the JSON parser rewrites it
   (`express.json({ verify })` → `req.rawBody`).
2. The signature is `HMAC-SHA512(rawBody, PAYSTACK_WEBHOOK_SECRET)`, compared
   with `timingSafeEqual`.
3. The body is only parsed *after* the signature passes.

### 5.2 Idempotency

`PaymentEvent.providerEventId` has a unique index. A replayed delivery fails to
insert with error code `11000`, and the handler answers `{"received": true,
"duplicate": true}` so Paystack stops retrying.

### 5.3 The webhook is not trusted blindly

After accepting the delivery, the API calls Paystack's verify endpoint itself.
Only a confirmed `success` with a matching amount marks the order paid. A
mismatched amount marks the order `failed` and grants nothing.

### 5.4 Amounts

`amountKobo` → Paystack's `amount` is kobo, so no conversion happens. Amounts
are compared with `===` on integers.

---

## 6. Concurrency

MongoDB is not a relational database and multi-document transactions need a
replica set, which a standalone local `mongod` does not provide. The design
therefore leans on **single-document atomicity** instead of transactions.

**Slot overselling** is prevented with one conditional atomic update:

```js
await ServiceSlot.findOneAndUpdate(
  { _id: slotId, $expr: { $lt: ['$bookedCount', '$capacity'] } },
  { $inc: { bookedCount: 1 } },
  { new: true }
)
```

If the slot is full the filter matches nothing and the caller gets a 409. Two
concurrent bookings can never take the last place.

**Enrolment uniqueness** is enforced by the unique index on
`{userId, classId}` rather than a check-then-insert, so two simultaneous
requests cannot both succeed.

**Payment activation** is idempotent: the order status moves to `paid` and the
enrolment/booking is activated with an upsert keyed on the same unique index.

---

## 7. Security

### 7.1 What was wrong before this work

The original API exposed `POST`, `PUT` and `DELETE` on `/api/classes`,
`/api/lectures` and `/api/homeschooling` with **no authentication at all**.
Anyone who could reach the server could rewrite or delete the academy's
content. The frontend never calls these, so gating them breaks nothing.

### 7.2 What is in place now

| Control | Implementation |
|---|---|
| Admin-only writes | `requireAuth` + `requireRole('admin')` on every content mutation. |
| Public submissions | `POST /api/testimonials` and `POST /api/contact` stay public, rate-limited to 5/hour. New testimonials are `approved: false` until an admin approves them. |
| Password storage | scrypt with a per-user salt. |
| Token storage | Only SHA-256 hashes, with TTL indexes. |
| Brute force | `POST /api/auth/login` and `/register` are limited to 20 per 15 minutes. |
| Broad limit | 300 requests per minute across `/api`. |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` (in production). |
| CORS | Explicit allow-list from `CORS_ORIGINS`. |
| Webhook authenticity | HMAC-SHA512 signature over the raw body. |
| Error leakage | The error handler never returns a stack trace outside development. |
| Audit trail | `AuditLog` records sign-ins, role changes and administrative actions. |

### 7.3 Rate limiting

The limiter is a fixed-window counter in memory keyed by IP. It is a single
process map, so it is correct for one instance; a horizontally scaled
deployment needs Redis. The limiter is disabled when `NODE_ENV=test` so the
suite can exercise the same endpoints repeatedly.

---

## 8. Public API compatibility

The frontend (`frontend/src/api/client.js`) reads `res.data.data` for every
list endpoint and `res.data` for single records. The following contract is
frozen and covered by `server/test/api.test.mjs`:

| Method | Path | Response |
|---|---|---|
| GET | `/api/classes` | `{ count, data }` |
| GET | `/api/lectures` | `{ count, data }` |
| GET | `/api/testimonials` | `{ count, data }` — only `approved` items |
| GET | `/api/homeschooling` | `{ count, data }` — no `content` field |
| GET | `/api/homeschooling/slug/:slug` | `{ data }` |
| POST | `/api/contact` | `{ message }` |
| POST | `/api/testimonials` | `{ data }` |

Errors are always `{ message, details? }`, where `details` is an array of
`{ field, message, value }`.

### 8.1 Unicode

The category filter uses `Qurʼān` — U+02BC (modifier letter apostrophe)
followed by U+0101 (a with macron). The frontend writes it as a `\u02bc`
escape, the backend as a literal; both are the same characters. A test in
`server/test/seed.test.mjs` decodes the frontend's escapes and asserts the two
match, so the filter cannot silently stop working.

---

## 9. Testing

```bash
cd server
npm test          # 57 tests
```

`mongodb-memory-server` starts a real MongoDB in memory, so **no local MongoDB
installation is needed** to run the suite. Set `MONGODB_URI_TEST` to run
against a real server instead (useful in CI).

| Suite | Covers |
|---|---|
| `api.test.mjs` | The frozen public contract: envelopes, validation, authorisation, slugs, approval flow. |
| `dashboard.test.mjs` | Accounts, sessions, enrolment, booking, consultation, admin, orders, coupons, webhook signature. |
| `seed.test.mjs` | The seed's content, reference data, admin account, slot calendar, idempotency, Unicode. |
| `routes.test.mjs` | Route shadowing, and that every documented and frontend-called endpoint exists. |

### 9.1 Two more checks

```bash
cd server
npm run validate   # the data model and the docs agree with the code
npm run smoke      # MongoDB -> seed -> API -> Vite proxy, end to end
```

`npm run validate` (`scripts/validate_models.py`) reads the live schemas and
routes and fails if a money field is not a `*Kobo` integer, a `ref` points at
nothing, a unique field has no unique index, a collection has no index, a
documented endpoint does not exist, or the frontend calls an endpoint that does
not exist.

`npm run smoke` (`scripts/smoke.mjs`) boots the whole stack — a real MongoDB,
the seed, the API and the Vite dev server — and checks the responses over HTTP,
including the path the browser actually takes through the Vite proxy.

### 9.2 Running it by hand

There is no MongoDB installed on this machine, but `npm test` has already
downloaded a `mongod` binary. `npm run dev:mongo` runs it as a normal
persistent server:

```bash
# terminal 1
cd server && npm run dev:mongo
# -> MONGODB_URI=mongodb://127.0.0.1:27017/ar-riyadh

# terminal 2
cd server
MONGODB_URI=mongodb://127.0.0.1:27017/ar-riyadh npm run seed
MONGODB_URI=mongodb://127.0.0.1:27017/ar-riyadh npm start

# terminal 3
cd frontend && npm run dev   # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:4000`, so the
frontend talks to the API without any CORS setup.

---

## 10. Deployment

`render.yaml`, `vercel.json` and `netlify.toml` at the repo root already
describe the deployments. The API needs:

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB Atlas connection string. |
| `CORS_ORIGINS` | yes | Comma-separated list of allowed origins. |
| `PORT` | no | Defaults to `4000`. |
| `NODE_ENV` | yes | `production` in deployed environments. |
| `PAYSTACK_SECRET_KEY` | for payments | Live secret key. |
| `PAYSTACK_WEBHOOK_SECRET` | for payments | From the Paystack dashboard. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | for seeding | Never committed. |

---

## 11. Known limitations

1. **No email or SMS delivery.** `OutboxMessage` and `Notification` are
   written, but nothing sends them yet. An email provider is the next
   integration.
2. **The frontend has no auth UI.** The API supports sign-in; the site does
   not offer it. Dashboards are therefore backend-first.
3. **The rate limiter is per-process.** Move it to Redis before running more
   than one instance.
4. **No multi-document transactions.** The design avoids needing them, but a
   workflow that must touch several collections atomically would need a
   replica set.
5. **The currency is NGN only.** The `currency` field exists on every money
   document so a second currency can be added without a migration.
