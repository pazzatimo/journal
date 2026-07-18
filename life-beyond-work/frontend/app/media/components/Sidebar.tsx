'use client'

import Link from 'next/link'
import { useState } from 'react'

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

  // DEBUG: Log to console
  console.log('🔍 Sidebar sections:', sections)

  // ALWAYS show the toggle, even if no sections (for debugging)
  // If no sections, show a message

  return (
    <>
      {/* Mobile Toggle Button – ALWAYS VISIBLE FOR DEBUGGING */}
      <button
        className="sidebar-toggle-debug"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        style={{
          position: 'fixed',
          top: '76px',
          left: '1rem',
          zIndex: 9999,
          background: 'red',
          color: 'white',
          border: '2px solid white',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.8rem',
          fontSize: '1.3rem',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        ☰ SIDEBAR
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9998,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '80vw',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
          padding: '1rem',
          background: '#1a1a1a',
        }}
      >
        <div className="sidebar-inner">
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginLeft: 'auto',
              marginBottom: '0.5rem',
              padding: '0.25rem 0.5rem',
              display: 'block',
            }}
          >
            ✕
          </button>

          {sections && sections.length > 0 ? (
            sections.map((section, idx) => (
              <div key={idx} className="sidebar-section">
                <h3 className="sidebar-title" style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #2d2d2d' }}>
                  {section.sectionTitle}
                </h3>
                <ul className="sidebar-links" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        target={link.external ? '_blank' : '_self'}
                        rel={link.external ? 'noopener noreferrer' : ''}
                        className="sidebar-link"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '0.4rem',
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                          fontWeight: '400',
                          border: '1px solid transparent',
                        }}
                      >
                        {link.icon && <span className="sidebar-icon" style={{ fontSize: '0.9rem', flexShrink: 0 }}>{link.icon}</span>}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p style={{ color: '#9ca3af' }}>No sidebar sections yet.</p>
          )}
        </div>
      </aside>
    </>
  )
}

export function RightSidebar() {
  return (
    <div className="sidebar sidebar-right" style={{ display: 'none' }}>
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