'use client'

import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGalleries()
        setGalleries(data)
      } catch (err: any) {
        console.error('Error fetching galleries:', err)
        setError('Failed to load galleries. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Loading galleries...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1.5rem',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        Gallery
      </h1>

      {galleries.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No galleries yet. Create one in Sanity Studio!</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {galleries.map((gallery: any) => {
            const coverImage = gallery.images && gallery.images.length > 0 ? gallery.images[0].image : null
            return (
              <Link key={gallery._id} href={`/gallery/${gallery.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div className="grid-card" style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '0.75rem',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '66.67%', backgroundColor: '#f3f4f6' }}>
                    {coverImage ? (
                      <Image
                        src={urlFor(coverImage).url()}
                        alt={gallery.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 280px"
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                        No cover image
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                      {gallery.title}
                    </h2>
                    {gallery.description && (
                      <p style={{ color: '#4b5563', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {gallery.description}
                      </p>
                    )}
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      {gallery.images ? `${gallery.images.length} photos` : '0 photos'}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
export const revalidate = 60; // Revalidate every 60 seconds as fallback