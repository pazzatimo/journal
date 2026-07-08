import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

async function getStories() {
  return await client.fetch(`
    *[_type == "story"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      coverImage
    }
  `)
}

export default async function StoriesPage() {
  const stories = await getStories()

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        Stories
      </h1>

      {stories.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No stories yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
          {stories.map((story: any) => (
            <article key={story._id}>
              <Link href={`/stories/${story.slug?.current}`} style={{ textDecoration: 'none' }}>
                {story.coverImage && (
                  <div style={{ position: 'relative', height: '180px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <Image
                      src={urlFor(story.coverImage).url()}
                      alt={story.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 260px"
                    />
                  </div>
                )}
                <h2 style={{ fontSize: '1.1rem', fontWeight: '400', color: '#1a1a1a' }}>
                  {story.title}
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {story.publishedAt
                    ? new Date(story.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}