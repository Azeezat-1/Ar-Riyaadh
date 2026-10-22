# Ar-Riyaadh Academy — Environment, Seed & Runbook

Everything needed to run the API locally, seed it, and deploy it.

---

## 1. Local runtime

The backend is Node + MongoDB. You need:

| Requirement | Version |
|---|---|
| Node.js | 20 or newer (24 is fine) |
| npm | 10 or newer |
| MongoDB | 6 or newer — **or** Atlas, **or** nothing at all (see below) |

### 1.1 You do not need a local MongoDB for the tests

The test suite starts an in-memory MongoDB automatically:

```bash
cd server
npm install
npm test
```

`mongodb-memory-server` downloads a MongoDB binary on first run and caches it.
No server, no `mongod`, no Docker.

### 1.2 Running the API locally

You do need a MongoDB for the API itself. Any of these work:

**Option A — MongoDB Atlas (free tier)**
Create a cluster, add a database user, allow your IP, and copy the connection
string. It looks like:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ar_riyadh_academy
```

**Option B — Homebrew (macOS)**

```bash
brew install mongodb-community
brew services start mongodb-community
```

The default local URI is then `mongodb://127.0.0.1:27017/ar_riyadh_academy`.

**Option C — Docker**

```bash
docker run -d --name ar-riyadh-mongo -p 27017:27017 mongo:7
```

**Option D — the in-memory server**

Useful for a throwaway run, but the data disappears when the process stops:

```bash
cd server
node -e "import('mongodb-memory-server').then(async ({MongoMemoryServer}) => {
  const s = await MongoMemoryServer.create();
  console.log(s.getUri());
  process.on('SIGINT', async () => { await s.stop(); process.exit(0) });
})"
```

> **Note on XAMPP.** The `xamppfiles/mysql` and `xamppfiles/php` folders in
> this environment are empty stubs — only Apache is installed. There is no
> MySQL and no PHP available, which is one reason the backend stayed on MERN.

---

## 2. Environment variables

`server/.env.example` is the template. Copy it:

```bash
cd server
cp .env.example .env
```

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | yes | `development` | `production` disables the stack traces in errors and adds HSTS. |
| `PORT` | no | `4000` | The port the API listens on. |
| `MONGODB_URI` | yes | — | The MongoDB connection string. |
| `CORS_ORIGINS` | yes | `http://localhost:5173` | Comma-separated allow-list. `*` allows everything. |
| `SEED_ADMIN_EMAIL` | no | `admin@arriyaadh.com` | The account `npm run seed` creates. |
| `SEED_ADMIN_PASSWORD` | no | `ChangeMe123!` | Its password. **Set this before deploying.** |
| `SEED_ADMIN_NAME` | no | `Academy Admin` | Its display name. |
| `PAYSTACK_SECRET_KEY` | for payments | — | The live secret key. |
| `PAYSTACK_WEBHOOK_SECRET` | for payments | — | From the Paystack dashboard. |
| `PAYSTACK_API_BASE` | no | `https://api.paystack.co` | Override for a sandbox or a mock. |

### 2.1 The frontend

`frontend/.env`:

| Variable | Purpose |
|---|---|
| `VITE_API_BASE` | The API's origin. Empty means "same origin", which is what the Render and Netlify rewrites use. |

The frontend's Axios client falls back to its bundled content when the API is
unreachable, so the public site keeps working even with the API down.

### 2.2 Secret rules

- `.env` is gitignored. Never commit it.
- The admin password comes from the environment, so it never lives in the
  repository.
- Paystack's secret key and the webhook secret are server-only. They must
  never be exposed to the browser — the frontend never sees them.
- `CORS_ORIGINS=*` is fine for a public read-only API but should be narrowed
  once dashboards exist.

---

## 3. The seed

```bash
cd server
npm run seed
```

The seed is **idempotent for reference data**: content collections are cleared
and rebuilt, while accounts, subjects, services and slots are upserted. Running
it twice does not duplicate anything.

### 3.1 What it creates

| Collection | Count | Contents |
|---|---|---|
| `Class` | 5 | Qurʼān Recitation & Tajweed, Fluent Arabic Speaking, Tafseer, Hadith Memorization, Islamic Studies & Purification. |
| `Lecture` | 3 | Regular scheduled lectures. |
| `Testimonial` | 3 | Approved student testimonials. |
| `HomeschoolingArticle` | 2 | Long-form reflections. |
| `Subject` | 6 | Qurʼān, Hadith, Tafsir, Arabic Language, Islamic Studies, Hijaamah. |
| `Service` | 2 | Hijaamah session (₦15,000, health form required), Islamic Studies Consultation (free). |
| `ServiceSlot` | ~40 | The next 14 days of weekday slots at 10:00 and 14:00. |
| `Setting` | 5 | `support_email`, `telegram_link`, `whatsapp_link`, `payment_currency`, `booking_slot_increment_hours`. |
| `User` | 1 | The admin account. |

### 3.2 The admin account

```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-strong-password' npm run seed
```

The account gets the roles `admin` and `student`. If it already exists the
roles are reset but the password is left alone — set the password by signing in
and using `POST /api/auth/change-password`.

### 3.3 The Telegram link

Every class and lecture points at `https://t.me/ArRiyadhAcademy`, which is a
placeholder. Replace it with the academy's real group links in `data/seed.js`
before going live.

