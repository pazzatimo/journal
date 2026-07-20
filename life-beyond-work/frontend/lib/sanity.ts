import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN,
  timeout: 30000,
})

// ✅ FIXED: Use named import `createImageUrlBuilder`
const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  return 'https://timopazza.com'
}

// ✅ Fetch sidebar links from Sanity
export async function getSidebarLinks() {
  try {
    return await client.fetch(`
      *[_type == "sidebarLinks"] | order(sectionOrder asc) {
        sectionTitle,
        links
      }
    `)
  } catch (error) {
    console.error('Failed to fetch sidebar links:', error)
    return []
  }
}