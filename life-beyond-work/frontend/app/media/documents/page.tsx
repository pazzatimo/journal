import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

const ITEMS_PER_PAGE = 24

async function getDocuments(page: number, search: string) {
  const offset = (page - 1) * ITEMS_PER_PAGE
  const searchFilter = search ? `&& title match "*${search}*"` : ''
  const [items, totalCount] = await Promise.all([
    client.fetch(
      `*[_type == "media" && category == "document" ${searchFilter}] | order(publishedAt desc) [${offset}...${offset + ITEMS_PER_PAGE}] {
        _id, title, slug, category, thumbnail, publishedAt
      }`
    ),
    client.fetch(`count(*[_type == "media" && category == "document" ${searchFilter}])`),
  ])
  return { items, totalCount, totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE) }
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { page = '1', search = '' } = await searchParams
  const currentPage = parseInt(page, 10)
  const { items, totalCount, totalPages } = await getDocuments(currentPage, search)
  const sidebarSections = await getSidebarLinks()

  return (
    <div className="page-main-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <MobileSidebar sections={sidebarSections} />

      <Link href="/media" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>
        ← Back to Media Library
      </Link>

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '400', color: '#111827', marginBottom: '0.5rem' }}>
        📄 Documents
      </h1>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        {totalCount} documents • Page {currentPage} of {totalPages}
      </p>

      <form method="get" style={{ marginBottom: '2rem' }}>
        <input type="text" name="search" placeholder="Search documents..." defaultValue={search} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', width: '100%', maxWidth: '400px' }} />
        <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#111827', color: '#fff', fontSize: '0.95rem', cursor: 'pointer' }}>Search</button>
        {search && <Link href="/media/documents" style={{ marginLeft: '0.5rem', padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', textDecoration: 'none', color: '#374151', fontSize: '0.95rem' }}>Clear</Link>}
      </form>

      {items.length === 0 ? <p style={{ color: '#6b7280' }}>No documents found.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {items.map((item: any) => (
            <Link key={item._id} href={`/media/${item.slug.current}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="doc-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                <div style={{ position: 'relative', aspectRatio: '1/1', backgroundColor: '#f9fafb' }}>
                  {item.thumbnail ? <Image src={urlFor(item.thumbnail).url()} alt={item.title} fill style={{ objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>📄</div>}
                </div>
                <div style={{ padding: '0.5rem 0.75rem' }}>
                  <div style={{ fontWeight: '500', color: '#111827', fontSize: '0.9rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{item.publishedAt && new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
          {currentPage > 1 && <Link href={`/media/documents?page=${currentPage - 1}${search ? `&search=${search}` : ''}`} className="pagination-link" style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', textDecoration: 'none', color: '#374151', fontSize: '0.875rem' }}>← Previous</Link>}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p = i + 1
            if (totalPages > 5) {
              if (currentPage <= 3) p = i + 1
              else if (currentPage >= totalPages - 2) p = totalPages - 4 + i
              else p = currentPage - 2 + i
            }
            return <Link key={p} href={`/media/documents?page=${p}${search ? `&search=${search}` : ''}`} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: currentPage === p ? '2px solid #111827' : '1px solid #e5e7eb', textDecoration: 'none', color: currentPage === p ? '#111827' : '#374151', fontWeight: currentPage === p ? '600' : '400', fontSize: '0.875rem', backgroundColor: currentPage === p ? '#f9fafb' : 'transparent' }}>{p}</Link>
          })}
          {currentPage < totalPages && <Link href={`/media/documents?page=${currentPage + 1}${search ? `&search=${search}` : ''}`} className="pagination-link" style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', textDecoration: 'none', color: '#374151', fontSize: '0.875rem' }}>Next →</Link>}
        </div>
      )}

      <style>{`
        .doc-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          transform: translateY(-3px);
          border-color: #d1d5db;
        }
        .pagination-link:hover { background-color: #f3f4f6; }
      `}</style>
    </div>
  )
}