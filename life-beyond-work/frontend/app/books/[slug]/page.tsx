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
}

async function getBook(slug: string) {
  const allBooks = await client.fetch(`
    *[_type == "book"] {
      _id,
      title,
      authorName,
      publishedAt,
      coverImage,
      rating,
      recommendation,
      notes,
      purchaseLink,
      tags,
      slug
    }
  `)
  
  const book = allBooks.find((a: any) => a.slug?.current === slug)
  return book || null
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)

  if (!book) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '300' }}>Book not found</h1>
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>The book you're looking for doesn't exist.</p>
        <Link href="/books" style={{ color: '#2563eb', textDecoration: 'underline', display: 'inline-block', marginTop: '1rem' }}>
          ← Back to all books
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
      <article>
        {/* Header with Book Cover */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {book.coverImage && (
            <div style={{ 
              position: 'relative', 
              width: '180px', 
              height: '260px', 
              borderRadius: '0.75rem', 
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              flexShrink: 0
            }}>
              <Image
                src={urlFor(book.coverImage).url()}
                alt={book.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '2.5rem, fontWeight: '400', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '0.5rem' }}>
              {book.title}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#4b5563' }}>by {book.authorName}</p>
            {book.rating && (
              <p style={{ color: '#d97706', fontSize: '1rem', marginTop: '0.25rem' }}>★ {book.rating}/5</p>
            )}
            {book.purchaseLink && (
              <a
                href={book.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                Buy this book
              </a>
            )}
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {book.publishedAt 
                ? new Date(book.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : ''
              }
            </p>
          </div>
        </div>

        {/* Recommendation */}
        {book.recommendation && (
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              Why I recommend this book
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.7' }}>
              {book.recommendation}
            </p>
          </div>
        )}

        {/* Notes */}
        {book.notes && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>
              My Notes
            </h2>
            <div style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#1a1a1a' }}>
              <PortableText value={book.notes} components={portableTextComponents} />
            </div>
          </div>
        )}

        {/* Tags */}
        {book.tags && book.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {book.tags.map((tag: string) => (
              <span key={tag} style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px',
                fontSize: '0.75rem',
                color: '#4b5563'
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}