// Prints the Express route table as JSON so the validator can compare the
// running API with the documentation.
//
// Run with: node scripts/dump-routes.mjs
process.env.NODE_ENV = process.env.NODE_ENV || 'test'

const { default: app } = await import('../server/src/app.js')

const routes = []

// Express compiles a mount path into a regexp like
// `^\/admin\/enrollments\/?(?=\/|$)`. Recover the literal path from it so
// multi-segment mounts such as /admin/enrollments are not truncated.
function mountPath(source) {
  const match = source.match(/^\^\\\/(.*?)(?:\\\/)?\?\(\?=\\\/\|\$\)$/)
  if (!match) return ''
  return match[1].replace(/\\\//g, '/').replace(/\\(.)/g, '$1')
}

function walk(stack, prefix) {
  for (const layer of stack) {
    if (layer.route) {
      for (const method of Object.keys(layer.route.methods)) {
        if (method === '_all') continue
        routes.push({
          method: method.toUpperCase(),
          path: `${prefix}${layer.route.path}`.replace(/\/+$/, '') || '/',
        })
      }
    } else if (layer.name === 'router' && layer.handle?.stack) {
      const mounted = mountPath(layer.regexp.source)
      walk(layer.handle.stack, mounted ? `${prefix}/${mounted}` : prefix)
    }
  }
}

walk(app._router.stack, '')

routes.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))

process.stdout.write(JSON.stringify({ routes }, null, 2))
