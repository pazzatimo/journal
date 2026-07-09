'use client'

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'next-share'
import { useState } from 'react'

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginRight: '0.25rem' }}>Share:</span>

      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton url={url}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <EmailShareButton url={url} subject={title} body="Check this out:">
        <EmailIcon size={32} round />
      </EmailShareButton>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: 'none',
          background: copied ? '#22c55e' : '#e5e7eb',
          color: copied ? '#ffffff' : '#1a1a1a',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '0.8rem',
          fontWeight: '500',
        }}
        title={copied ? 'Copied!' : 'Copy link'}
        onMouseEnter={(e) => {
          if (!copied) e.currentTarget.style.background = '#d1d5db'
        }}
        onMouseLeave={(e) => {
          if (!copied) e.currentTarget.style.background = '#e5e7eb'
        }}
      >
        {copied ? '✓' : '🔗'}
      </button>
    </div>
  )
}