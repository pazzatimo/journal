import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Life Beyond Work – A personal journal by Timo Pazza'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  // Optional: Fetch data from Sanity here if needed
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          color: '#ffffff',
        }}
      >
        <div style={{
          fontSize: 72,
          fontWeight: 300,
          letterSpacing: '-0.04em',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          Life Beyond Work
        </div>
        <div style={{
          fontSize: 28,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '80%',
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          Thoughts, stories, books, lessons, experiences and moments beyond the professional world.
        </div>
        <div style={{
          marginTop: '40px',
          fontSize: 18,
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 300,
        }}>
          A personal journal by Timo Pazza
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}