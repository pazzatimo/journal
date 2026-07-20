import { client, urlFor, getSidebarLinks } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/MobileSidebar'

async function getArticles() {
  return await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      summary,
      coverImage
    }
  `)
}

export default async function ArticlesPage() {
  const articles = await getArticles()
  const sidebarSections = await getSidebarLinks()

  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        All Articles
      </h1>

      {/* Mobile Sidebar – appears after header on mobile */}
      <MobileSidebar sections={sidebarSections} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {articles.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No articles yet.</p>
        ) : (
          articles.map((article: any) => (
            <article key={article._id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
              <Link href={`/articles/${article.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  {article.coverImage && (
                    <div style={{ position: 'relative', width: '150px', height: '100px', flexShrink: 0, borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <Image
                        src={urlFor(article.coverImage).url()}
                        alt={article.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="150px"
                      />
                    </div>
                  )}
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        {article.summary}
                      </p>
                    )}
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
export const revalidate = 60;