import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

async function getDocumentItems() {
  const query = `*[_type == "media" && category == "document"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    thumbnail,
    publishedAt
  }`
  return await client.fetch(query)
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

export default async function DocumentsPage() {
  const items = await getDocumentItems()
  const sidebarSections = await getSidebarLinks()

  return (
    <div
      className="page-main-content"
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem 0 4rem 0',
      }}
    >
      <MobileSidebar sections={sidebarSections} />

      <Link
        href="/media"
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: '#2563eb',
          textDecoration: 'none',
        }}
      >
        ← Back to Media
      </Link>

      <h1
        style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '2rem',
        }}
      >
        📄 Documents
      </h1>

      {items.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No documents found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item: any) => (
            <Link
              key={item._id}
              href={`/media/${item.slug.current}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div className="media-item">
                {item.thumbnail && (
                  <div
                    style={{
                      position: 'relative',
                      width: '60px',
                      height: '60px',
                      flexShrink: 0,
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6',
                    }}
                  >
                    <Image
                      src={urlFor(item.thumbnail).url()}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: '400',
                      color: '#1a1a1a',
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.2rem',
                    }}
                  >
                    {getCategoryEmoji(item.category)} {item.category}
                    {item.publishedAt &&
                      ` • ${new Date(item.publishedAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}`}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .media-item {
          display: flex;
          gap: 1rem;
          align-items: center;
          border-bottom: 1px solid #f3f4f6;
          padding: 0.75rem 0;
          transition: opacity 0.2s ease;
        }
        .media-item:hover {
          opacity: 0.7;
        }
        .media-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  )
}