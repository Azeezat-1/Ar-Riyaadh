# Ar-Riyaadh Academy — API Contract

Base URL: `https://<host>/api`

Every response is JSON. There is no `/v1` prefix.

---

## 1. Conventions

### 1.1 Envelopes

| Shape | Used for |
|---|---|
| `{ count, data }` | List endpoints. `count` is the number of items in `data`. |
| `{ data }` | Single-record endpoints. |
| `{ message, data }` | Mutations that also return the affected record. |
| `{ message }` | Mutations with nothing to return. |

### 1.2 Errors

```json
{
  "message": "Validation failed",
  "details": [
    { "field": "email", "message": "Please provide a valid email address", "value": "nope" }
  ]
}
```

`details` is present only for validation failures.

### 1.3 Status codes

| Code | Meaning |
|---|---|
| 200 | Success. |
| 201 | Created. |
| 204 | Deleted, no body. |
| 400 | Validation failed, or the request conflicts with the current state. |
| 401 | Missing, invalid or expired token. |
| 402 | Payment required (a paid class joined without paying). |
| 403 | Signed in, but not allowed. |
| 404 | Not found. |
| 409 | Conflict — duplicate, or a race was lost. |
| 429 | Rate limited. |
| 500 | Server error. |

### 1.4 Authentication

Send the access token as a bearer token:

```
Authorization: Bearer <access-token>
```

`POST /api/auth/login` and `POST /api/auth/register` return the tokens in
**both** the response body and the `x-access-token` / `x-refresh-token`
headers.

### 1.5 Rate limits

| Scope | Limit |
|---|---|
| All of `/api` | 300 requests / minute / IP |
| `POST /api/auth/login`, `POST /api/auth/register` | 20 / 15 minutes / IP |
| `POST /api/consultations` | 10 / hour / IP |
| `POST /api/contact`, `POST /api/testimonials` | 5 / hour / IP |

---

## 2. Public content — frozen contract

These endpoints are consumed by the existing frontend. Their shapes must not
change.

### `GET /api/classes`

Returns the published classes.

