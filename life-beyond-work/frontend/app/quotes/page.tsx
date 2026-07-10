import { client, urlFor } from '@/lib/sanity'
import { LikeButton } from '@/components/LikeButton'
import { Comments } from '@/components/Comments'
import { ShareButtons } from '@/components/ShareButtons'

// Helper function to get embed URL from YouTube/Vimeo
function getEmbedUrl(url: string): string {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  if (url.includes('embed')) {
    return url
  }
  return url
}

// Helper to get Sanity file asset URL
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

async function getQuotes() {
  return await client.fetch(`
    *[_type == "quote"] | order(publishedAt desc) {
      _id,
      quoteText,
      quoteAuthor,
      context,
      tags,
      publishedAt,
      likes,
      audio,
      video
    }
  `)
}

function AudioPlayer({ audio }: { audio: any }) {
  if (!audio?.file) return null

  let audioUrl = ''
  if (audio.file.asset?._ref) {
    audioUrl = getSanityFileUrl(audio.file.asset._ref)
  }

  if (!audioUrl) return null

  return (
    <div style={{
      backgroundColor: '#f3f4f6',
      padding: '1rem 1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '0.75rem',
    }}>
      {audio.title && (
        <p style={{ fontSize: '0.8rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
          🎵 {audio.title}
        </p>
      )}
      <audio controls style={{ width: '100%' }}>
        <source src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

function VideoPlayer({ video }: { video: any }) {
  if (!video?.url) return null

  const embedUrl = getEmbedUrl(video.url)

  return (
    <div style={{
      marginBottom: '0.75rem',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }}>
      {video.title && (
        <p style={{ fontSize: '0.8rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
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

export default async function QuotesPage() {
  const quotes = await getQuotes()
  const baseUrl = 'https://timopazza.com'

  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '300', 
        color: '#1a1a1a', 
        marginBottom: '2rem', 
        borderBottom: '1px solid #e5e7eb', 
        paddingBottom: '1rem' 
      }}>
        Quotes
      </h1>

      {quotes.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No quotes yet. Create your first quote in Sanity Studio!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {quotes.map((quote: any) => {
            const quoteUrl = `${baseUrl}/quotes#${quote._id}`
            const quoteText = quote.quoteText

            const videoPosition = quote.video?.position || 'bottom'
            const showVideoTop = videoPosition === 'top'
            const showVideoBottom = videoPosition === 'bottom'

            return (
              <div 
                key={quote._id} 
                className="quote-card"
                id={quote._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.5rem 2rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                }}
              >
                {showVideoTop && quote.video && quote.video.url && (
                  <VideoPlayer video={quote.video} />
                )}

                {quote.audio && quote.audio.file && (
                  <AudioPlayer audio={quote.audio} />
                )}

                <blockquote style={{ margin: 0 }}>
                  <p style={{
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                    color: '#1a1a1a',
                    lineHeight: '1.7',
                    marginBottom: '0.75rem'
                  }}>
                    “{quote.quoteText}”
                  </p>
                  <footer style={{
                    fontSize: '0.95rem',
                    color: '#4b5563',
                    marginBottom: '0.5rem'
                  }}>
                    — {quote.quoteAuthor}
                    {quote.context && <span style={{ color: '#9ca3af' }}>, {quote.context}</span>}
                  </footer>
                  
                  {quote.tags && quote.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {quote.tags.map((tag: string) => (
                        <span key={tag} style={{
                          backgroundColor: '#f3f4f6',
                          padding: '0.2rem 0.7rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          color: '#4b5563'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {quote.publishedAt && (
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                      {new Date(quote.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </blockquote>

                {showVideoBottom && quote.video && quote.video.url && (
                  <VideoPlayer video={quote.video} />
                )}

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f3f4f6',
                  alignItems: 'center'
                }}>
                  <LikeButton initialLikes={quote.likes || 0} id={quote._id} type="quote" />
                  <ShareButtons url={quoteUrl} title={quoteText} />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <Comments id={quote._id} title="Quote" url={quoteUrl} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .quote-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          border-color: #d1d5db !important;
        }
      `}</style>
    </div>
  )
}