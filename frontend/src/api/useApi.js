import { useEffect, useState } from 'react'

// Fetches a list from the API and falls back to the bundled static data when
// the backend is unreachable, so the site always renders. The `offline` flag
// lets pages show a subtle note without blocking content.
export function useApi(resolver, fallback) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    resolver()
      .then((items) => {
        if (!active) return
        if (Array.isArray(items) && items.length) setData(items)
        setOffline(false)
      })
      .catch(() => {
        if (active) setOffline(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, offline }
}