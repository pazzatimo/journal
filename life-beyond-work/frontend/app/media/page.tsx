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

// Simple inline SVG icons – natural and subtle
const MusicIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

const VideoIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

export default async function MediaPage() {
  const folderData = await getFolderPreviews()
  const sidebarSections = await getSidebarLinks()

  const folders = [
    {
      name: 'Music',
      slug: 'music',
      count: folderData.Music.count,
      items: folderData.Music.items,
      icon: <MusicIcon />,
      description: 'There’s nothing like music. You know, God heals by music. Did you know that? Uh-huh. God heals by music.',
      author: 'Rev. William Marrion Branham',
    },
    {
      name: 'Videos',
      slug: 'videos',
      count: folderData.Videos.count,
      items: folderData.Videos.items,
      icon: <VideoIcon />,
      description: 'Watch our video collection.',
      author: '',
    },
    {
      name: 'Documents',
      slug: 'documents',
      count: folderData.Documents.count,
      items: folderData.Documents.items,
      icon: <DocumentIcon />,
      description: 'Browse our documents and resources.',
      author: '',
    },
  ]

  return (
    <div className="page-main-content" style={{ maxWidth: '880px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <MobileSidebar sections={sidebarSections} />

      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: '400', color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        Media Library
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
        Browse our collection of music, videos, and documents.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {folders.map((folder) => (
          <Link key={folder.slug} href={`/media/${folder.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="folder-card">
              <div style={{ color: '#4b5563', marginBottom: '0.75rem' }}>
                {folder.icon}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '400', color: '#111827', letterSpacing: '-0.01em' }}>
                {folder.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.15rem' }}>
                {folder.count} {folder.count === 1 ? 'item' : 'items'}
              </div>
              {/* Music folder gets the quote */}
              {folder.slug === 'music' && folder.description && (
                <div style={{
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#4b5563',
                  fontStyle: 'italic',
                  lineHeight: '1.5',
                  borderTop: '1px solid #f3f4f6',
                  paddingTop: '0.75rem',
                }}>
                  <span>“{folder.description}”</span>
                  {folder.author && <span style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>— {folder.author}</span>}
                </div>
              )}
              {/* For other folders, show a simple description */}
              {folder.slug !== 'music' && folder.description && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#6b7280',
                }}>
                  {folder.description}
                </div>
              )}
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#2563eb', fontWeight: '400' }}>
                Browse →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .folder-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.5rem 1.25rem;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }
        .folder-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transform: translateY(-1px);
        }
        .folder-card svg {
          stroke: #4b5563;
        }
        .folder-card:hover svg {
          stroke: #111827;
        }
      `}</style>
    </div>
  )
}