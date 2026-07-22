import { client, getSidebarLinks } from '@/lib/sanity'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'
import AlbumPlayer from './AlbumPlayer'

// Language tags (case-insensitive) – used as fallback for tags
const LANGUAGE_TAGS = ['Kiswahili', 'English', 'Portuguese', 'Spanish', 'French', 'German']
const LANGUAGE_TAGS_LOWERCASE = LANGUAGE_TAGS.map(t => t.toLowerCase())

// Map slug to display name
const SLUG_TO_TAG: Record<string, string> = {
  kiswahili: 'Kiswahili',
  english: 'English',
  portuguese: 'Portuguese',
  spanish: 'Spanish',
  french: 'French',
  german: 'German',
  other: 'Other',
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
  const allMusic = await client.fetch(`
    *[_type == "media" && (category == "song" || category == "audio")] {
      _id,
      title,
      slug,
      category,
      thumbnail,
      publishedAt,
      tags,
      language,
      file {
        asset -> { _ref }
      }
    }
  `)

  // Helper: get the effective language for a song (prefer `language`, fallback to `tags`)
  function getEffectiveLanguage(song: any): string | null {
    // 1. If language field is set and non-empty, use it
    if (song.language && song.language.trim() !== '') {
      return song.language.trim()
    }
    // 2. Fallback: check if any tag matches a language tag
    if (song.tags && song.tags.length > 0) {
      for (const t of song.tags) {
        const trimmed = t.toLowerCase().trim()
        if (LANGUAGE_TAGS_LOWERCASE.includes(trimmed)) {
          // Return the matching language tag (capitalized)
          const idx = LANGUAGE_TAGS_LOWERCASE.indexOf(trimmed)
          return LANGUAGE_TAGS[idx]
        }
      }
    }
    return null
  }

  let filteredSongs = []

  if (tag === 'Other') {
    // "Other": songs with NO language AND NO language tag
    filteredSongs = allMusic.filter((song: any) => {
      const lang = getEffectiveLanguage(song)
      return lang === null // no language set
    })
  } else {
    // Language album: songs that match this language (from either language or tags)
    const targetTagLower = tag.toLowerCase()
    filteredSongs = allMusic.filter((song: any) => {
      const lang = getEffectiveLanguage(song)
      if (!lang) return false
      return lang.toLowerCase().trim() === targetTagLower
    })
  }

  // Sort A–Z by title
  filteredSongs.sort((a: any, b: any) => a.title.localeCompare(b.title))

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase()
    filteredSongs = filteredSongs.filter((item: any) =>
      item.title.toLowerCase().includes(searchLower)
    )
  }

  // Add fileUrl to each item
  const itemsWithUrl = filteredSongs.map((item: any) => ({
    ...item,
    fileUrl: item.file?.asset?._ref ? getSanityFileUrl(item.file.asset._ref) : null,
  }))

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

  return (
    <div className="page-main-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <MobileSidebar sections={sidebarSections} />

      <Link href="/media/music" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>
        ← Back to Albums
      </Link>

      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: '400', color: '#111827', marginBottom: '0.25rem' }}>
        {displayName} Songs
      </h1>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
        {total} {total === 1 ? 'track' : 'tracks'} • A–Z
      </p>

      {/* 🎵 PLAYER */}
      {items.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <AlbumPlayer songs={items} />
        </div>
      )}

      {/* Search Bar */}
      <form method="get" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="search"
          placeholder="Search songs..."
          defaultValue={search}
          className="search-input"
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: '#fafafa',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '0.5rem',
            padding: '0.6rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#111827',
            color: '#fff',
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
        {search && (
          <Link
            href={`/media/music/${album}`}
            style={{
              marginLeft: '0.5rem',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#374151',
              fontSize: '0.95rem',
            }}
          >
            Clear
          </Link>
        )}
      </form>

      {/* Three‑column song list */}
      {items.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No songs found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.15rem 1.5rem',
          }}
        >
          {items.map((item: any, index: number) => (
            <Link
              key={item._id}
              href={`/media/${item.slug.current}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.4rem 0.25rem',
                textDecoration: 'none',
                color: '#111827',
                borderRadius: '4px',
                transition: 'background-color 0.15s ease',
                gap: '0.4rem',
              }}
              className="song-link"
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#9ca3af',
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
                }}
              >
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .search-input:focus {
          border-color: #2563eb !important;
          background-color: #ffffff !important;
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