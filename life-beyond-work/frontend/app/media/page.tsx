'use client'

import { client, urlFor, getBaseUrl } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

async function getMedia() {
  return await client.fetch(`
    *[_type == "media"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      description,
      thumbnail,
      file,
      publishedAt,
      tags,
      likes,
      lyrics
    }
  `)
}

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

// Audio Player Component (inline in list)
function AudioPlayer({ fileUrl, title }: { fileUrl: string; title: string }) {
  return (
    <audio controls style={{ width: '100%', height: '36px', marginTop: '0.5rem' }}>
      <source src={fileUrl} />
      Your browser does not support the audio element.
    </audio>
  )
}

// Helper to get Sanity file asset URL
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

export default function MediaPage() {
  const [allMedia, setAllMedia] = useState<any[]>([])
  const [filteredMedia, setFilteredMedia] = useState<any[]>([])
  const [activeLanguage, setActiveLanguage] = useState<'all' | 'kiswahili' | 'english'>('all')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    getMedia().then((data) => {
      setAllMedia(data)
      setFilteredMedia(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (activeLanguage === 'all') {
      setFilteredMedia(allMedia)
    } else if (activeLanguage === 'kiswahili') {
      setFilteredMedia(allMedia.filter((item) => item.tags?.includes('Kiswahili')))
    } else if (activeLanguage === 'english') {
      setFilteredMedia(allMedia.filter((item) => item.tags?.includes('English')))
    }
  }, [activeLanguage, allMedia])

  const toggleLyrics = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Count items per language
  const kiswahiliCount = allMedia.filter((item) => item.tags?.includes('Kiswahili')).length
  const englishCount = allMedia.filter((item) => item.tags?.includes('English')).length

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Loading media...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '0.5rem' }}>
        Media
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Songs, audio, videos, and documents
      </p>

      {/* Language Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '0.75rem',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setActiveLanguage('all')}
          style={{
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: activeLanguage === 'all' ? '#1a1a1a' : '#f3f4f6',
            color: activeLanguage === 'all' ? '#ffffff' : '#4b5563',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          All ({allMedia.length})
        </button>
        <button
          onClick={() => setActiveLanguage('kiswahili')}
          style={{
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: activeLanguage === 'kiswahili' ? '#1a1a1a' : '#f3f4f6',
            color: activeLanguage === 'kiswahili' ? '#ffffff' : '#4b5563',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          🇹🇿 Kiswahili ({kiswahiliCount})
        </button>
        <button
          onClick={() => setActiveLanguage('english')}
          style={{
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: activeLanguage === 'english' ? '#1a1a1a' : '#f3f4f6',
            color: activeLanguage === 'english' ? '#ffffff' : '#4b5563',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          🇬🇧 English ({englishCount})
        </button>
      </div>

      {filteredMedia.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>
          {activeLanguage === 'all'
            ? 'No media yet. Upload your first song, audio, video, or document in Sanity Studio!'
            : activeLanguage === 'kiswahili'
            ? 'No Kiswahili media yet. Add the "Kiswahili" tag to your media items.'
            : 'No English media yet. Add the "English" tag to your media items.'}
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}>
          {filteredMedia.map((item: any) => {
            const slug = item.slug?.current || item._id
            const isAudio = item.category === 'audio' || item.category === 'song'
            const isVideo = item.category === 'video'
            const isDocument = item.category === 'document'
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
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="media-item"
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  {/* Thumbnail */}
                  {item.thumbnail ? (
                    <div style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0, borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <Image
                        src={urlFor(item.thumbnail).url()}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="60px"
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      flexShrink: 0,
                      borderRadius: '0.5rem',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}>
                      {getCategoryEmoji(item.category)}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {getCategoryEmoji(item.category)} {getCategoryLabel(item.category)}
                      </span>
                      {item.tags?.includes('Kiswahili') && (
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: '500',
                          color: '#ffffff',
                          background: '#1a1a1a',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '9999px',
                        }}>
                          🇹🇿 Kiswahili
                        </span>
                      )}
                      {item.tags?.includes('English') && (
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: '500',
                          color: '#ffffff',
                          background: '#2563eb',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '9999px',
                        }}>
                          🇬🇧 English
                        </span>
                      )}
                    </div>
                    <Link href={`/media/${slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: '#1a1a1a',
                        margin: '0.1rem 0',
                        lineHeight: '1.3',
                        transition: 'color 0.2s',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {item.title}
                      </h3>
                    </Link>
                    {item.description && (
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#4b5563',
                        margin: '0.1rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                    {isAudio && fileUrl && (
                      <span style={{
                        fontSize: '0.7rem',
                        background: '#f3f4f6',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        color: '#4b5563',
                      }}>
                        🎵
                      </span>
                    )}
                    {item.lyrics && (
                      <button
                        onClick={() => toggleLyrics(item._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          color: isExpanded ? '#2563eb' : '#9ca3af',
                          padding: '0.1rem 0.3rem',
                          textDecoration: 'underline',
                        }}
                      >
                        {isExpanded ? '📝 Hide' : '📝 Lyrics'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Audio Player (for audio/song) */}
                {isAudio && fileUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <AudioPlayer fileUrl={fileUrl} title={item.title} />
                  </div>
                )}

                {/* Lyrics (expandable) */}
                {isExpanded && item.lyrics && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    lineHeight: '1.6',
                    maxHeight: '200px',
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