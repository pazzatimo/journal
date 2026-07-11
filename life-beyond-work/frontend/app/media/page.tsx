import { client, urlFor, getBaseUrl } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

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
      likes
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

export default async function MediaPage() {
  const mediaItems = await getMedia()

  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        Media
      </h1>

      {mediaItems.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No media yet. Upload your first song, audio, video, or document in Sanity Studio!</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {mediaItems.map((item: any) => {
            // Ensure slug exists, fallback to _id if missing (should not happen)
            const slug = item.slug?.current || item._id
            return (
              <Link key={item._id} href={`/media/${slug}`} style={{ textDecoration: 'none' }}>
                <div className="grid-card" style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '0.75rem',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '66.67%', backgroundColor: '#f3f4f6' }}>
                    {item.thumbnail ? (
                      <Image
                        src={urlFor(item.thumbnail).url()}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 280px"
                      />
                    ) : (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: '#9ca3af',
                      }}>
                        {getCategoryEmoji(item.category)}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {getCategoryEmoji(item.category)} {getCategoryLabel(item.category)}
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem', lineHeight: '1.3' }}>
                      {item.title}
                    </h2>
                    {item.description && (
                      <p style={{ color: '#4b5563', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {item.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{
                            backgroundColor: '#f3f4f6',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.6rem',
                            color: '#4b5563',
                          }}>
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span style={{
                            fontSize: '0.6rem',
                            color: '#9ca3af',
                          }}>
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginTop: '0.5rem' }}>
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : ''}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}