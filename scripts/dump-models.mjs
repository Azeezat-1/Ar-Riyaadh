// Prints every Mongoose schema as JSON so the validator can check the data
// model without parsing JavaScript.
//
// Run with: node scripts/dump-models.mjs
process.env.NODE_ENV = process.env.NODE_ENV || 'test'

import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'

const modelsDir = fileURLToPath(new URL('../server/src/models/', import.meta.url))
const files = readdirSync(modelsDir).filter((f) => f.endsWith('.js'))

const models = []

for (const file of files) {
  const imported = await import(pathToFileURL(join(modelsDir, file)).href)
  const schema = imported.default?.schema
  if (!schema) continue

  const fields = []
  for (const [name, path] of Object.entries(schema.paths)) {
    const instance = path?.instance
    fields.push({
      name,
      // path.instance is Mongoose's own type constant: 'Number', 'String',
      // 'ObjectId', 'Boolean', 'Date', 'Map', ...
      type: path?.instance ?? 'Mixed',
      required: path?.isRequired === true,
      enum: Array.isArray(path?.enumValues) ? path.enumValues : null,
      default: path?.defaultValue === undefined ? null : String(path.defaultValue),
      select: path?.selected !== false,
      ref: path?.options?.ref ?? null,
      unique: path?.options?.unique === true || path?.options?.index === true,
    })
  }

  const indexes = schema.indexes().map(([spec, options]) => ({
    keys: Object.keys(spec),
    unique: options?.unique === true,
    expires: options?.expireAfterSeconds ?? null,
  }))

  models.push({
    file,
    model: imported.default?.modelName ?? null,
    collection: schema.collection?.collectionName ?? imported.default?.modelName ?? null,
    timestamps: schema.options?.timestamps === true,
    fields,
    indexes,
  })
}

models.sort((a, b) => (a.collection || '').localeCompare(b.collection || ''))

process.stdout.write(JSON.stringify({ models }, null, 2))
