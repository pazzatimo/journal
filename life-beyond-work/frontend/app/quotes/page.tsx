import { client } from '@/lib/sanity'

async function getQuotes() {
  return await client.fetch(`
    *[_type == "quote"] | order(publishedAt desc) {
      _id,
      quoteText,
      quoteAuthor,
      context,
      tags,
      publishedAt
    }
  `)
}

export default async function QuotesPage() {
  const quotes = await getQuotes()

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
      
      {/* Page Header */}
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '300', 
        color: '#1a1a1a', 
        marginBottom: '2rem', 
        borderBottom: '1px solid #e5e7eb', 
        paddingBottom: '1rem' 
      }}>
        Quotes
      </h1>

      {quotes.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No quotes yet. Create your first quote in Sanity Studio!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {quotes.map((quote: any) => (
            <div 
              key={quote._id} 
              className="quote-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem 2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              }}
            >
              {/* Quote Content */}
              <blockquote style={{ margin: 0 }}>
                <p style={{
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  color: '#1a1a1a',
                  lineHeight: '1.7',
                  marginBottom: '0.75rem'
                }}>
                  “{quote.quoteText}”
                </p>
                <footer style={{
                  fontSize: '0.95rem',
                  color: '#4b5563',
                  marginBottom: '0.5rem'
                }}>
                  — {quote.quoteAuthor}
                  {quote.context && <span style={{ color: '#9ca3af' }}>, {quote.context}</span>}
                </footer>
                
                {/* Tags */}
                {quote.tags && quote.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {quote.tags.map((tag: string) => (
                      <span key={tag} style={{
                        backgroundColor: '#f3f4f6',
                        padding: '0.2rem 0.7rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        color: '#4b5563'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Date */}
                {quote.publishedAt && (
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                    {new Date(quote.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </blockquote>

              {/* Social Actions - Placeholder with CSS hover */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <span style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'default'
                }}>
                  ❤️ Like
                </span>
                <span style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'default'
                }}>
                  💬 Comment
                </span>
                <span style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'default'
                }}>
                  🔗 Share
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS for hover effects */}
      <style>{`
        .quote-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          border-color: #d1d5db !important;
        }
      `}</style>
    </div>
  )
}