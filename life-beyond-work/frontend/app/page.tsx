import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

// Define types for content items
interface Article {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  summary: string
  coverImage: any
  _type: string
}

interface Story {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  coverImage: any
  _type: string
}

interface Book {
  _id: string
  title: string
  slug: { current: string }
  authorName: string
  publishedAt: string
  coverImage: any
  rating: number
  _type: string
}

interface Quote {
  _id: string
  quoteText: string
  quoteAuthor: string
  context: string
}

async function getSiteSettings() {
  try {
    return await client.fetch(`
      *[_type == "siteSettings"][0] {
        heroImage,
        heroTitle,
        heroSubtitle
      }
    `);
  } catch (error) {
    console.error('Failed to fetch hero settings:', error);
    return null;
  }
}

async function getContent() {
  const articles: Article[] = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0...6] {
      _id,
      title,
      slug,
      publishedAt,
      summary,
      coverImage,
      _type
    }
  `)

  const stories: Story[] = await client.fetch(`
    *[_type == "story"] | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug,
      publishedAt,
      coverImage,
      _type
    }
  `)

  const quotes: Quote[] = await client.fetch(`
    *[_type == "quote"] | order(publishedAt desc) [0...3] {
      _id,
      quoteText,
      quoteAuthor,
      context
    }
  `)

  const books: Book[] = await client.fetch(`
    *[_type == "book"] | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug,
      authorName,
      coverImage,
      rating,
      _type
    }
  `)

  return { articles, stories, quotes, books }
}

export default async function Home() {
  const siteSettings = await getSiteSettings()
  const { articles, stories, quotes, books } = await getContent()

  const featuredArticle = articles[0]
  const remainingArticles = articles.slice(1)

  const heroImage = siteSettings?.heroImage || null
  const heroTitle = siteSettings?.heroTitle || 'Thoughts, Stories & Moments Beyond Work'
  const heroSubtitle = siteSettings?.heroSubtitle || 'A personal journal by Timo Pazza — exploring life beyond the professional world.'

  // Now TypeScript knows the types
  const allPublications = [
    ...articles.map((a: Article) => ({ ...a, type: 'article', link: `/articles/${a.slug?.current}` })),
    ...stories.map((s: Story) => ({ ...s, type: 'story', link: `/stories/${s.slug?.current}` })),
    ...books.map((b: Book) => ({ ...b, type: 'book', link: `/books/${b.slug?.current}` })),
  ].slice(0, 6)

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { article: 'Article', story: 'Story', book: 'Book' }
    return labels[type] || type
  }

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section className="hero-section">
        {heroImage ? (
          <div className="hero-background">
            <Image
              src={urlFor(heroImage).url()}
              alt="Hero"
              fill
              style={{ objectFit: 'cover' }}
              priority
              loading="eager"
              sizes="100vw"
            />
            <div className="hero-overlay" />
          </div>
        ) : (
          <div className="hero-background" style={{ background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)' }} />
        )}

        <div className="hero-content">
          <span className="hero-badge">Life Beyond Work</span>
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-description">{heroSubtitle}</p>
          {featuredArticle && (
            <Link 
              href={`/articles/${featuredArticle.slug?.current}`}
              className="hero-cta"
            >
              Read the latest article →
            </Link>
          )}
        </div>
      </section>

      {/* Featured Publications Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', color: '#1a1a1a' }}>Featured</h2>
          <Link href="/articles" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {allPublications.length === 0 ? (
            <p style={{ color: '#9ca3af', gridColumn: '1 / -1' }}>No publications yet.</p>
          ) : (
            allPublications.map((item: any) => (
              <Link key={item._id} href={item.link} style={{ textDecoration: 'none' }}>
                <div className="grid-card" style={{ height: '100%', position: 'relative' }}>
                  <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                    {item.coverImage ? (
                      <Image
                        src={urlFor(item.coverImage).url()}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 260px"
                      />
                    ) : (
                      <div style={{ height: '100%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                        No image
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
                      {getTypeLabel(item.type)}
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '500', color: '#1a1a1a', lineHeight: '1.3', marginBottom: '0.25rem' }}>
                      {item.title}
                    </h3>
                    {item.authorName && (
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>by {item.authorName}</p>
                    )}
                    {item.rating && (
                      <p style={{ color: '#d97706', fontSize: '0.8rem' }}>★ {item.rating}/5</p>
                    )}
                    <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                      {item.publishedAt 
                        ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Latest Articles */}
      <section style={{ marginBottom: '3rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', color: '#1a1a1a' }}>Latest Articles</h2>
          <Link href="/articles" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {remainingArticles.length === 0 ? (
            <p style={{ color: '#9ca3af', gridColumn: '1 / -1' }}>No more articles yet.</p>
          ) : (
            remainingArticles.map((article: Article) => (
              <Link key={article._id} href={`/articles/${article.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div className="grid-card" style={{ height: '100%', position: 'relative' }}>
                  <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                    {article.coverImage ? (
                      <Image
                        src={urlFor(article.coverImage).url()}
                        alt={article.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 280px"
                      />
                    ) : (
                      <div style={{ height: '100%', background: '#e5e7eb' }} />
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem', lineHeight: '1.3' }}>
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.summary}
                      </p>
                    )}
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      {article.publishedAt 
                        ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Stories */}
      <section style={{ marginBottom: '3rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', color: '#1a1a1a' }}>Stories</h2>
          <Link href="/stories" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {stories.length === 0 ? (
            <p style={{ color: '#9ca3af', gridColumn: '1 / -1' }}>No stories yet.</p>
          ) : (
            stories.map((story: Story) => (
              <Link key={story._id} href={`/stories/${story.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div className="grid-card" style={{ height: '100%', position: 'relative' }}>
                  <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                    {story.coverImage ? (
                      <Image
                        src={urlFor(story.coverImage).url()}
                        alt={story.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 220px"
                      />
                    ) : (
                      <div style={{ height: '100%', background: '#e5e7eb' }} />
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '500', color: '#1a1a1a', lineHeight: '1.3' }}>
                      {story.title}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                      {story.publishedAt 
                        ? new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Quotes */}
      <section style={{ marginBottom: '3rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', color: '#1a1a1a' }}>Quotes</h2>
          <Link href="/quotes" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {quotes.length === 0 ? (
            <p style={{ color: '#9ca3af', gridColumn: '1 / -1' }}>No quotes yet.</p>
          ) : (
            quotes.map((quote: Quote) => (
              <blockquote key={quote._id} className="quote-card" style={{ margin: 0 }}>
                <p style={{ fontSize: '1rem', fontStyle: 'italic', color: '#1a1a1a', lineHeight: '1.6' }}>
                  "{quote.quoteText}"
                </p>
                <footer style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  — {quote.quoteAuthor}
                  {quote.context && <span style={{ color: '#9ca3af' }}>, {quote.context}</span>}
                </footer>
              </blockquote>
            ))
          )}
        </div>
      </section>

      {/* Books */}
      <section style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', color: '#1a1a1a' }}>Book Recommendations</h2>
          <Link href="/books" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {books.length === 0 ? (
            <p style={{ color: '#9ca3af', gridColumn: '1 / -1' }}>No books yet.</p>
          ) : (
            books.map((book: Book) => (
              <Link key={book._id} href={`/books/${book.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div className="grid-card" style={{ height: '100%', textAlign: 'center', position: 'relative' }}>
                  <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                    {book.coverImage ? (
                      <Image
                        src={urlFor(book.coverImage).url()}
                        alt={book.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="160px"
                      />
                    ) : (
                      <div style={{ height: '100%', background: '#e5e7eb' }} />
                    )}
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '500', color: '#1a1a1a', lineHeight: '1.3' }}>
                      {book.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>by {book.authorName}</p>
                    {book.rating && (
                      <p style={{ color: '#d97706', fontSize: '0.8rem' }}>★ {book.rating}/5</p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

    </div>
  )
}