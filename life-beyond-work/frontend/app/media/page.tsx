import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

// ----------------------------------------------
// Constants
// ----------------------------------------------
const ITEMS_PER_PAGE = 20

// ----------------------------------------------
// Fetch folder preview data (counts + 5 recent items)
// ----------------------------------------------
async function getFolderPreviews() {
  const [music, videos, documents] = await Promise.all([
    client.fetch(`{
      "count": count(*[_type == "media" && (category == "song" || category == "audio")]),
      "items": *[_type == "media" && (category == "song" || category == "audio")] | order(publishedAt desc)[0...5] {
        _id, title, slug, category, thumbnail, publishedAt
      }
    }`),
    client.fetch(`{
      "count": count(*[_type == "media" && category == "video"]),
      "items": *[_type == "media" && category == "video"] | order(publishedAt desc)[0...5] {
        _id, title, slug, category, thumbnail, publishedAt
      }
    }`),
    client.fetch(`{
      "count": count(*[_type == "media" && category == "document"]),
      "items": *[_type == "media" && category == "document"] | order(publishedAt desc)[0...5] {
        _id, title, slug, category, thumbnail, publishedAt
      }
    }`),
  ])

  return {
    Music: music,
    Videos: videos,
    Documents: documents,
  }
}

// ----------------------------------------------
// Fetch paginated items for a specific folder
// ----------------------------------------------
async function getFolderItems(folder: string, page: number) {
  let categoryFilter = ''
  if (folder === 'music') {
    categoryFilter = '(category == "song" || category == "audio")'
  } else if (folder === 'videos') {
    categoryFilter = 'category == "video"'
  } else if (folder === 'documents') {
    categoryFilter = 'category == "document"'
  } else {
    return { items: [], totalCount: 0, totalPages: 0 }
  }

  const offset = (page - 1) * ITEMS_PER_PAGE
  const [items, totalCount] = await Promise.all([
    client.fetch(
      `*[_type == "media" && ${categoryFilter}] | order(publishedAt desc) [${offset}...${offset + ITEMS_PER_PAGE}] {
        _id, title, slug, category, thumbnail, publishedAt
      }`
    ),
    client.fetch(`count(*[_type == "media" && ${categoryFilter}])`),
  ])

  return { items, totalCount, totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE) }
}

// ----------------------------------------------
// Helper functions
// ----------------------------------------------
function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    song: '🎵',
    audio: '🎧',
    video: '🎬',
    document: '📄',
  }
  return emojis[category] || '📁'
}

function getFolderEmoji(folder: string): string {
  const map: Record<string, string> = {
    music: '🎵',
    videos: '🎬',
    documents: '📄',
  }
  return map[folder] || '📁'
}

function getFolderLabel(folder: string): string {
  const map: Record<string, string> = {
    music: 'Music',
    videos: 'Videos',
    documents: 'Documents',
  }
  return map[folder] || folder
}

