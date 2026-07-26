import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
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

// Subtle music note icon (used when no cover)
const MusicNote = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

export default async function MusicPage() {
  const albums = await getMusicAlbums()
  const sidebarSections = await getSidebarLinks()

  const filteredAlbums = Object.fromEntries(
    Object.entries(albums).filter(([_, items]) => items.length > 0)
  )

  const getCover = (items: any[]) => {
    return items.find(item => item.thumbnail)?.thumbnail || null
  }

  const getAlbumLabel = (name: string) => {
    if (name === 'Other') return 'Uncategorized'
    if (name === 'AI') return 'AI‑Assisted'
    return name
  }

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
          maxWidth: '600px',
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

      {/* Album grid – compact, clean cards */}
      {Object.keys(filteredAlbums).length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No albums found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '1.25rem',
        }}>
          {Object.entries(filteredAlbums).map(([albumName, items]) => {
            const cover = getCover(items)
            const slug = albumName.toLowerCase()
            const label = getAlbumLabel(albumName)

            return (
              <Link key={albumName} href={`/media/music/${slug}`} style={{ textDecoration: 'none' }}>
                <div className="album-card">
                  <div style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    backgroundColor: '#fafafa',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    marginBottom: '0.4rem',
                    border: '1px solid #f3f4f6',
                  }}>
                    {cover ? (
                      <Image
                        src={urlFor(cover).url()}
                        alt={label}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#d1d5db',
                      }}>
                        <MusicNote />
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: '400',
                    color: '#111827',
                    letterSpacing: '-0.01em',
                    textAlign: 'center',
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#9ca3af',
                    textAlign: 'center',
                    marginTop: '0.05rem',
                  }}>
                    {items.length} {items.length === 1 ? 'track' : 'tracks'}
                  </div>
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

        .album-card {
          transition: opacity 0.15s ease;
        }
        .album-card:hover {
          opacity: 0.7;
        }
        .album-card:hover [style*="background-color: #fafafa"] {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  )
}