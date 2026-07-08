import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { LikeButton } from '@/components/LikeButton'
import { Comments } from '@/components/Comments'
import { ShareButtons } from '@/components/ShareButtons'

const portableTextComponents = {
  block: {
    h1: ({ children }: any) => <h1 style={{ fontSize: '2rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>{children}</h1>,
    h2: ({ children }: any) => <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>{children}</h2>,
    h3: ({ children }: any) => <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem', color: '#1a1a1a' }}>{children}</h3>,
    normal: ({ children }: any) => <p style={{ marginBottom: '1.5rem', lineHeight: '1.9', color: '#1a1a1a', fontSize: '1.1rem' }}>{children}</p>,
    blockquote: ({ children }: any) => <blockquote style={{ borderLeft: '4px solid #d1d5db', paddingLeft: '1.5rem', fontStyle: 'italic', color: '#374151', margin: '1.5rem 0' }}>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>{children}</ul>,
    number: ({ children }: any) => <ol style={{ listStyle: 'decimal', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>{children}</li>,
    number: ({ children }: any) => <li style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }: any) => <a href={value.href} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>{children}</a>,
  },
  types: {
    image: ({ value }: any) => <div style={{ margin: '1.5rem 0' }}><img src={urlFor(value).url()} alt="Image" style={{ borderRadius: '0.75rem', width: '100%' }} /></div>,
  },
}

async function getArticle(slug: string) {
  console.log('🔍 Looking for article with slug:', slug)

  const allArticles = await client.fetch(`
    *[_type == "post"] {
      _id,
      title,
      publishedAt,
      coverImage,
      body,
      summary,
      slug,
      likes,
      author-> { name }
    }
  `)

  console.log('📚 Total articles found:', allArticles.length)
  console.log('📋 All article slugs:', allArticles.map((a: any) => a.slug?.current))

  const article = allArticles.find((a: any) => a.slug?.current === slug)

  if (article) {
    console.log('✅ Found article:', article.title)
  } else {
    console.log('❌ No article found for slug:', slug)
  }

  return article || null
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  console.log('📌 URL slug:', slug)

  const article = await getArticle(slug)

  if (!article) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>Article not found</h1>
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>
          No article found with slug: <strong>{slug}</strong>
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Check the terminal for all available slugs.
        </p>
        <Link href="/articles" style={{ color: '#2563eb', textDecoration: 'underline', display: 'inline-block', marginTop: '1rem' }}>
          ← Back to all articles
        </Link>
      </div>
    )
  }

  const url = `https://timopazza.com/articles/${slug}`
  const title = article.title

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
      <article>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '400', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '1rem' }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            {article.author?.name && <span>{article.author.name}</span>}
            {article.author?.name && <span>•</span>}
            <time>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not set'}</time>
          </div>
        </header>

        {article.coverImage && (
          <div style={{ position: 'relative', height: '400px', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem', backgroundColor: '#f3f4f6' }}>
            <Image src={urlFor(article.coverImage).url()} alt={article.title} fill style={{ objectFit: 'cover' }} priority sizes="(max-width: 720px) 100vw, 720px" />
          </div>
        )}

        {article.summary && (
          <div style={{ borderLeft: '4px solid #e5e7eb', paddingLeft: '1.5rem', marginBottom: '2rem', fontSize: '1.2rem', color: '#4b5563', fontStyle: 'italic' }}>
            {article.summary}
          </div>
        )}

        <div style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#1a1a1a' }}>
          {article.body && <PortableText value={article.body} components={portableTextComponents} />}
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <LikeButton initialLikes={article.likes || 0} id={article._id} type="article" />
            <ShareButtons url={url} title={title} />
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '1rem' }}>Comments</h3>
          <Comments id={article._id} title={article.title} url={url} />
        </div>
      </article>
    </div>
  )
}