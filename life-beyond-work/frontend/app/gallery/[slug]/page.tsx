'use client'

import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShareButtons } from '@/components/ShareButtons'
import { Sidebar, RightSidebar } from '@/components/Sidebar'
import { MobileSidebar } from '@/components/MobileSidebar'
import { Comments } from '@/components/Comments'
import { LikeButton } from '@/components/LikeButton'

async function getGallery(slug: string) {
  const allGalleries = await client.fetch(`
    *[_type == "gallery"] {
      _id,
      title,
      description,
      images,
      publishedAt,
      slug,
      likes
    }
  `)
  return allGalleries.find((g: any) => g.slug?.current === slug) || null
}

// Get or create galleryImage for ALL images in a gallery
async function getOrCreateAllGalleryImages(galleryId: string, imageCount: number) {
  try {
    const res = await fetch('/api/gallery-image/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryId, imageCount }),
    })
    if (!res.ok) {
      const error = await res.json()
      console.error('❌ Batch API error:', error)
      throw new Error(error.error || 'Failed to create gallery images')
    }
    const data = await res.json()
    return data.images
  } catch (error) {
    console.error('❌ Failed to get/create gallery images:', error)
    return []
  }
}

// Like Button Component for gallery images
function GalleryLikeButton({ 
  imageId, 
  initialLikes, 
  onLikeUpdate 
}: { 
  imageId: string; 
  initialLikes: number;
  onLikeUpdate?: (likes: number) => void;
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (liked || loading || !imageId) {
      console.warn('⚠️ Cannot like: imageId is missing or already liked', { imageId, liked })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/like/gallery-image/${imageId}`, { method: 'POST' })
      const data = await res.json()
      if (data.likes !== undefined) {
        const newLikes = data.likes
        setLikes(newLikes)
        setLiked(true)
        if (onLikeUpdate) onLikeUpdate(newLikes)
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading || !imageId}
      style={{
        background: 'none',
        border: 'none',
        cursor: (liked || loading || !imageId) ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        color: liked ? '#ef4444' : '#6b7280',
        fontSize: '0.875rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        backgroundColor: liked ? '#fef2f2' : 'transparent',
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{liked ? '❤️' : '🤍'}</span>
      <span>{likes}</span>
    </button>
  )
}

function ImageModal({
  item,
  galleryTitle,
  galleryId,
  imageIndex,
  imageId,
  initialLikes,
  onLikeUpdate,
  onClose,
  baseUrl,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: {
  item: any
  galleryTitle: string
  galleryId: string
  imageIndex: number
  imageId: string
  initialLikes: number
  onLikeUpdate?: (likes: number) => void
  onClose: () => void
  baseUrl: string
  onNext: () => void
  onPrev: () => void
  hasNext: boolean
  hasPrev: boolean
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleArrowKeys)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleArrowKeys)
    }
  }, [onClose, onNext, onPrev])

  const imageUrl = `${baseUrl}/gallery/${galleryId}/${imageIndex}`
  const imageTitle = item.caption || galleryTitle

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '2rem',
          background: 'none',
          border: 'none',
          color: '#ffffff',
          fontSize: '2rem',
          cursor: 'pointer',
          opacity: 0.7,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        ✕
      </button>

      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          style={{
            position: 'absolute',
            left: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#ffffff',
            fontSize: '2rem',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
        >
          ←
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          style={{
            position: 'absolute',
            right: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#ffffff',
            fontSize: '2rem',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
        >
          →
        </button>
      )}

      <div
        style={{
          maxWidth: '80vw',
          maxHeight: '70vh',
          position: 'relative',
          cursor: 'default',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={urlFor(item.image).url()}
          alt={item.caption || galleryTitle}
          width={800}
          height={600}
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
            borderRadius: '0.5rem',
          }}
        />
      </div>

      <div
        style={{
          maxWidth: '80vw',
          marginTop: '1.5rem',
          color: '#ffffff',
          textAlign: 'center',
          cursor: 'default',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
          {imageIndex + 1} / {galleryTitle}
        </div>
        {item.caption && <p style={{ fontSize: '1.1rem', color: '#e5e7eb', marginBottom: '0.5rem' }}>{item.caption}</p>}
        {item.location && <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '0.25rem' }}>📍 {item.location}</p>}
        {item.date && <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>📅 {item.date}</p>}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <GalleryLikeButton 
            imageId={imageId} 
            initialLikes={initialLikes} 
            onLikeUpdate={onLikeUpdate}
          />
          <ShareButtons url={imageUrl} title={imageTitle} />
        </div>
      </div>
    </div>
  )
}

export default function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [gallery, setGallery] = useState<any>(null)
  const [sidebarSections, setSidebarSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [imageLikes, setImageLikes] = useState<Record<string, number>>({})
  const [imageIds, setImageIds] = useState<Record<string, string>>({})

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timopazza.com'

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const p = await params
        const [data, sidebarData] = await Promise.all([
          getGallery(p.slug),
          getSidebarLinks(),
        ])
        if (!mounted) return
        
        setGallery(data)
        setSidebarSections(sidebarData)
        
        if (data && data.images && data.images.length > 0) {
          const imagesData = await getOrCreateAllGalleryImages(data._id, data.images.length)
          
          if (!mounted) return
          
          const likesMap: Record<string, number> = {}
          const idMap: Record<string, string> = {}
          if (Array.isArray(imagesData)) {
            imagesData.forEach((img: any) => {
              likesMap[img.imageIndex] = img.likes || 0
              idMap[img.imageIndex] = img._id
            })
          }
          setImageLikes(likesMap)
          setImageIds(idMap)
        }
      } catch (error) {
        console.error('❌ Error loading gallery:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => { mounted = false }
  }, [params])

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handleCloseModal = () => {
    setSelectedIndex(null)
  }

  const handleNext = () => {
    if (selectedIndex !== null && gallery && selectedIndex < gallery.images.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleLikeUpdate = (index: number, newLikes: number) => {
    setImageLikes(prev => ({ ...prev, [index]: newLikes }))
  }

  if (loading) {
    return (
      <div className="page-with-sidebar">
        <div className="page-with-sidebar-inner">
          <Sidebar sections={sidebarSections} />
          <div className="page-main-content">
            <MobileSidebar sections={sidebarSections} />
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: '#9ca3af' }}>Loading gallery...</p>
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    )
  }

  if (!gallery) {
    return (
      <div className="page-with-sidebar">
        <div className="page-with-sidebar-inner">
          <Sidebar sections={sidebarSections} />
          <div className="page-main-content">
            <MobileSidebar sections={sidebarSections} />
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '300' }}>Gallery not found</h1>
              <Link href="/gallery" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to galleries</Link>
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    )
  }

  const url = `${baseUrl}/gallery/${gallery.slug?.current}`

  return (
    <div className="page-with-sidebar">
      <div className="page-with-sidebar-inner">
        <Sidebar sections={sidebarSections} />
        <div className="page-main-content">
          <MobileSidebar sections={sidebarSections} />
          <div style={{ padding: '2rem 0 4rem 0' }}>
            <Link href="/gallery" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>
              ← Back to galleries
            </Link>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              {gallery.title}
            </h1>
            {gallery.description && (
              <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{gallery.description}</p>
            )}
            {gallery.publishedAt && (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '2rem' }}>
                {new Date(gallery.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {gallery.images &&
                gallery.images.map((item: any, index: number) => {
                  const likeCount = imageLikes[index] || 0
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleImageClick(index)}
                      style={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '100%',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.caption || gallery.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 200px"
                      />
                      {likeCount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            right: '0.5rem',
                            background: 'rgba(0,0,0,0.7)',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          ❤️ {likeCount}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>

            {/* Comments */}
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>Comments</h3>
              <Comments id={gallery._id} title={gallery.title} url={url} />
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  )
}