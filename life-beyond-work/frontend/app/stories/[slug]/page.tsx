import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p style={{ marginBottom: '1.5rem', lineHeight: '1.9', color: '#1a1a1a', fontSize: '1.1rem' }}>{children}</p>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <div style={{ margin: '1.5rem 0' }}>
        <img src={urlFor(value).url()} alt="Story image" style={{ borderRadius: '0.75rem', width: '100%' }} />
      </div>
    ),
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
      slug
    }
  `)
  
  const story = allStories.find((a: any) => a.slug?.current === slug)
  return story || null
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '300' }}>Story not found</h1>
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>The story you're looking for doesn't exist.</p>
        <Link href="/stories" style={{ color: '#2563eb', textDecoration: 'underline', display: 'inline-block', marginTop: '1rem' }}>
          ← Back to all stories
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
      <article>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '400', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '1rem' }}>
            {story.title}
          </h1>
          
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            <time dateTime={story.publishedAt}>
              {story.publishedAt 
                ? new Date(story.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Date not set'
              }
            </time>
            {story.categories && story.categories.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {story.categories.map((cat: string) => (
                  <span key={cat} style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    color: '#4b5563'
                  }}>
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {story.coverImage && (
          <div style={{ 
            position: 'relative', 
            height: '400px', 
            width: '100%', 
            marginBottom: '2rem', 
            borderRadius: '0.75rem', 
            overflow: 'hidden',
            backgroundColor: '#f3f4f6'
          }}>
            <Image
              src={urlFor(story.coverImage).url()}
              alt={story.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Story Content */}
        <div style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#1a1a1a' }}>
          {story.storyContent && <PortableText value={story.storyContent} components={portableTextComponents} />}
        </div>
      </article>
    </div>
  )
}