// ----------------------------------------------
// Main Page Component
// ----------------------------------------------
export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; page?: string }>
}) {
  const { folder, page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const sidebarSections = await getSidebarLinks()

  // ------------------------------------------------------------
  // CASE 1: A specific folder is requested (e.g. ?folder=music)
  // Show paginated list
  // ------------------------------------------------------------
  if (folder && ['music', 'videos', 'documents'].includes(folder)) {
    const { items, totalCount, totalPages } = await getFolderItems(folder, currentPage)
    const folderEmoji = getFolderEmoji(folder)
    const folderLabel = getFolderLabel(folder)

    return (
      <div
        className="page-main-content"
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '2rem 1.5rem 4rem 1.5rem',
        }}
      >
        <MobileSidebar sections={sidebarSections} />

        <Link
          href="/media"
          style={{
            display: 'inline-block',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#2563eb',
            textDecoration: 'none',
          }}
        >
          ← Back to Media Library
        </Link>

        <h1
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: '400',
            color: '#111827',
            marginBottom: '0.25rem',
          }}
        >
          {folderEmoji} {folderLabel}
        </h1>
        <p
          style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: '1rem',
          }}
        >
          {totalCount} items • Page {currentPage} of {totalPages}
        </p>

        {items.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No items found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {items.map((item: any) => (
              <Link
                key={item._id}
                href={`/media/${item.slug.current}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div className="media-item">
                  {item.thumbnail && (
                    <div
                      style={{
                        position: 'relative',
                        width: '48px',
                        height: '48px',
                        flexShrink: 0,
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#f3f4f6',
                      }}
                    >
                      <Image
                        src={urlFor(item.thumbnail).url()}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: '450',
                        color: '#1f2937',
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                      }}
                    >
                      {getCategoryEmoji(item.category)} {item.category}
                      {item.publishedAt &&
                        ` • ${new Date(item.publishedAt).toLocaleDateString(
                          'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}`}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #f3f4f6',
              flexWrap: 'wrap',
            }}
          >
            {currentPage > 1 && (
              <Link
                href={`/media?folder=${folder}&page=${currentPage - 1}`}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}
                className="pagination-link"
              >
                ← Previous
              </Link>
            )}

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <Link
                  key={pageNum}
                  href={`/media?folder=${folder}&page=${pageNum}`}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border:
                      currentPage === pageNum
                        ? '2px solid #111827'
                        : '1px solid #e5e7eb',
                    textDecoration: 'none',
                    color: currentPage === pageNum ? '#111827' : '#374151',
                    fontWeight: currentPage === pageNum ? '600' : '400',
                    fontSize: '0.875rem',
                    backgroundColor:
                      currentPage === pageNum ? '#f9fafb' : 'transparent',
                  }}
                  className="pagination-link"
                >
                  {pageNum}
                </Link>
              )
            })}

            {currentPage < totalPages && (
              <Link
                href={`/media?folder=${folder}&page=${currentPage + 1}`}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}
                className="pagination-link"
              >
                Next →
              </Link>
            )}
          </div>
        )}

        <style>{`
          .media-item {
            display: flex;
            gap: 0.75rem;
            align-items: center;
            padding: 0.5rem 0.5rem;
            border-radius: 6px;
            transition: background-color 0.15s ease;
          }
          .media-item:hover {
            background-color: #f9fafb;
          }
          .pagination-link:hover {
            background-color: #f3f4f6;
          }
        `}</style>
      </div>
    )
  }

  // ------------------------------------------------------------
  // CASE 2: No folder parameter → show the horizontal folder grid
  // (with previews and "View all" links)
  // ------------------------------------------------------------
  const folderData = await getFolderPreviews()
  const folderNames = ['Music', 'Videos', 'Documents']
  const groupEmojis: Record<string, string> = {
    Music: '🎵',
    Videos: '🎬',
    Documents: '📄',
  }
  const groupSlugs: Record<string, string> = {
    Music: 'music',
    Videos: 'videos',
    Documents: 'documents',
  }

  return (
    <div
      className="page-main-content"
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem 1.5rem',
      }}
    >
      <MobileSidebar sections={sidebarSections} />

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: '400',
          color: '#111827',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}
      >
        Media Library
      </h1>
      <p
        style={{
          color: '#6b7280',
          fontSize: '1rem',
          marginBottom: '2.5rem',
          borderBottom: '1px solid #f3f4f6',
          paddingBottom: '1rem',
        }}
      >
        Browse our collection of music, videos, and documents.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          width: '100%',
        }}
      >
        {folderNames.map((folderName) => {
          const data = folderData[folderName as keyof typeof folderData]
          const items = data?.items || []
          const count = data?.count || 0
          const slug = groupSlugs[folderName]

          return (
            <details
              key={folderName}
              className="folder-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* FOLDER HEADER */}
              <summary className="folder-summary">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem 1rem 1rem 1rem',
                    width: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontSize: '2.8rem',
                      lineHeight: 1,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {groupEmojis[folderName] || '📁'}
                  </span>
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '500',
                      color: '#111827',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {folderName}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#9ca3af',
                      marginTop: '0.15rem',
                    }}
                  >
                    {count} item{count !== 1 ? 's' : ''}
                  </span>
                  <span
                    className="chevron"
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.7rem',
                      color: '#9ca3af',
                      transition: 'transform 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    ▼
                  </span>
                </div>
              </summary>

              {/* FOLDER CONTENTS (Preview) */}
              <div
                style={{
                  padding: '0 0.75rem 1.25rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  borderTop: '1px solid #f9fafb',
                }}
              >
                {items.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/media/${item.slug.current}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                    }}
                  >
                    <div className="media-item-preview">
                      {item.thumbnail && (
                        <div
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '36px',
                            flexShrink: 0,
                            borderRadius: '6px',
                            overflow: 'hidden',
                            backgroundColor: '#f3f4f6',
                          }}
                        >
                          <Image
                            src={urlFor(item.thumbnail).url()}
                            alt={item.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: '450',
                            color: '#1f2937',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.65rem',
                            color: '#9ca3af',
                            textTransform: 'capitalize',
                          }}
                        >
                          {item.category}
                          {item.publishedAt &&
                            ` • ${new Date(item.publishedAt).getFullYear()}`}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* "View All" link → goes to ?folder=slug */}
                {count > 5 && (
                  <Link
                    href={`/media?folder=${slug}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: '0.5rem',
                      padding: '0.4rem',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: '#2563eb',
                      textDecoration: 'none',
                      border: '1px dashed #d1d5db',
                      borderRadius: '6px',
                      transition: 'background-color 0.15s ease',
                    }}
                    className="view-all-link"
                  >
                    View all {count} items →
                  </Link>
                )}
              </div>
            </details>
          )
        })}
      </div>

      <style>{`
        .folder-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
          border-color: #d1d5db;
        }
        .folder-card[open] .chevron {
          transform: rotate(180deg);
        }
        .folder-summary {
          list-style: none;
          cursor: pointer;
          user-select: none;
        }
        .folder-summary::-webkit-details-marker {
          display: none;
        }
        .folder-summary::marker {
          display: none;
        }
        .media-item-preview {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          padding: 0.35rem 0.5rem;
          border-radius: 6px;
          transition: background-color 0.15s ease;
        }
        .media-item-preview:hover {
          background-color: #f3f4f6;
        }
        .view-all-link:hover {
          background-color: #eff6ff;
          border-color: #93c5fd;
        }
        .folder-card {
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
      `}</style>
    </div>
  )
}