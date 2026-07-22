import { client, getSidebarLinks } from '@/lib/sanity'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

// Language tags
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

async function getAlbumSongs(album: string, search: string) {
  const tag = SLUG_TO_TAG[album]
  if (!tag) return { items: [], total: 0 }

  // 🔍 DEBUG: Fetch ALL music items
  const allMusic = await client.fetch(`
    *[_type == "media" && (category == "song" || category == "audio")] {
      _id,
      title,
      slug,
      category,
      thumbnail,
      publishedAt,
      tags
    }
  `)

  // 🔍 DEBUG LOG: See all tags in the dataset
  console.log('🔍 Total songs:', allMusic.length)
  const allTags = new Set()
  allMusic.forEach((song: any) => {
    if (song.tags && song.tags.length > 0) {
      song.tags.forEach((t: string) => allTags.add(t))
    }
  })
  console.log('🔍 All unique tags in Sanity:', Array.from(allTags))
  console.log('🔍 Looking for language tags:', LANGUAGE_TAGS)

  // Helper: check if a song has any language tag (case‑insensitive)
  function hasLanguageTag(song: any): boolean {
    if (!song.tags || song.tags.length === 0) return false
    return song.tags.some((t: string) => {
      const trimmed = t.toLowerCase().trim()
      const result = LANGUAGE_TAGS_LOWERCASE.includes(trimmed)
      if (result) {
        console.log(`✅ Match: "${t}" → "${trimmed}" matches language tag`)
      }
      return result
    })
  }

  let filteredSongs = []

  if (tag === 'Other') {
    // "Other": songs with NO tags OR no language tags
    filteredSongs = allMusic.filter((song: any) => {
      if (!song.tags || song.tags.length === 0) {
        console.log(`📌 "${song.title}" → No tags, goes to Other`)
        return true
      }
      const hasLang = hasLanguageTag(song)
      if (!hasLang) {
        console.log(`📌 "${song.title}" → Tags: ${song.tags.join(', ')} → No language tag, goes to Other`)
      }
      return !hasLang
    })
  } else {
    // Language album: songs that have this specific tag (case‑insensitive)
    const targetTagLower = tag.toLowerCase()
    filteredSongs = allMusic.filter((song: any) => {
      if (!song.tags || song.tags.length === 0) return false
      const match = song.tags.some((t: string) => {
        const trimmed = t.toLowerCase().trim()
        return trimmed === targetTagLower
      })
      if (match) {
        console.log(`✅ "${song.title}" → Has tag "${tag}"`)
      }
      return match
    })
  }

  // Sort A‑Z by title
  filteredSongs.sort((a: any, b: any) => a.title.localeCompare(b.title))

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase()
    filteredSongs = filteredSongs.filter((item: any) =>
      item.title.toLowerCase().includes(searchLower)
    )
  }

  console.log(`📊 "${tag}" album has ${filteredSongs.length} songs`)
  return { items: filteredSongs, total: filteredSongs.length }
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
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        {total} {total === 1 ? 'track' : 'tracks'} • A–Z
      </p>

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

      {/* Three‑column list – no horizontal lines */}
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