import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

async function getFolderPreviews() {
  const [music, videos, documents] = await Promise.all([
    client.fetch(`{
      "count": count(*[_type == "media" && (category == "song" || category == "audio")]),
      "items": *[_type == "media" && (category == "song" || category == "audio")] | order(publishedAt desc)[0...5] {
        _id, title, slug, category, thumbnail, publishedAt
      }
    }`),
    client.fetch(`{
      "count": count(*[_type == "media" && category == "video"]),
      "items": *[_type == "media" && category == "video"] | order(publishedAt desc)[0...5] {
        _id, title, slug, category, thumbnail, publishedAt
      }
    }`),
    client.fetch(`{
      "count": count(*[_type == "media" && category == "document"]),
      "items": *[_type == "media" && category == "document"] | order(publishedAt desc)[0...5] {
        _id, title, slug, category, thumbnail, publishedAt
      }
    }`),
  ])

  return { Music: music, Videos: videos, Documents: documents }
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = { song: '🎵', audio: '🎧', video: '🎬', document: '📄' }
  return emojis[category] || '📁'
}

export default async function MediaPage() {
  const folderData = await getFolderPreviews()
  const sidebarSections = await getSidebarLinks()

  const folders = [
    { name: 'Music', slug: 'music', emoji: '🎵', count: folderData.Music.count, items: folderData.Music.items },
    { name: 'Videos', slug: 'videos', emoji: '🎬', count: folderData.Videos.count, items: folderData.Videos.items },
    { name: 'Documents', slug: 'documents', emoji: '📄', count: folderData.Documents.count, items: folderData.Documents.items },
  ]

  return (
    <div className="page-main-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <MobileSidebar sections={sidebarSections} />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '400', color: '#111827', marginBottom: '0.5rem' }}>
        Media Library
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
        Browse our collection of music, videos, and documents.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {folders.map((folder) => (
          <Link key={folder.slug} href={`/media/${folder.slug}`} style={{ textDecoration: 'none' }}>
            <div className="folder-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '2rem 1.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{folder.emoji}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '500', color: '#111827' }}>{folder.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{folder.count} item{folder.count !== 1 ? 's' : ''}</div>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#2563eb' }}>Browse →</div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .folder-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
          transform: translateY(-2px);
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  )
}