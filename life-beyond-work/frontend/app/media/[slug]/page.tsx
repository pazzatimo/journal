import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LikeButton } from '@/components/LikeButton'
import { Comments } from '@/components/Comments'
import { ShareButtons } from '@/components/ShareButtons'
import { MobileSidebar } from '@/components/MobileSidebar'

// ----------------------------------------------
// FIXED: fetch only the matching document directly
// ----------------------------------------------
async function getMediaItem(slug: string) {
  const query = `*[_type == "media" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    description,
    thumbnail,
    file,
    lyrics,
    publishedAt,
    tags,
    likes
  }`
  return await client.fetch(query, { slug })
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

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Debug: check what slug is being received
  console.log('🔍 Media page slug:', slug)

  const item = await getMediaItem(slug)
  const sidebarSections = await getSidebarLinks()

  if (!item) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timopazza.com'
  const url = `${baseUrl}/media/${slug}`
  const title = item.title

  let fileUrl = ''
  if (item.file?.asset?._ref) {
    fileUrl = getSanityFileUrl(item.file.asset._ref)
  }

  const isAudio = item.category === 'audio' || item.category === 'song'
  const isVideo = item.category === 'video'
  const isDocument = item.category === 'document'

  return (
    <div className="page-main-content" style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 0 4rem 0' }}>
      <MobileSidebar sections={sidebarSections} />

      <Link href="/media" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>
        ← Back to Media
      </Link>

      {item.thumbnail && (
        <div style={{ position: 'relative', height: 'clamp(200px, 40vw, 320px)', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem', backgroundColor: '#f3f4f6' }}>
          <Image src={urlFor(item.thumbnail).url()} alt={item.title} fill style={{ objectFit: 'cover' }} priority sizes="(max-width: 720px) 100vw, 720px" />
        </div>
      )}

      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.5rem' }}>{getCategoryEmoji(item.category)}</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {getCategoryLabel(item.category)}
          </span>
          {item.tags?.includes('Kiswahili') && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '500',
              color: '#ffffff',
              background: '#1a1a1a',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
            }}>
              🇹🇿 Kiswahili
            </span>
          )}
          {item.tags?.includes('English') && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '500',
              color: '#ffffff',
              background: '#2563eb',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
            }}>
              🇬🇧 English
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '400', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '0.5rem' }}>
          {item.title}
        </h1>
        {item.description && (
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#4b5563', marginBottom: '1rem' }}>
            {item.description}
          </p>
        )}
        {item.publishedAt && (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            {new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {item.tags.filter((tag: string) => tag !== 'Kiswahili' && tag !== 'English').map((tag: string) => (
              <span key={tag} style={{
                backgroundColor: '#f3f4f6',
                padding: '0.2rem 0.7rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                color: '#4b5563',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {fileUrl && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb',
        }}>
          {isVideo && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <video
                controls
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '0.5rem',
                }}
              >
                <source src={fileUrl} />
                Your browser does not support the video element.
              </video>
            </div>
          )}

          {isAudio && (
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                {getCategoryEmoji(item.category)} {item.title}
              </p>
              <audio controls style={{ width: '100%' }}>
                <source src={fileUrl} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {isDocument && (
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                📄 Document: {item.title}
              </p>
              <a
                href={fileUrl}
                download
                style={{
                  display: 'inline-block',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                📥 Download Document
              </a>
            </div>
          )}
        </div>
      )}

      {item.lyrics && isAudio && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: '400', color: '#1a1a1a', marginBottom: '0.5rem' }}>
            Lyrics
          </h2>
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
            lineHeight: '1.8',
            color: '#1a1a1a',
          }}>
            {item.lyrics}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <LikeButton initialLikes={item.likes || 0} id={item._id} type="media" />
          <ShareButtons url={url} title={title} />
        </div>
      </div>

      {/* Comments */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>Comments</h3>
        <Comments id={item._id} title={item.title} url={url} />
      </div>
    </div>
  )
}