```json
{
  "count": 5,
  "data": [
    {
      "_id": "…",
      "title": "Qurʼān Recitation & Tajweed",
      "category": "Qurʼān",
      "icon": "book-quran",
      "description": "…",
      "audience": "Teenage girls • Adult women • Mothers",
      "focus": ["Tajwēd foundations", "Fluency in recitation"],
      "schedule": "Live and self-paced options available.",
      "link": "https://t.me/ArRiyadhAcademy",
      "slug": "quran-recitation-tajweed",
      "accessType": "free",
      "deliveryMode": "hybrid",
      "priceKobo": 0,
      "featured": false,
      "displayOrder": 1,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

### `GET /api/classes/:id`

`{ data }` for one class. A malformed id returns `400 Invalid identifier
format`.

### `GET /api/lectures`

`{ count, data }` — scheduled lectures with `title`, `description`, `topic`,
`tags`, `schedule`, `audience`, `status`, `accessLink`.

### `GET /api/lectures/:id`

`{ data }` for one lecture.

### `GET /api/testimonials`

`{ count, data }` — **only approved testimonials** are returned.

### `POST /api/testimonials`

Public. A new testimonial is stored with `approved: false` and is not visible
until an admin approves it.

Request:

```json
{ "name": "Aisha", "content": "…", "category": "Hadith", "rating": 5 }
```

Response: `201 { data }`.

### `GET /api/homeschooling`

`{ count, data }` — published articles. The list **omits** `content` for
performance; fetch the full article by slug.

### `GET /api/homeschooling/slug/:slug`

`{ data }` — the full article.

### `POST /api/contact`

Public. `201 { message }` on success.

Request:

```json
{ "name": "Amina", "email": "amina@example.com", "phone": "+234…", "message": "…" }
```

### `GET /api/health`

`200 { "status": "ok" }`.

---

## 3. Admin content management

All require an **admin** access token.

| Method | Path | Notes |
|---|---|---|
| POST | `/api/classes` | Creates a class. `slug` is generated from the title when omitted. |
| PUT | `/api/classes/:id` | Updates a class. |
| DELETE | `/api/classes/:id` | `204`. |
| POST | `/api/lectures` | Creates a lecture. `status` defaults to `Upcoming`. |
| PUT | `/api/lectures/:id` | Updates a lecture. |
| DELETE | `/api/lectures/:id` | `204`. |
| POST | `/api/homeschooling` | Creates an article. A duplicate slug returns `409`. |
| PUT | `/api/homeschooling/:id` | Updates an article. |
| DELETE | `/api/homeschooling/:id` | `204`. |
| DELETE | `/api/testimonials/:id` | Removes a testimonial. `204`. |

---

## 4. Accounts — `/api/auth`

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | — | Creates a `student`. `roles` in the body are ignored. |
| POST | `/api/auth/login` | — | Returns tokens. |
| POST | `/api/auth/refresh` | — | Rotates the refresh token. |
| POST | `/api/auth/logout` | — | Revokes the presented refresh token. |
| GET | `/api/auth/me` | token | The signed-in user. |
| PATCH | `/api/auth/me` | token | Updates `name`, `phone`, `telegramChatId`, `profile`. |
| POST | `/api/auth/change-password` | token | Revokes every other session. |
| POST | `/api/auth/admin/users` | admin | Creates a user with explicit roles. |

### `POST /api/auth/register`

```json
{ "email": "student@example.com", "password": "at-least-8-chars", "name": "Student", "phone": "+234…" }
```

Response `201`:

```json
{
  "data": {
    "_id": "…",
    "email": "student@example.com",
    "name": "Student",
    "roles": ["student"],
    "status": "active",
    "emailVerified": false
  }
}
```

`passwordHash` is never included in any response.

Errors: `400` validation, `409` the email is already registered.

### `POST /api/auth/login`

```json
{ "email": "student@example.com", "password": "at-least-8-chars" }
```

Response `200 { data: user }` plus the `x-access-token` and `x-refresh-token`
headers. A wrong email or password gives `401 Invalid email or password` —
the same message either way, so the endpoint cannot be used to discover which
addresses are registered.

### `POST /api/auth/refresh`

```json
{ "refreshToken": "…" }
```

Response `200 { data: { refreshToken: "<new>" } }`. The previous refresh token
is revoked. **Presenting an already-rotated token revokes the entire family**
and returns `401`.

### `POST /api/auth/change-password`

```json
{ "currentPassword": "…", "newPassword": "…" }
```

Response `200 { message }`. Every existing session is revoked, so the caller
must sign in again.

---

## 5. My account — `/api/me`

All require an access token.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/me` | Overview: `user`, `stats`, `enrollments`, `bookings`, `consultations`, `orders`. |
| GET | `/api/me/notifications` | `{ count, data }`, newest first, max 50. |
| POST | `/api/me/notifications/read-all` | Marks every unread notification read. |
| POST | `/api/me/notifications/:id/read` | Marks one notification read. |

```json
{
  "data": {
    "user": { "_id": "…", "email": "…", "name": "…", "roles": ["student"] },
    "stats": {
      "enrollments": 2, "activeEnrollments": 1, "bookings": 1,
      "consultations": 0, "orders": 2, "unreadNotifications": 0
    },
    "enrollments": [], "bookings": [], "consultations": [], "orders": []
  }
}
```

---

## 6. Enrolments — `/api/enrollments`

