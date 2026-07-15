import Link from 'next/link'

export default function MediaPage() {
  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem 1rem' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '300', color: '#1a1a1a', marginBottom: '0.5rem' }}>
        Media
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
        Browse through audio, video, and documents
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
      }}>
        {/* Audio & Songs Folder */}
        <Link href="/media/audio" style={{ textDecoration: 'none' }}>
          <div className="media-folder" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '140px',
          }}>
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '0.5rem' }}>🎵</div>
            <h2 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
              Audio & Songs
            </h2>
            <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', color: '#6b7280' }}>
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
            padding: '1.5rem 1rem',
            textAlign: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '140px',
          }}>
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '0.5rem' }}>🎬</div>
            <h2 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
              Videos
            </h2>
            <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', color: '#6b7280' }}>
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
            padding: '1.5rem 1rem',
            textAlign: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '140px',
          }}>
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '0.5rem' }}>📄</div>
            <h2 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', fontWeight: '500', color: '#1a1a1a', marginBottom: '0.25rem' }}>
              Documents
            </h2>
            <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', color: '#6b7280' }}>
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
        @media (max-width: 480px) {
          .media-folder {
            min-height: 120px !important;
            padding: 1rem 0.75rem !important;
          }
        }
      `}</style>
    </div>
  )
}