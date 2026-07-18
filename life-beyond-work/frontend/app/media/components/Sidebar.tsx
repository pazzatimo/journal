'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface LinkItem {
  label: string
  url: string
  external?: boolean
  icon?: string
}

interface SidebarSection {
  sectionTitle: string
  links: LinkItem[]
}

interface SidebarProps {
  sections: SidebarSection[]
}

export function Sidebar({ sections }: SidebarProps) {
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

  if (!sections || sections.length === 0) {
    return null
  }

  // Desktop
  if (!isMobile) {
    return (
      <aside className="sidebar">
        <div className="sidebar-inner">
          {sections.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <h3 className="sidebar-title">{section.sectionTitle}</h3>
              <ul className="sidebar-links">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noopener noreferrer' : ''}
                      className="sidebar-link"
                    >
                      {link.icon && <span className="sidebar-icon">{link.icon}</span>}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    )
  }

  // Mobile
  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`sidebar-mobile ${isOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-mobile-inner">
          <button
            className="sidebar-mobile-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>

          {sections.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <h3 className="sidebar-title">{section.sectionTitle}</h3>
              <ul className="sidebar-links">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noopener noreferrer' : ''}
                      className="sidebar-link"
                    >
                      {link.icon && <span className="sidebar-icon">{link.icon}</span>}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}

export function RightSidebar() {
  return (
    <div className="sidebar sidebar-right">
      <div className="sidebar-inner">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Explore</h3>
          <ul className="sidebar-links">
            <li><Link href="/articles" className="sidebar-link">📝 Articles</Link></li>
            <li><Link href="/stories" className="sidebar-link">📖 Stories</Link></li>
            <li><Link href="/books" className="sidebar-link">📚 Books</Link></li>
            <li><Link href="/quotes" className="sidebar-link">💬 Quotes</Link></li>
            <li><Link href="/gallery" className="sidebar-link">🖼️ Gallery</Link></li>
            <li><Link href="/media" className="sidebar-link">🎵 Media</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}