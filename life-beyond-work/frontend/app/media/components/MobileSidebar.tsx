'use client'

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

interface MobileSidebarProps {
  sections: SidebarSection[]
}

export function MobileSidebar({ sections }: MobileSidebarProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!sections || sections.length === 0 || !isMobile) {
    return null
  }

  return (
    <div className="mobile-sidebar-section">
      <div className="mobile-sidebar-inner">
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
    </div>
  )
}