All require an access token.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/enrollments` | The caller's enrolments. |
| POST | `/api/enrollments` | Joins a **free** class. |
| GET | `/api/enrollments/:id` | The owner or an admin. |
| GET | `/api/enrollments/:id/lessons` | Lessons with a `completed` flag. |
| GET | `/api/enrollments/:id/sessions` | Live sessions for the class. |
| PATCH | `/api/enrollments/:id/progress` | Marks a lesson complete. |

### `POST /api/enrollments`

```json
{ "classId": "…" }
```

Response `201 { message: "Enrolled", data: enrollment }`.

- A paid class returns `402 This class requires payment. Create an order and
  complete payment first.` — pay first, then the webhook activates the
  enrolment.
- Enrolling twice returns `409 You are already enrolled in this class`.

### `PATCH /api/enrollments/:id/progress`

```json
{ "lessonId": "…", "completed": true }
```

The server recomputes `lessonsCompleted` and `progressPercent` from the
published lessons of that class. At 100% the enrolment becomes `completed`.

---

## 7. Services and bookings

### `GET /api/services`

Public. `{ count, data }` — active services.

### `GET /api/services/:id`

Public. `{ data }`.

### `GET /api/services/:id/slots`

Public. `{ count, data }` — future slots for the service.

### `POST /api/bookings`

Requires a token.

```json
{
  "serviceId": "…",
  "slotId": "…",
  "notes": "optional",
  "healthForm": {
    "consentGiven": true,
    "conditions": ["None"],
    "bloodPressure": "120/80"
  }
}
```

Response `201 { message: "Booking created", data: booking }`, status `pending`.

- A service with `requiresHealthForm: true` returns `400` unless
  `healthForm.consentGiven` is `true`.
- A full slot returns `409 That slot has just been taken. Please choose
  another.` — the reservation is atomic, so two simultaneous requests cannot
  oversell.
- A slot in the past returns `400`.

### `GET /api/bookings/mine` · `GET /api/bookings/:id`

The caller's bookings, or one booking they own.

### `POST /api/bookings/:id/cancel`

Cancels the booking and returns the place to the slot.

### Admin booking management

| Method | Path | Notes |
|---|---|---|
| GET | `/api/services/admin/list` | Every service, active or not. |
| POST | `/api/services/admin` | Creates a service. |
| PUT | `/api/services/admin/:id` | Updates a service. |
| DELETE | `/api/services/admin/:id` | Removes a service. |
| POST | `/api/services/admin/:id/slots` | Adds slots to the calendar. |
| PATCH | `/api/bookings/admin/:id/status` | Moves a booking through its statuses. |
| POST | `/api/bookings/admin/:id/health-review` | Clears or rejects the health form. |

---

## 8. Consultations — `/api/consultations`

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/consultations` | optional | Open to guests and signed-in users. |
| GET | `/api/consultations` | token | The caller's threads. |
| GET | `/api/consultations/:id` | token | The owner or an admin. |
| POST | `/api/consultations/:id/messages` | token | Adds a message. |
| GET | `/api/consultations/admin/all` | admin | Every thread, filterable. |
| GET | `/api/consultations/admin/workload` | admin | Open threads per agent. |
| PATCH | `/api/consultations/admin/:id` | admin | Status, assignment, resolution. |

### `POST /api/consultations`

```json
{
  "subject": "Question about the Arabic class",
  "message": "I would like to know the next intake schedule.",
  "guestName": "Guest",
  "guestEmail": "guest@example.com",
  "guestPhone": "+234…",
  "category": "general",
  "priority": "normal",
  "preferredChannel": "portal"
}
```

`priority` is `low` | `normal` | `high` | `urgent` and sets `responseDueAt`.
`preferredChannel` is `portal` | `email` | `phone` | `whatsapp`.

A signed-in user's name and email are taken from their account; the `guest*`
fields are only used when there is no token. An email address is required
either way.

Response `201 { message: "Consultation received", data: consultation }`.

### `POST /api/consultations/:id/messages`

```json
{ "body": "Any update?" }
```

Response `201 { message, data: message }`. `author` is `customer` or `agent`.
An agent's first message stamps `firstResponseAt` on the consultation.

---

