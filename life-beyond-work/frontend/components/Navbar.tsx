'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { urlFor } from "@/lib/sanity";

export function Navbar({ logoImage }: { logoImage: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  return (
    <nav className="top-nav">
      <Link href="/" className="top-nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
        {logoImage ? (
          <Image
            src={urlFor(logoImage).url()}
            alt="Life Beyond Work"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
            priority
          />
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="28" height="24" rx="2" stroke="#ffffff" strokeWidth="2"/>
            <line x1="8" y1="10" x2="24" y2="10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="15" x2="20" y2="15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="20" x2="22" y2="20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="24" cy="20" r="3" stroke="#ffffff" strokeWidth="1.5"/>
            <line x1="26" y1="22" x2="28" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </Link>

      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
      </button>

      <div className={`top-nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link href="/" className="nav-pill" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link href="/articles" className="nav-pill" onClick={() => setIsMenuOpen(false)}>Articles</Link>
        <Link href="/stories" className="nav-pill" onClick={() => setIsMenuOpen(false)}>Stories</Link>
        <Link href="/quotes" className="nav-pill" onClick={() => setIsMenuOpen(false)}>Quotes</Link>
        <Link href="/books" className="nav-pill" onClick={() => setIsMenuOpen(false)}>Books</Link>
        <Link href="/gallery" className="nav-pill" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
        <Link href="/media" className="nav-pill" onClick={() => setIsMenuOpen(false)}>Media</Link>
      </div>
    </nav>
  )
}
