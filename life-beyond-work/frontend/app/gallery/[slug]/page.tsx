import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'

async function getGallery(slug: string) {
  const allGalleries = await client.fetch(`
    *[_type == "gallery"] {
      _id,
      title,
      description,
      images,
      publishedAt,
      slug
    }
  `)
  
  const gallery = allGalleries.find((a: any) => a.slug?.current === slug)
  return gallery || null
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await getGallery(slug)

  if (!gallery) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-light">Gallery not found</h1>
        <p className="text-gray-600 mt-4">The gallery you're looking for doesn't exist.</p>
        <a href="/gallery" className="text-blue-600 hover:underline mt-4 inline-block">← Back to all galleries</a>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light mb-4">{gallery.title}</h1>
      
      <div className="text-sm text-gray-500 mb-8">
        <time dateTime={gallery.publishedAt}>
          {gallery.publishedAt 
            ? new Date(gallery.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Date not set'
          }
        </time>
      </div>
      
      {gallery.description && (
        <p className="text-lg text-gray-600 mb-8">{gallery.description}</p>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images && gallery.images.map((item: any, index: number) => (
          <div key={index} className="group relative">
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={urlFor(item.image).url()}
                alt={item.caption || gallery.title}
                fill
                className="object-cover"
              />
            </div>
            {item.caption && (
              <p className="text-sm text-gray-500 mt-2">{item.caption}</p>
            )}
            {item.location && (
              <p className="text-xs text-gray-400">📍 {item.location}</p>
            )}
            {item.date && (
              <p className="text-xs text-gray-400">📅 {item.date}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}