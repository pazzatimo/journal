import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

async function getBooks() {
  return await client.fetch(`
    *[_type == "book"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      authorName,
      coverImage,
      rating,
      publishedAt
    }
  `)
}

export default async function BooksPage() {
  const books = await getBooks()

  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        Book Recommendations
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
        {books.length === 0 ? (
          <p style={{ color: '#9ca3af', gridColumn: '1 / -1' }}>No books yet.</p>
        ) : (
          books.map((book: any) => (
            <article key={book._id}>
              <Link href={`/books/${book.slug?.current}`} style={{ textDecoration: 'none' }}>
                {book.coverImage && (
                  <div style={{ position: 'relative', height: '240px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <Image
                      src={urlFor(book.coverImage).url()}
                      alt={book.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="200px"
                    />
                  </div>
                )}
                <h2 style={{ fontSize: '1rem', fontWeight: '400', color: '#1a1a1a' }}>
                  {book.title}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>by {book.authorName}</p>
                {book.rating && <p style={{ color: '#d97706', fontSize: '0.9rem' }}>★ {book.rating}/5</p>}
                <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                  {book.publishedAt
                    ? new Date(book.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
                </p>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}