'use client'

import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    song: '🎵',
    audio: '🎧',
    video: '🎬',
    document: '📄',
  }
  return emojis[category] || '📁'
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    song: 'Song',
    audio: 'Audio',
    video: 'Video',
    document: 'Document',
  }
  return labels[category] || category
}

function AudioPlayer({ fileUrl }: { fileUrl: string }) {
  return (
    <audio controls style={{ width: '100%', height: '32px', marginTop: '0.3rem' }}>
      <source src={fileUrl} />
      Your browser does not support the audio element.
    </audio>
  )
}

function getSanityFileUrl(assetRef: string): string {
  if (!assetRef) return ''
  const ref = assetRef
  const id = ref.replace(/^file-/, '').replace(/-\w+$/, '')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const extMatch = ref.match(/-([a-z0-9]+)$/)
  const ext = extMatch ? extMatch[1] : 'mp3'
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`
}

interface MediaItem {
  _id: string
  title: string
  slug: { current: string }
  category: string
  description?: string
  thumbnail?: any
  file?: any
  tags?: string[]
  lyrics?: string
}

interface MediaListProps {
  items: MediaItem[]
  title: string
  subtitle?: string | null
  showLanguageTabs?: boolean
  emptyMessage: string
  hideCategoryLabel?: boolean // ← New prop to hide category label
}

export default function MediaList({ 
  items, 
  title, 
  subtitle, 
  showLanguageTabs = true, 
  emptyMessage,
  hideCategoryLabel = false // ← Default to false
}: MediaListProps) {
  const router = useRouter()
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(items)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLanguage, setActiveLanguage] = useState<'all' | 'kiswahili' | 'english'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    let filtered = items

    if (showLanguageTabs) {
      if (activeLanguage === 'kiswahili') {
        filtered = filtered.filter((item) => item.tags?.includes('Kiswahili'))
      } else if (activeLanguage === 'english') {
        filtered = filtered.filter((item) => item.tags?.includes('English'))
      }
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        const title = item.title?.toLowerCase() || ''
        const description = item.description?.toLowerCase() || ''
        const tags = (item.tags || []).join(' ').toLowerCase()
        return title.includes(query) || description.includes(query) || tags.includes(query)
      })
    }

    filtered = filtered.sort((a, b) => {
      const titleA = a.title?.toLowerCase() || ''
      const titleB = b.title?.toLowerCase() || ''
      return titleA.localeCompare(titleB)
    })

    setFilteredItems(filtered)
  }, [activeLanguage, searchQuery, items, showLanguageTabs])

  const toggleLyrics = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedId(expandedId === id ? null : id)
  }

  const navigateToDetail = (slug: string) => {
    if (slug) {
      router.push(`/media/${slug}`)
    }
  }

  const kiswahiliCount = items.filter((item) => item.tags?.includes('Kiswahili')).length
  const englishCount = items.filter((item) => item.tags?.includes('English')).length

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem 1rem' }}>
      {/* Back button */}
      <button
        onClick={() => router.push('/media')}
        style={{
          display: 'inline-block',
          marginBottom: '1rem',
          fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
          color: '#2563eb',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
        }}
      >
        ← Back to Media
      </button>

      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '300', color: '#1a1a1a', marginBottom: '0.5rem' }}>
        {title}
      </h1>

      {subtitle && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#4b5563', fontStyle: 'italic', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', lineHeight: '1.6' }}>
            {subtitle}
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Search by title, description, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#1a1a1a'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              textDecoration: 'underline',
            }}
          >
            Clear search
          </button>
        )}
      </div>

      {/* Language Filter Tabs */}
      {showLanguageTabs && (
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '0.6rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setActiveLanguage('all')}
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeLanguage === 'all' ? '#1a1a1a' : '#f3f4f6',
              color: activeLanguage === 'all' ? '#ffffff' : '#4b5563',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveLanguage('kiswahili')}
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeLanguage === 'kiswahili' ? '#1a1a1a' : '#f3f4f6',
              color: activeLanguage === 'kiswahili' ? '#ffffff' : '#4b5563',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            🇹🇿 Kiswahili ({kiswahiliCount})
          </button>
          <button
            onClick={() => setActiveLanguage('english')}
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeLanguage === 'english' ? '#1a1a1a' : '#f3f4f6',
              color: activeLanguage === 'english' ? '#ffffff' : '#4b5563',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            🇬🇧 English ({englishCount})
          </button>
        </div>
      )}

      {filteredItems.length > 0 && (
        <p style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)', color: '#9ca3af', marginBottom: '0.8rem' }}>
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {filteredItems.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>
          {searchQuery
            ? `No media found matching "${searchQuery}". Try a different search or clear the filter.`
            : emptyMessage}
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
        }}>
          {filteredItems.map((item: any) => {
            const slug = item.slug?.current || item._id
            const isAudio = item.category === 'audio' || item.category === 'song'
            const isExpanded = expandedId === item._id

            let fileUrl = ''
            if (item.file?.asset?._ref) {
              fileUrl = getSanityFileUrl(item.file.asset._ref)
            }

            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.6rem',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                className="media-item"
                onClick={() => navigateToDetail(slug)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  {/* Thumbnail - smaller */}
                  {item.thumbnail ? (
                    <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0, borderRadius: '0.3rem', overflow: 'hidden' }}>
                      <Image
                        src={urlFor(item.thumbnail).url()}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      flexShrink: 0,
                      borderRadius: '0.3rem',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                    }}>
                      {getCategoryEmoji(item.category)}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {/* Language badges - small */}
                      {item.tags?.includes('Kiswahili') && (
                        <span style={{
                          fontSize: '0.45rem',
                          fontWeight: '500',
                          color: '#ffffff',
                          background: '#1a1a1a',
                          padding: '0.05rem 0.3rem',
                          borderRadius: '9999px',
                        }}>
                          🇹🇿
                        </span>
                      )}
                      {item.tags?.includes('English') && (
                        <span style={{
                          fontSize: '0.45rem',
                          fontWeight: '500',
                          color: '#ffffff',
                          background: '#2563eb',
                          padding: '0.05rem 0.3rem',
                          borderRadius: '9999px',
                        }}>
                          🇬🇧
                        </span>
                      )}
                    </div>
                    <h3 style={{
                      fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      margin: '0.05rem 0',
                      lineHeight: '1.2',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.title}
                    </h3>
                  </div>

                  {/* Lyrics button - smaller */}
                  {item.lyrics && (
                    <button
                      onClick={(e) => toggleLyrics(item._id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.55rem',
                        color: isExpanded ? '#2563eb' : '#9ca3af',
                        padding: '0.05rem 0.15rem',
                        textDecoration: 'underline',
                        flexShrink: 0,
                      }}
                    >
                      {isExpanded ? '📝' : '📝'}
                    </button>
                  )}
                </div>

                {/* Audio Player */}
                {isAudio && fileUrl && (
                  <div 
                    style={{ marginTop: '0.2rem' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <audio controls style={{ width: '100%', height: '28px' }}>
                      <source src={fileUrl} />
                    </audio>
                  </div>
                )}

                {/* Lyrics (expandable) */}
                {isExpanded && item.lyrics && (
                  <div style={{
                    marginTop: '0.2rem',
                    padding: '0.3rem 0.4rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.3rem',
                    border: '1px solid #e5e7eb',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: 'clamp(0.55rem, 1vw, 0.7rem)',
                    lineHeight: '1.4',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    color: '#1a1a1a',
                  }}>
                    {item.lyrics}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 480px) {
          .media-item {
            padding: 0.35rem 0.4rem !important;
          }
          .media-item audio {
            height: 24px !important;
          }
        }
        .media-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important;
          border-color: #d1d5db !important;
        }
        .media-item audio::-webkit-media-controls-panel {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  )
}