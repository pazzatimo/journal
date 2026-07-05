import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Beyond Work - A personal journal by Timo Pazza",
  description: "Thoughts, stories, books, lessons, experiences and moments beyond the professional world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: '#ffffff' }}>
      <body style={{ background: '#ffffff', color: '#1a1a1a' }}>
        {/* Fixed Top Navigation */}
        <nav className="top-nav">
          <Link href="/" className="top-nav-brand">
            Life Beyond Work
          </Link>
          <div className="top-nav-links">
            <Link href="/">Home</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/stories">Stories</Link>
            <Link href="/quotes">Quotes</Link>
            <Link href="/books">Books</Link>
            <Link href="/gallery">Gallery</Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #e5e7eb', marginTop: '4rem' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              © {new Date().getFullYear()} Timo Pazza · Life Beyond Work
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}