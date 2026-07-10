import { client } from '@/lib/sanity'
import { MetadataRoute } from 'next'

async function getContent() {
  const articles = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      slug,
      publishedAt,
      _updatedAt
    }
  `)

  const stories = await client.fetch(`
    *[_type == "story"] | order(publishedAt desc) {
      _id,
      slug,
      publishedAt,
      _updatedAt
    }
  `)

  const books = await client.fetch(`
    *[_type == "book"] | order(publishedAt desc) {
      _id,
      slug,
      publishedAt,
      _updatedAt
    }
  `)

  const galleries = await client.fetch(`
    *[_type == "gallery"] | order(publishedAt desc) {
      _id,
      slug,
      publishedAt,
      _updatedAt
    }
  `)

  const quotes = await client.fetch(`
    *[_type == "quote"] | order(publishedAt desc) {
      _id,
      publishedAt,
      _updatedAt
    }
  `)

  return { articles, stories, books, galleries, quotes }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://timopazza.com'
  const { articles, stories, books, galleries, quotes } = await getContent()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quotes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article: any) => ({
    url: `${baseUrl}/articles/${article.slug?.current}`,
    lastModified: new Date(article._updatedAt || article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const storyPages: MetadataRoute.Sitemap = stories.map((story: any) => ({
    url: `${baseUrl}/stories/${story.slug?.current}`,
    lastModified: new Date(story._updatedAt || story.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const bookPages: MetadataRoute.Sitemap = books.map((book: any) => ({
    url: `${baseUrl}/books/${book.slug?.current}`,
    lastModified: new Date(book._updatedAt || book.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const galleryPages: MetadataRoute.Sitemap = galleries.map((gallery: any) => ({
    url: `${baseUrl}/gallery/${gallery.slug?.current}`,
    lastModified: new Date(gallery._updatedAt || gallery.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Quotes don't have individual pages, they're on the quotes page
  const quotePages: MetadataRoute.Sitemap = quotes.map((quote: any) => ({
    url: `${baseUrl}/quotes#${quote._id}`,
    lastModified: new Date(quote._updatedAt || quote.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...articlePages,
    ...storyPages,
    ...bookPages,
    ...galleryPages,
    ...quotePages,
  ]
}