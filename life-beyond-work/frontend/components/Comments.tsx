'use client'

import { useEffect, useRef } from 'react'

export function Comments({ id, title, url }: { id: string; title?: string; url?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadCusdis = () => {
      // Load script if not present
      if (!document.querySelector('#cusdis-script')) {
        const script = document.createElement('script')
        script.id = 'cusdis-script'
        script.src = 'https://cusdis.com/js/cusdis.es.js'
        script.async = true
        script.defer = true
        document.body.appendChild(script)
      }

      // Wait for CUSDIS to be available
      const checkCusdis = () => {
        if (window.CUSDIS && typeof window.CUSDIS.render === 'function') {
          const container = containerRef.current
          if (container) {
            window.CUSDIS.render(container)
            console.log('✅ Cusdis rendered for', id)
          }
        } else {
          // Retry after 200ms
          setTimeout(checkCusdis, 200)
        }
      }

      // Start checking after a short delay to allow script to load
      setTimeout(checkCusdis, 300)
    }

    loadCusdis()
  }, [id])

  return (
    <div
      ref={containerRef}
      id={`cusdis-thread-${id}`}
      className="cusdis"
      data-host="https://cusdis.com"
      data-app-id="be9f1a1a-6f25-4b21-b2f6-ff730c33ff72"
      data-page-id={id}
      data-page-title={title || 'Life Beyond Work'}
      data-page-url={url || (typeof window !== 'undefined' ? window.location.href : '')}
    />
  )
}

declare global {
  interface Window {
    CUSDIS: {
      render: (element: HTMLElement) => void
    }
  }
}