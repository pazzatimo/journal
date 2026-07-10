import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import "./globals.css";

// Dynamic metadata based on site settings
async function getSiteSettings() {
  try {
    return await client.fetch(`
      *[_type == "siteSettings"][0] {
        logo,
        heroTitle,
        heroSubtitle
      }
    `);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  
  const title = siteSettings?.heroTitle || 'Life Beyond Work';
  const description = siteSettings?.heroSubtitle || 'Thoughts, stories, books, lessons, experiences and moments beyond the professional world.';
  
  return {
    title: {
      default: `${title} – A personal journal by Timo Pazza`,
      template: `%s | ${title} – A personal journal by Timo Pazza`,
    },
    description: description,
    keywords: ['journal', 'personal blog', 'life beyond work', 'stories', 'articles', 'books', 'quotes', 'Timo Pazza'],
    authors: [{ name: 'Timo Pazza' }],
    creator: 'Timo Pazza',
    publisher: 'Life Beyond Work',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} – A personal journal by Timo Pazza`,
      description: description,
      url: 'https://timopazza.com',
      siteName: 'Life Beyond Work',
      images: [
        {
          url: 'https://timopazza.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Life Beyond Work',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} – A personal journal by Timo Pazza`,
      description: description,
      images: ['https://timopazza.com/og-image.jpg'],
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL('https://timopazza.com'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const logoImage = siteSettings?.logo;

  return (
    <html lang="en">
      <body>
        {/* Navbar - Logo only (no text) */}
        <nav className="top-nav">
          <Link href="/" className="top-nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
            {logoImage ? (
              <Image
                src={urlFor(logoImage).url()}
                alt="Life Beyond Work"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
                priority
              />
            ) : (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="28" height="24" rx="2" stroke="#ffffff" strokeWidth="2"/>
                <line x1="8" y1="10" x2="24" y2="10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="15" x2="20" y2="15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="20" x2="22" y2="20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="24" cy="20" r="3" stroke="#ffffff" strokeWidth="1.5"/>
                <line x1="26" y1="22" x2="28" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </Link>

          <div className="top-nav-links">
            <Link href="/" className="nav-pill">Home</Link>
            <Link href="/articles" className="nav-pill">Articles</Link>
            <Link href="/stories" className="nav-pill">Stories</Link>
            <Link href="/quotes" className="nav-pill">Quotes</Link>
            <Link href="/books" className="nav-pill">Books</Link>
            <Link href="/gallery" className="nav-pill">Gallery</Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>

        {/* Footer - Text only + Social Icons */}
        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-social">
              <a href="https://x.com/timopazza" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M19.5 4l-6.768 6.768"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@timopazza" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.5c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/pazzatimo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@timopazza" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>
              <a href="https://github.com/pazzatimo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            </div>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Timo Pazza · Life Beyond Work</p>
          <p className="footer-tagline">A personal journal</p>
        </footer>
      </body>
    </html>
  );
}