import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

async function getContent() {
  const articles = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0...6] {
      _id,
      title,
      slug,
      publishedAt,
      summary,
      coverImage
    }
  `)

  const stories = await client.fetch(`
    *[_type == "story"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      coverImage
    }
  `)

  return { articles, stories }
}

export default async function Home() {
  const { articles, stories } = await getContent()

  const featuredArticle = articles[0]
  const remainingArticles = articles.slice(1)
  const featuredStory = stories[0]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 4rem 2rem' }}>
      
      {/* Site Header */}
      <div style={{ padding: '2rem 0', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '0.25rem' }}>
          Life Beyond Work
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          A personal journal by Timo Pazza
        </p>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <div style={{ marginTop: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Featured Article
          </p>
          <Link href={`/articles/${featuredArticle.slug?.current}`} style={{ textDecoration: 'none' }}>
            <div>
              {featuredArticle.coverImage ? (
                <div style={{ position: 'relative', height: '320px', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                  <Image src={urlFor(featuredArticle.coverImage).url()} alt={featuredArticle.title} fill style={{ objectFit: 'cover' }} priority />
                </div>
              ) : (
                <div style={{ height: '320px', borderRadius: '0.75rem', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  No cover image
                </div>
              )}
              <h2 style={{ fontSize: '2rem', fontWeight: '400', color: '#1a1a1a', marginTop: '1rem' }}>
                {featuredArticle.title}
              </h2>
              {featuredArticle.summary && (
                <p style={{ color: '#4b5563', fontSize: '1rem' }}>{featuredArticle.summary}</p>
              )}
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {featuredArticle.publishedAt
                  ? new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : ''}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* More Articles Grid */}
      {remainingArticles.length > 0 && (
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '300', color: '#1a1a1a' }}>More Articles</h2>
            <Link href="/articles" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
            {remainingArticles.map((article: any) => (
              <Link key={article._id} href={`/articles/${article.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div>
                  {article.coverImage ? (
                    <div style={{ position: 'relative', height: '180px', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                      <Image src={urlFor(article.coverImage).url()} alt={article.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '180px', borderRadius: '0.5rem', backgroundColor: '#e5e7eb' }} />
                  )}
                  <h3 style={{ fontSize: '1rem', fontWeight: '400', color: '#1a1a1a', marginTop: '0.5rem' }}>
                    {article.title}
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Story */}
      {featuredStory && (
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Featured Story
          </p>
          <Link href={`/stories/${featuredStory.slug?.current}`} style={{ textDecoration: 'none' }}>
            <div>
              {featuredStory.coverImage ? (
                <div style={{ position: 'relative', height: '280px', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                  <Image src={urlFor(featuredStory.coverImage).url()} alt={featuredStory.title} fill style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: '280px', borderRadius: '0.75rem', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  No cover image
                </div>
              )}
              <h2 style={{ fontSize: '1.8rem', fontWeight: '400', color: '#1a1a1a', marginTop: '1rem' }}>
                {featuredStory.title}
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {featuredStory.publishedAt
                  ? new Date(featuredStory.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : ''}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* More Stories */}
      {stories.length > 1 && (
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '300', color: '#1a1a1a' }}>More Stories</h2>
            <Link href="/stories" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {stories.slice(1).map((story: any) => (
              <Link key={story._id} href={`/stories/${story.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div>
                  {story.coverImage ? (
                    <div style={{ position: 'relative', height: '160px', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                      <Image src={urlFor(story.coverImage).url()} alt={story.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '160px', borderRadius: '0.5rem', backgroundColor: '#e5e7eb' }} />
                  )}
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '400', color: '#1a1a1a', marginTop: '0.5rem' }}>
                    {story.title}
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                    {story.publishedAt
                      ? new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}