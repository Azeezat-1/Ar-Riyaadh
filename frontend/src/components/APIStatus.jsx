export function Loader({ label = 'Loading…' }) {
  return (
    <p className="muted" style={{ textAlign: 'center', padding: '2.5rem 0' }} role="status">
      {label}
    </p>
  )
}

export function OfflineNote() {
  return (
    <p
      className="muted small"
      style={{ textAlign: 'center', marginTop: '1.2rem', fontStyle: 'italic' }}
      role="status"
    >
      Live data is momentarily unavailable, showing saved content.
    </p>
  )
}