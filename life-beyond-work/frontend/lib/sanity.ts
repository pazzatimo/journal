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