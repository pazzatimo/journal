import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

// Language tags (case‑insensitive matching now)
const LANGUAGE_TAGS = ['Kiswahili', 'English', 'Portuguese', 'Spanish', 'French', 'German']
const LANGUAGE_TAGS_LOWERCASE = LANGUAGE_TAGS.map(t => t.toLowerCase())

async function getMusicAlbums() {
  // Fetch ALL music items (songs + audio)
  const items = await client.fetch(`
    *[_type == "media" && (category == "song" || category == "audio")] {
      _id,
      title,
      slug,
      tags,
      thumbnail,
      publishedAt
    }
  `)

  // Helper: check if a song has any language tag (case‑insensitive)
  function hasLanguageTag(song: any): boolean {
    if (!song.tags || song.tags.length === 0) return false
    return song.tags.some((t: string) =>
      LANGUAGE_TAGS_LOWERCASE.includes(t.toLowerCase().trim())
    )
  }

  // Group by language tag (case‑insensitive)
  const albums: Record<string, any[]> = {}

  LANGUAGE_TAGS.forEach(tag => {
    const lowerTag = tag.toLowerCase()
    albums[tag] = items.filter((item: any) => {
      if (!item.tags || item.tags.length === 0) return false
      return item.tags.some((t: string) =>
        t.toLowerCase().trim() === lowerTag
      )
    })
  })

  // "Other": songs with NO tags OR no language tags
  albums['Other'] = items.filter((item: any) => {
    if (!item.tags || item.tags.length === 0) return true
    return !hasLanguageTag(item)
  })

  // Sort each album chronologically (newest first)
  Object.keys(albums).forEach(key => {
    albums[key].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  })

  return albums
}

export default async function MusicPage() {
  const albums = await getMusicAlbums()
  const sidebarSections = await getSidebarLinks()

  // Remove empty albums so they don't appear as empty cards
  const filteredAlbums = Object.fromEntries(
    Object.entries(albums).filter(([_, items]) => items.length > 0)
  )

  const getCover = (items: any[]) => {
    return items.find(item => item.thumbnail)?.thumbnail || null
  }

  return (
    <div className="page-main-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <MobileSidebar sections={sidebarSections} />

      <Link href="/media" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>
        ← Back to Media Library
      </Link>

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '400', color: '#111827', marginBottom: '0.5rem' }}>
        🎵 Music
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
        Browse by language / album collection.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
        {Object.entries(filteredAlbums).map(([albumName, items]) => {
          const cover = getCover(items)
          const slug = albumName.toLowerCase()

          return (
            <Link key={albumName} href={`/media/music/${slug}`} style={{ textDecoration: 'none' }}>
              <div className="album-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
                <div style={{ position: 'relative', aspectRatio: '1/1', backgroundColor: '#f3f4f6' }}>
                  {cover ? (
                    <Image src={urlFor(cover).url()} alt={albumName} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>🎵</div>
                  )}
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontWeight: '500', color: '#111827', fontSize: '0.95rem' }}>
                    {albumName === 'Other' ? 'Uncategorized' : albumName} Songs
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{items.length} tracks</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <style>{`
        .album-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  )
}