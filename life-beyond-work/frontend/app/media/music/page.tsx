import { client, getSidebarLinks } from '@/lib/sanity'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

// Language tags – used for grouping
const LANGUAGE_TAGS = ['Kiswahili', 'English', 'Portuguese', 'Spanish', 'French', 'German', 'AI']
const LANGUAGE_TAGS_LOWERCASE = LANGUAGE_TAGS.map(t => t.toLowerCase())

async function getMusicAlbums() {
  const items = await client.fetch(`
    *[_type == "media" && (category == "song" || category == "audio")] {
      _id,
      title,
      slug,
      tags,
      language,
      thumbnail,
      publishedAt
    }
  `)

  function getEffectiveLanguage(song: any): string | null {
    if (song.language && song.language.trim() !== '') {
      return song.language.trim()
    }
    if (song.tags && song.tags.length > 0) {
      for (const t of song.tags) {
        const trimmed = t.toLowerCase().trim()
        if (LANGUAGE_TAGS_LOWERCASE.includes(trimmed)) {
          const idx = LANGUAGE_TAGS_LOWERCASE.indexOf(trimmed)
          return LANGUAGE_TAGS[idx]
        }
      }
    }
    return null
  }

  const albums: Record<string, any[]> = {}
  LANGUAGE_TAGS.forEach(tag => {
    const lowerTag = tag.toLowerCase()
    albums[tag] = items.filter((item: any) => {
      const lang = getEffectiveLanguage(item)
      if (!lang) return false
      return lang.toLowerCase().trim() === lowerTag
    })
  })

  albums['Other'] = items.filter((item: any) => {
    const lang = getEffectiveLanguage(item)
    return lang === null
  })

  Object.keys(albums).forEach(key => {
    albums[key].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  })

  return albums
}

// Helper: get a clean label for each album
const getAlbumLabel = (name: string) => {
  if (name === 'Other') return 'Uncategorized'
  if (name === 'AI') return 'AI‑Assisted'
  return name
}

export default async function MusicPage() {
  const albums = await getMusicAlbums()
  const sidebarSections = await getSidebarLinks()

  // Remove empty albums
  const filteredAlbums = Object.fromEntries(
    Object.entries(albums).filter(([_, items]) => items.length > 0)
  )

  // Sort albums alphabetically
  const sortedAlbums = Object.entries(filteredAlbums).sort(([a], [b]) => 
    a.localeCompare(b)
  )

  return (
    <div className="page-main-content" style={{ maxWidth: '880px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <MobileSidebar sections={sidebarSections} />

      <Link
        href="/media"
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: '#6b7280',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.15s',
        }}
        className="back-link"
      >
        ← Back to Media Library
      </Link>

      {/* Header with quote */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '300', color: '#111827', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
          Music
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: '#6b7280',
          fontStyle: 'italic',
          lineHeight: '1.6',
          maxWidth: '560px',
          borderLeft: '2px solid #e5e7eb',
          paddingLeft: '1rem',
          marginTop: '0.25rem',
        }}>
          “There’s nothing like music. You know, God heals by music. Did you know that? Uh-huh. God heals by music.”
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'normal', marginTop: '0.15rem' }}>— Rev. William Marrion Branham</span>
        </p>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
          Browse by language or collection.
        </p>
      </div>

      {/* 
        ✨ Just a grid of bold words – no cards, no images, no borders 
      */}
      {sortedAlbums.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No albums found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '0.75rem 1.5rem',
        }}>
          {sortedAlbums.map(([albumName, items]) => {
            const slug = albumName.toLowerCase()
            const label = getAlbumLabel(albumName)

            return (
              <Link
                key={albumName}
                href={`/media/music/${slug}`}
                style={{
                  textDecoration: 'none',
                  color: '#111827',
                  padding: '0.2rem 0',
                }}
                className="album-link"
              >
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.01em',
                  lineHeight: '1.3',
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                  fontWeight: '300',
                  marginTop: '0.05rem',
                }}>
                  {items.length} {items.length === 1 ? 'track' : 'tracks'}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        .back-link:hover {
          border-bottom-color: #d1d5db;
        }

        .album-link:hover div:first-child {
          color: #2563eb;
        }
      `}</style>
    </div>
  )
}