### 3.4 The slot calendar

Slots are generated for the next 14 days, weekdays only, at 10:00 and 14:00,
with a capacity of one per service. The generator only runs when a service has
no slots yet, so re-seeding does not extend an existing calendar. To rebuild
the calendar, delete the `ServiceSlot` collection and re-run the seed.

---

## 4. Paystack setup

### 4.1 Get the keys

1. Create a Paystack account.
2. Copy the **secret key** from the dashboard into `PAYSTACK_SECRET_KEY`.
3. Use the test secret key (`sk_test_…`) until you are ready to go live.

The public key is only needed by a browser checkout page, and the API does not
use it.

### 4.2 The webhook

In the Paystack dashboard, add a webhook URL:

```
https://<your-host>/api/payments/webhook
```

Subscribe to `charge.success`. Copy the webhook secret into
`PAYSTACK_WEBHOOK_SECRET`.

The API computes `HMAC-SHA512(rawBody, PAYSTACK_WEBHOOK_SECRET)` and compares
it to the `x-paystack-signature` header with a constant-time comparison. The
raw body is captured before the JSON parser touches it, so the signature
always matches.

**If the webhook cannot reach the API**, payments will not complete: the order
stays `pending` and the enrolment is never activated. Use
`POST /api/payments/verify` from a server-side cron as a fallback.

### 4.3 Test-mode checklist

```bash
# 1. Use the test keys
PAYSTACK_SECRET_KEY=sk_test_… PAYSTACK_WEBHOOK_SECRET=… npm run dev

# 2. Create an order
curl -X POST http://localhost:4000/api/payments/orders \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"orderType":"course_enrollment","classId":"<class id>"}'

# 3. Initialise the transaction
curl -X POST http://localhost:4000/api/payments/initialize \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"orderReference":"ORD-…"}'
# -> open the authorizationUrl and pay with the test card

# Test card: 4084 0840 8408 4081, any future expiry, any CVV, OTP 123456

# 4. Check the order settled
curl -X POST http://localhost:4000/api/payments/verify \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' \
  -d '{"reference":"ORD-…"}'
```

---

## 5. First run

```bash
# 1. Install
cd server && npm install

# 2. Configure
cp .env.example .env
#    edit .env: MONGODB_URI, CORS_ORIGINS, SEED_ADMIN_PASSWORD

# 3. Seed
npm run seed

# 4. Run
npm run dev        # watches for changes
npm start          # plain
```

Then:

```bash
curl http://localhost:4000/api/health
# {"status":"ok"}
```

### 5.1 The frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Set `VITE_API_BASE=http://localhost:4000` in `frontend/.env` so the dev server
talks to the local API.

### 5.2 The whole stack from the repo root

```bash
npm run dev        # starts the API
npm run build      # builds the frontend into frontend/dist
```

---

## 6. Tests

```bash
cd server
npm test                 # everything
npm run test:api         # the public contract only
npm run test:dashboard   # accounts, commerce, admin
```

| Variable | Purpose |
|---|---|
| `MONGODB_URI_TEST` | Run the suite against a real MongoDB instead of the in-memory one. The database is dropped before and after the run — never point it at anything you care about. |

---

## 7. Deployment

### 7.1 Render

`render.yaml` at the repo root defines two services: the API (`server`) and the
static frontend (`frontend`).

1. Render → New → Blueprint → point at the repository.
2. Set `MONGODB_URI` on the API service to the Atlas connection string.
3. Set `CORS_ORIGINS` to the frontend's URL.
4. Set `PAYSTACK_SECRET_KEY` and `PAYSTACK_WEBHOOK_SECRET` if you are taking
   payments.
5. Copy the API's URL into `VITE_API_BASE` on the frontend service and redeploy
   the frontend.

### 7.2 Vercel

`vercel.json` deploys `api/index.js` as a serverless function. It lazily
connects to MongoDB on the first request and reuses the connection. Set the
same environment variables in the project settings.

### 7.3 Netlify

`netlify.toml` publishes the built frontend and rewrites `/api/*` to the API
service.

### 7.4 The seed in production

Run it once, from a machine that can reach the database:

```bash
cd server
MONGODB_URI="mongodb+srv://…" SEED_ADMIN_EMAIL="…" SEED_ADMIN_PASSWORD="…" npm run seed
```

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `MONGODB_URI is not set` | `.env` missing or not copied. | `cp .env.example .env`. |
| `MongoServerSelectionError` | The database is unreachable — wrong URI, no IP allow-list, or the local `mongod` is not running. | Check the URI and that MongoDB is up. |
| `Client must be connected before running operations` | A model was used before `connectDB()`. | Call `connectDB()` first; the API entry point does. |
| Every request returns `429` | The rate limiter is counting your IP. | Wait for the window to reset; in tests the limiter is off. |
| `401 Invalid webhook signature` | The body was modified in transit, or the secret is wrong. | Point the webhook straight at the API; check `PAYSTACK_WEBHOOK_SECRET`. |
| `402 This class requires payment` | The class is paid; enrol after the payment webhook. | Create an order and pay. |
| `409 That slot has just been taken` | The slot is full. | Choose another slot. |
| The public site's filter for "Qurʼān" returns nothing | The characters drifted apart. | `npm test` includes a check that decodes the frontend's escapes and compares them with the backend. |
