import { client, getSidebarLinks } from '@/lib/sanity'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'
import AlbumPlayer from './AlbumPlayer'

// Language tags (case-insensitive) – used as fallback for tags
const LANGUAGE_TAGS = ['Kiswahili', 'English', 'Portuguese', 'Spanish', 'French', 'German', 'AI']
const LANGUAGE_TAGS_LOWERCASE = LANGUAGE_TAGS.map(t => t.toLowerCase())

// Map slug to display name
const SLUG_TO_TAG: Record<string, string> = {
  kiswahili: 'Kiswahili',
  english: 'English',
  portuguese: 'Portuguese',
  spanish: 'Spanish',
  french: 'French',
  german: 'German',
  ai: 'AI',
  other: 'Other',
}

// Type for a song from Sanity
interface SanitySong {
  _id: string
  title: string
  slug: { current: string }
  category: string
  thumbnail: any
  publishedAt: string
  tags: string[]
  language: string | null
  fileRef: string | null
}

// Type for a song with fileUrl added
interface SongWithUrl extends SanitySong {
  fileUrl: string | null
}

// Helper to build a Sanity file URL from asset reference
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

async function getAlbumSongs(album: string, search: string) {
  const tag = SLUG_TO_TAG[album]
  if (!tag) return { items: [], total: 0 }

  // Fetch ALL music items with file reference, language, and tags
  const allMusic: SanitySong[] = await client.fetch(`
    *[_type == "media" && (category == "song" || category == "audio")] {
      _id,
      title,
      slug,
      category,
      thumbnail,
      publishedAt,
      tags,
      language,
      "fileRef": file.asset._ref
    }
  `)

  // Helper: get the effective language for a song (prefer `language`, fallback to `tags`)
  function getEffectiveLanguage(song: SanitySong): string | null {
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

  let filteredSongs: SanitySong[] = []

  if (tag === 'Other') {
    filteredSongs = allMusic.filter((song: SanitySong) => {
      const lang = getEffectiveLanguage(song)
      return lang === null
    })
  } else {
    const targetTagLower = tag.toLowerCase()
    filteredSongs = allMusic.filter((song: SanitySong) => {
      const lang = getEffectiveLanguage(song)
      if (!lang) return false
      return lang.toLowerCase().trim() === targetTagLower
    })
  }

  // Sort A–Z by title
  filteredSongs.sort((a: SanitySong, b: SanitySong) => a.title.localeCompare(b.title))

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase()
    filteredSongs = filteredSongs.filter((item: SanitySong) =>
      item.title.toLowerCase().includes(searchLower)
    )
  }

  // Add fileUrl to each item
  const itemsWithUrl: SongWithUrl[] = filteredSongs.map((item: SanitySong) => {
    const fileUrl = item.fileRef ? getSanityFileUrl(item.fileRef) : null
    return {
      ...item,
      fileUrl,
    }
  })

  return { items: itemsWithUrl, total: itemsWithUrl.length }
}

export default async function AlbumPage({
  params,
  searchParams,
}: {
  params: Promise<{ album: string }>
  searchParams: Promise<{ search?: string }>
}) {
  const { album } = await params
  const { search = '' } = await searchParams
  const { items, total } = await getAlbumSongs(album, search)
  const sidebarSections = await getSidebarLinks()

  const albumLabel = SLUG_TO_TAG[album] || album
  const displayName = albumLabel === 'Other' ? 'Uncategorized' : albumLabel
  const isAIAlbum = albumLabel === 'AI'
  const playableSongs = items.filter((item: SongWithUrl) => item.fileUrl)

  return (
    <div className="page-main-content" style={{ maxWidth: '880px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <MobileSidebar sections={sidebarSections} />

      <Link
        href="/media/music"
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
        ← Back to Albums
      </Link>

      <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: '300', color: '#111827', marginBottom: '0.15rem', letterSpacing: '-0.02em' }}>
        {displayName}
      </h1>
      <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        {total} {total === 1 ? 'track' : 'tracks'}
      </p>

      {/* AI note – subtle, not a box */}
      {isAIAlbum && total > 0 && (
        <div style={{
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #f3f4f6',
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#6b7280',
            lineHeight: '1.6',
            fontStyle: 'italic',
          }}>
            <span style={{ color: '#4b5563', fontWeight: '400' }}>†</span>{' '}
            Nyimbo hizi zimetungwa na binadamu (kutoka wenye Biblia Takatifu na Nukuu za Ndg William Marion Braniham), lakini mchanganyiko wa sauti na vyombo vya muziki umefanywa kwa msaada wa Akili Mnemba (AI).
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              These songs are composed by humans,(From the holly Bible and Bro William Branham Quotes ) with AI‑assisted audio mixing and instrumentation.
            </span>
          </p>
        </div>
      )}

      {/* Player */}
      {playableSongs.length > 0 ? (
        <div style={{ marginBottom: '2rem' }}>
          <AlbumPlayer songs={playableSongs} />
        </div>
      ) : (
        total > 0 && (
          <div style={{
            marginBottom: '2rem',
            padding: '1.25rem',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            color: '#9ca3af',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}>
            No audio files available for this album.
          </div>
        )
      )}

      {/* Search Bar – minimal */}
      <form method="get" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="text"
            name="search"
            placeholder="Search tracks..."
            defaultValue={search}
            className="search-input"
            style={{
              flex: 1,
              maxWidth: '320px',
              padding: '0.5rem 0.75rem',
              border: 'none',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.9rem',
              outline: 'none',
              backgroundColor: 'transparent',
              transition: 'border-color 0.2s',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#6b7280',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            className="search-btn"
          >
            Search
          </button>
          {search && (
            <Link
              href={`/media/music/${album}`}
              style={{
                fontSize: '0.8rem',
                color: '#9ca3af',
                textDecoration: 'none',
              }}
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Song list – natural, minimal, three columns */}
      {items.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No songs found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.25rem 2rem',
          }}
        >
          {items.map((item: SongWithUrl, index: number) => (
            <Link
              key={item._id}
              href={`/media/${item.slug.current}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.3rem 0',
                textDecoration: 'none',
                color: '#111827',
                borderRadius: '4px',
                transition: 'background-color 0.1s ease',
                gap: '0.5rem',
                borderBottom: '1px solid #f9fafb',
              }}
              className="song-link"
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#d1d5db',
                  fontWeight: '300',
                  minWidth: '1.6rem',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: '0.85rem',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#1f2937',
                }}
              >
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .back-link:hover {
          border-bottom-color: #d1d5db;
        }

        .search-input:focus {
          border-bottom-color: #9ca3af;
        }

        .search-btn:hover {
          color: #111827;
        }

        .song-link:hover {
          background-color: #f9fafb;
        }

        @media (max-width: 768px) {
          .page-main-content [style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .page-main-content [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}