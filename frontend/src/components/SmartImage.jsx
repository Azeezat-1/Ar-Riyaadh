import { useState } from 'react'

// Renders an elegant local SVG shard whenever an image fails to load,
// so the site never shows a broken image. Swap `src` for the academy's
// real photography later in /src/data/content.js.
export default function SmartImage({ src, alt, className, ratio }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={`img-fallback ${className ?? ''}`}
        role="img"
        aria-label={alt || 'Image placeholder'}
        style={{ aspectRatio: ratio ?? 'auto' }}
      >
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="400" height="300" fill="#e3ece2" />
          <path
            d="M0 210C90 160 170 270 260 210s120-40 140-20v110H0z"
            fill="#c9d8c7"
          />
          <path
            d="M0 240c80 30 170-10 250 20s110-6 150 10v30H0z"
            fill="#a9bea7"
          />
          <rect x="150" y="104" width="80" height="6" rx="3" fill="#1f3b32" opacity="0.18" />
          <rect x="130" y="124" width="120" height="6" rx="3" fill="#1f3b32" opacity="0.18" />
          <rect x="140" y="144" width="70" height="6" rx="3" fill="#1f3b32" opacity="0.18" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${className ?? ''} ${loaded ? '' : 'img--loading'}`}
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
    />
  )
}