import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { LikeButton } from '@/components/LikeButton'
import { Comments } from '@/components/Comments'
import { ShareButtons } from '@/components/ShareButtons'

// Helper function to get embed URL from YouTube/Vimeo
function getEmbedUrl(url: string): string {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  // If it's already an embed URL, return as is
  if (url.includes('embed')) {
    return url
  }
  // Default: return original URL
  return url
}

// Helper to get Sanity file asset URL
function getSanityFileUrl(assetRef: string): string {
  if (!assetRef) return ''
  const ref = assetRef
  // Sanity file assets: file-{id}-{extension}
  const id = ref.replace(/^file-/, '').replace(/-\w+$/, '')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  // The extension is usually part of the asset, but we'll default to mp3
  // We can try to detect the extension from the ref
  const extMatch = ref.match(/-([a-z0-9]+)$/)
  const ext = extMatch ? extMatch[1] : 'mp3'
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`
}

// Audio Player Component
function AudioPlayer({ audio }: { audio: any }) {
  if (!audio?.file) return null

  // Get the audio URL from the file asset
  let audioUrl = ''
  if (audio.file.asset?._ref) {
    audioUrl = getSanityFileUrl(audio.file.asset._ref)
  }

  if (!audioUrl) return null

  return (
    <div style={{
      backgroundColor: '#f3f4f6',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '2rem',
    }}>
      {audio.title && (
        <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          🎵 {audio.title}
        </p>
      )}
      <audio controls style={{ width: '100%' }}>
        <source src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
      {audio.transcript && (
        <details style={{ marginTop: '0.75rem' }}>
          <summary style={{ fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer' }}>
            📄 Transcript
          </summary>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
            {audio.transcript}
          </p>
        </details>
      )}
    </div>
  )
}

// Video Player Component
function VideoPlayer({ video }: { video: any }) {
  if (!video?.url) return null

  const embedUrl = getEmbedUrl(video.url)

  return (
    <div style={{
      marginBottom: '2rem',
      borderRadius: '0.75rem',
      overflow: 'hidden',
    }}>
      {video.title && (
        <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          🎬 {video.title}
        </p>
      )}
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={embedUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allowFullScreen
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  )
}

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p style={{ marginBottom: '1.5rem', lineHeight: '1.9', color: '#1a1a1a', fontSize: '1.1rem' }}>{children}</p>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }: any) => <a href={value.href} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>{children}</a>,
  },
  types: {
    image: ({ value }: any) => <div style={{ margin: '1.5rem 0' }}><img src={urlFor(value).url()} alt="Image" style={{ borderRadius: '0.75rem', width: '100%' }} /></div>,
  },
}

async function getStory(slug: string) {
  const allStories = await client.fetch(`
    *[_type == "story"] {
      _id,
      title,
      publishedAt,
      coverImage,
      storyContent,
      categories,
      slug,
      likes,
      audio,
      video
    }
  `)
  return allStories.find((s: any) => s.slug?.current === slug) || null
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>Story not found</h1>
        <Link href="/stories">← Back</Link>
      </div>
    )
  }

  const url = `https://timopazza.com/stories/${slug}`
  const title = story.title

  const videoPosition = story.video?.position || 'bottom'
  const showVideoTop = videoPosition === 'top'
  const showVideoBottom = videoPosition === 'bottom'

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
      <article>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '400', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '1rem' }}>
            {story.title}
          </h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            <time>{story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not set'}</time>
            {story.categories && story.categories.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {story.categories.map((cat: string) => <span key={cat} style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', color: '#4b5563' }}>{cat}</span>)}
              </div>
            )}
          </div>
        </header>

        {story.coverImage && (
          <div style={{ position: 'relative', height: '400px', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem', backgroundColor: '#f3f4f6' }}>
            <Image src={urlFor(story.coverImage).url()} alt={story.title} fill style={{ objectFit: 'cover' }} priority sizes="(max-width: 720px) 100vw, 720px" />
          </div>
        )}

        {story.audio && story.audio.file && (
          <AudioPlayer audio={story.audio} />
        )}

        {showVideoTop && story.video && story.video.url && (
          <VideoPlayer video={story.video} />
        )}

        <div style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#1a1a1a' }}>
          {story.storyContent && <PortableText value={story.storyContent} components={portableTextComponents} />}
        </div>

        {showVideoBottom && story.video && story.video.url && (
          <VideoPlayer video={story.video} />
        )}

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <LikeButton initialLikes={story.likes || 0} id={story._id} type="story" />
            <ShareButtons url={url} title={title} />
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>Comments</h3>
          <Comments id={story._id} title={story.title} url={url} />
        </div>
      </article>
    </div>
  )
}