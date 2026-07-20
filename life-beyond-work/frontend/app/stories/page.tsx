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
      coverImage,
      categories
    }
  `)
}

export default async function StoriesPage() {
  const stories = await getStories()

  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        Stories
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
        {stories.length === 0 ? (
          <p style={{ color: '#9ca3af', gridColumn: '1 / -1' }}>No stories yet.</p>
        ) : (
          stories.map((story: any) => (
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
                {story.categories && story.categories.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {story.categories.map((cat: string) => (
                      <span key={cat} style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', color: '#4b5563' }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
export const revalidate = 60;