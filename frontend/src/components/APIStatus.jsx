export function Loader({ label = 'Loading…' }) {
  return (
    <p className="muted" style={{ textAlign: 'center', padding: '2.5rem 0' }} role="status">
      {label}
    </p>
  )
}