## 9. Payments — `/api/payments`

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/payments/orders` | token | Creates an order. |
| POST | `/api/payments/initialize` | token | Starts a Paystack transaction. |
| POST | `/api/payments/verify` | token | Polls an order's status. |
| POST | `/api/payments/webhook` | signature | Called by Paystack. |
| POST | `/api/payments/refunds` | admin | Refunds a paid order. |

### `POST /api/payments/orders`

```json
{
  "orderType": "course_enrollment",
  "classId": "…",
  "bookingId": "…",
  "consultationId": "…",
  "couponCode": "WELCOME10"
}
```

`orderType` is `course_enrollment` | `service_booking` | `consultation`. Supply
the id that matches the type.

Response `201 { message: "Order created", data: order }`:

```json
{
  "reference": "ORD-…",
  "amountKobo": 1500000,
  "discountKobo": 150000,
  "taxKobo": 0,
  "totalKobo": 1350000,
  "refundedKobo": 0,
  "currency": "NGN",
  "status": "pending"
}
```

All amounts are **kobo**. `1500000` kobo is ₦15,000.

An unknown or unusable coupon returns `400`.

### `POST /api/payments/initialize`

```json
{ "orderReference": "ORD-…", "email": "payer@example.com", "callbackUrl": "https://…" }
```

Response `200 { data: { authorizationUrl, accessCode, reference, amountKobo } }`.
Redirect the browser to `authorizationUrl`.

### `POST /api/payments/webhook`

Called by Paystack. It must carry a valid `x-paystack-signature`; otherwise
`401 Invalid webhook signature`. The raw body is required for the HMAC, so
this endpoint must not be proxied through anything that rewrites the body.

A replayed delivery returns `200 { "received": true, "duplicate": true }`.

### `POST /api/payments/refunds`

```json
{ "orderId": "…", "amountKobo": 500000, "reason": "Student withdrew" }
```

The amount must not exceed the remaining paid amount.

---

## 10. Admin — `/api/admin`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/admin/dashboard` | Aggregate counters and revenue. |
| GET | `/api/admin/users` | Paginated user list. |
| PATCH | `/api/admin/users/:id` | Changes `roles` or `status`. An unknown role returns `400`. |
| GET | `/api/admin/classes` | Every class. |
| PUT | `/api/admin/classes/:id` | Updates a class. |
| GET | `/api/admin/enrollments` | Every enrolment, filterable. |
| GET | `/api/admin/orders` | Every order, filterable. |
| GET | `/api/admin/audit-logs` | The audit trail. |
| POST | `/api/admin/enrollments/:id/transfer` | Moves a student between classes. |

### `GET /api/admin/dashboard`

```json
{
  "data": {
    "users": { "total": 120, "students": 100, "customers": 15, "admins": 5, "newThisMonth": 12 },
    "enrollments": { "total": 240, "active": 180, "completed": 40, "cancelled": 20 },
    "bookings": { "total": 60, "pending": 5, "confirmed": 40, "completed": 15 },
    "consultations": { "total": 30, "open": 8, "resolved": 22 },
    "revenue": { "totalKobo": 45000000, "refundedKobo": 0, "currency": "NGN" }
  }
}
```

### `POST /api/admin/enrollments/:id/transfer`

```json
{ "toClassId": "…", "reason": "Moved to the evening intake" }
```

The old enrolment is cancelled, a new one is created, and the move is recorded
in `EnrollmentTransfer`. A clash with an existing active enrolment returns
`409`.

---

## 11. Root

### `GET /`

```json
{
  "name": "Ar-Riyaadh Academy API",
  "version": "0.2.0",
  "endpoints": { "classes": "/api/classes", "…": "…" }
}
```

---

## 12. Change log

| Version | Change |
|---|---|
| 0.1.0 | The original public content API (classes, lectures, testimonials, homeschooling, contact). |
| 0.2.0 | Accounts, enrolments, services, bookings, consultations, payments, admin. Content mutations moved behind admin auth; the public contract is unchanged. |
