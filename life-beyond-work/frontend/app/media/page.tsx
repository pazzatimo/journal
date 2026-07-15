import Link from 'next/link'

export default function MediaPage() {
  return (
    <div className="container" style={{ padding: '2rem 0 4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '0.5rem' }}>
        Media
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Browse through audio, video, and documents
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Audio & Songs Folder */}
        <Link href="/media/audio" style={{ textDecoration: 'none' }}>
          <div className="media-folder" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🎵</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
              Audio & Songs
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              🇹🇿 Kiswahili · 🇬🇧 English
            </p>
          </div>
        </Link>

        {/* Videos Folder */}
        <Link href="/media/video" style={{ textDecoration: 'none' }}>
          <div className="media-folder" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🎬</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
              Videos
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Watch and be blessed
            </p>
          </div>
        </Link>

        {/* Documents Folder */}
        <Link href="/media/document" style={{ textDecoration: 'none' }}>
          <div className="media-folder" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>📄</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
              Documents
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Reading materials
            </p>
          </div>
        </Link>
      </div>

      <style>{`
        .media-folder:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
          transform: translateY(-4px);
          border-color: #d1d5db !important;
        }
      `}</style>
    </div>
  )
}
// ✅ Revalidate every 60 seconds
export const revalidate = 60;