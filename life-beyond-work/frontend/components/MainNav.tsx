'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // On desktop, show links inline
  if (!isMobile) {
    return (
      <div className="top-nav-links">
        <Link href="/" className="nav-pill">Home</Link>
        <Link href="/articles" className="nav-pill">Articles</Link>
        <Link href="/stories" className="nav-pill">Stories</Link>
        <Link href="/quotes" className="nav-pill">Quotes</Link>
        <Link href="/books" className="nav-pill">Books</Link>
        <Link href="/gallery" className="nav-pill">Gallery</Link>
        <Link href="/media" className="nav-pill">Media</Link>
      </div>
    )
  }

  // On mobile: hamburger + dropdown
  return (
    <>
      <button
        className="main-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      {isOpen && (
        <div className="main-nav-overlay" onClick={() => setIsOpen(false)} />
      )}

      <div className={`main-nav-dropdown ${isOpen ? 'open' : ''}`}>
        <button
          className="main-nav-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation"
        >
          ✕
        </button>
        <Link href="/" className="nav-pill" onClick={() => setIsOpen(false)}>Home</Link>
        <Link href="/articles" className="nav-pill" onClick={() => setIsOpen(false)}>Articles</Link>
        <Link href="/stories" className="nav-pill" onClick={() => setIsOpen(false)}>Stories</Link>
        <Link href="/quotes" className="nav-pill" onClick={() => setIsOpen(false)}>Quotes</Link>
        <Link href="/books" className="nav-pill" onClick={() => setIsOpen(false)}>Books</Link>
        <Link href="/gallery" className="nav-pill" onClick={() => setIsOpen(false)}>Gallery</Link>
        <Link href="/media" className="nav-pill" onClick={() => setIsOpen(false)}>Media</Link>
      </div>
    </>
  )
}