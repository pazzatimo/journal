import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Beyond Work – A personal journal by Timo Pazza",
  description: "Thoughts, stories, books, lessons, experiences and moments beyond the professional world.",
};

async function getSiteSettings() {
  try {
    return await client.fetch(`
      *[_type == "siteSettings"][0] {
        logo
      }
    `);
  } catch (error) {
    console.error('Failed to fetch site settings for logo:', error);
    return null;
  }
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
        {/* Navbar */}
        <nav className="top-nav">
          <Link href="/" className="top-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              // Fallback SVG icon
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="28" height="24" rx="2" stroke="#ffffff" strokeWidth="2"/>
                <line x1="8" y1="10" x2="24" y2="10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="15" x2="20" y2="15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="20" x2="22" y2="20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="24" cy="20" r="3" stroke="#ffffff" strokeWidth="1.5"/>
                <line x1="26" y1="22" x2="28" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#ffffff' }}>Life Beyond Work</span>
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

        {/* Footer */}
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Timo Pazza · Life Beyond Work</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', opacity: '0.6' }}>A personal journal</p>
        </footer>
      </body>
    </html>
  );
}