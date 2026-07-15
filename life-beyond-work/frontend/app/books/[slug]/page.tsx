'use client'

import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { LikeButton } from '@/components/LikeButton'
import { Comments } from '@/components/Comments'
import { ShareButtons } from '@/components/ShareButtons'
import { useEffect, useState } from 'react'

// Portable Text components for rendering rich text with proper paragraph breaks
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p style={{ marginBottom: '1.5rem', lineHeight: '1.9', color: '#1a1a1a', fontSize: '1.1rem' }}>{children}</p>,
    h1: ({ children }: any) => <h1 style={{ fontSize: '2rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>{children}</h1>,
    h2: ({ children }: any) => <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>{children}</h2>,
    h3: ({ children }: any) => <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem', color: '#1a1a1a' }}>{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote style={{ borderLeft: '4px solid #d1d5db', paddingLeft: '1.5rem', fontStyle: 'italic', color: '#374151', margin: '1.5rem 0' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>{children}</ul>,
    number: ({ children }: any) => <ol style={{ listStyle: 'decimal', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>{children}</li>,
    number: ({ children }: any) => <li style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>{children}</li>,
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
      slug,
      likes
    }
  `)
  return allBooks.find((b: any) => b.slug?.current === slug) || null
}

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    params.then((p) => {
      setSlug(p.slug)
      getBook(p.slug).then((data) => {
        setBook(data)
        setLoading(false)
      })
    })
  }, [params])

  if (!mounted || loading) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Loading...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>Book not found</h1>
        <Link href="/books">← Back</Link>
      </div>
    )
  }

  const url = `https://timopazza.com/books/${slug}`
  const title = book.title

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
      <article>
        {/* Book Header with Cover */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {book.coverImage ? (
            <div style={{ position: 'relative', width: '180px', height: '260px', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: '#f3f4f6', flexShrink: 0 }}>
              <Image
                src={urlFor(book.coverImage).url()}
                alt={book.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="180px"
              />
            </div>
          ) : (
            <div style={{ width: '180px', height: '260px', borderRadius: '0.75rem', backgroundColor: '#e5e7eb', flexShrink: 0 }} />
          )}
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '0.5rem' }}>{book.title}</h1>
            <p style={{ fontSize: '1.1rem', color: '#4b5563' }}>by {book.authorName}</p>
            {book.rating && <p style={{ color: '#d97706', fontSize: '1rem' }}>★ {book.rating}/5</p>}
            {book.purchaseLink && (
              <a
                href={book.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '0.75rem', backgroundColor: '#1a1a1a', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontSize: '0.875rem' }}
              >
                Buy this book
              </a>
            )}
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {book.publishedAt ? new Date(book.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            </p>
          </div>
        </div>

        {/* Recommendation - Now using PortableText for proper paragraph breaks */}
        {book.recommendation && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>Why I recommend this book</h2>
            {/* Render recommendation as PortableText with proper paragraph breaks */}
            <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#1a1a1a' }}>
              <PortableText
                value={book.recommendation}
                components={portableTextComponents}
              />
            </div>
          </div>
        )}

        {/* Notes */}
        {book.notes && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>My Notes</h2>
            <div style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#1a1a1a' }}>
              <PortableText value={book.notes} components={portableTextComponents} />
            </div>
          </div>
        )}

        {/* Tags */}
        {book.tags && book.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {book.tags.map((tag: string) => <span key={tag} style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', color: '#4b5563' }}>#{tag}</span>)}
          </div>
        )}

        {/* Social Actions */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <LikeButton initialLikes={book.likes || 0} id={book._id} type="book" />
            <ShareButtons url={url} title={title} />
          </div>
        </div>

        {/* Comments */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>Comments</h3>
          <Comments id={book._id} title={book.title} url={url} />
        </div>
      </article>
    </div>
  )
}
export const revalidate = 60; // Revalidate every 60 seconds as fallback