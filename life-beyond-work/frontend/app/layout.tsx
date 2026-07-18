import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor, getSidebarLinks } from "@/lib/sanity";
import { Sidebar, RightSidebar } from "@/components/Sidebar";
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
    console.error('Failed to fetch site settings:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const sidebarSections = await getSidebarLinks();
  const logoImage = siteSettings?.logo;

  return (
    <html lang="en">
      <body>
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
            <Link href="/media" className="nav-pill">Media</Link>
          </div>
        </nav>

        <main className="main-content">
          <div className="page-with-sidebar">
            <div className="page-with-sidebar-inner">
              <Sidebar sections={sidebarSections} />
              <div className="page-main-content">
                {children}
              </div>
              <RightSidebar />
            </div>
          </div>
        </main>

        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-social">
              {/* ... social icons ... */}
            </div>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Timo Pazza · Life Beyond Work</p>
          <p className="footer-tagline">A personal journal</p>
        </footer>
      </body>
    </html>
  )
}