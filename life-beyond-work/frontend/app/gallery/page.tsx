import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

async function getGalleries() {
  return await client.fetch(`
    *[_type == "gallery"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      images,
      publishedAt
    }
  `)
}

export default async function GalleryPage() {
  const galleries = await getGalleries()

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light mb-8">Gallery</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.length === 0 ? (
          <p className="text-gray-500 col-span-3">No galleries yet.</p>
        ) : (
          galleries.map((gallery: any) => (
            <article key={gallery._id} className="group">
              <Link href={`/gallery/${gallery.slug?.current}`}>
                {gallery.images && gallery.images.length > 0 && (
                  <div className="relative h-56 w-full rounded-lg overflow-hidden mb-3">
                    <Image
                      src={urlFor(gallery.images[0].image).url()}
                      alt={gallery.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <h2 className="text-xl font-medium group-hover:text-blue-600 transition">
                  {gallery.title}
                </h2>
                {gallery.description && (
                  <p className="text-gray-600 text-sm mt-1">{gallery.description}</p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  {gallery.images?.length || 0} images
                </p>
              </Link>
            </article>
          ))
        )}
      </div>
    </main>
  )
}