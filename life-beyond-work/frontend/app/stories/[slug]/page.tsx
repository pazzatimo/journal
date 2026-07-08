import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { LikeButton } from '@/components/LikeButton'
import { Comments } from '@/components/Comments'
import { ShareButtons } from '@/components/ShareButtons'

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
      likes
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
            <Image src={urlFor(story.coverImage).url()} alt={story.title} fill style={{ objectFit: 'cover' }} priority />
          </div>
        )}

        <div style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#1a1a1a' }}>
          {story.storyContent && <PortableText value={story.storyContent} components={portableTextComponents} />}
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <LikeButton initialLikes={story.likes || 0} id={story._id} type="story" />
            <ShareButtons url={url} title={title} />
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>Comments</h3>
          <Comments id="comments" />
        </div>
      </article>
    </div>
  )
}