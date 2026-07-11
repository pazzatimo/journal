import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Create and export the Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN,
})

// Build image URLs
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Get the base URL for share links
export function getBaseUrl(): string {
  // 1. Use custom environment variable (most reliable)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  // 2. Use Vercel's public URL (available on both server and client)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  // 3. Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  // 4. Final fallback (should not be used in production)
  return 'https://timopazza.com'
}