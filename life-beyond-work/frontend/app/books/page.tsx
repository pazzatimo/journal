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
      recommendation
    }
  `)
}

export default async function BooksPage() {
  const books = await getBooks()

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light mb-8">Book Recommendations</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {books.length === 0 ? (
          <p className="text-gray-500 col-span-3">No books yet.</p>
        ) : (
          books.map((book: any) => (
            <article key={book._id} className="group">
              <Link href={`/books/${book.slug?.current}`}>
                {book.coverImage && (
                  <div className="relative h-56 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(book.coverImage).url()}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <h2 className="text-lg font-medium group-hover:text-blue-600 transition">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500">by {book.authorName}</p>
                {book.rating && (
                  <p className="text-sm text-yellow-500">⭐ {book.rating}/5</p>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
    </main>
  )
}