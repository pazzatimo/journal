import { createClient } from 'next-sanity'
import { NextRequest, NextResponse } from 'next/server'

// Write client (uses SANITY_API_TOKEN for updates)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // write token
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params

    if (type === 'gallery-image') {
      const doc = await writeClient.fetch(
        `*[_type == "galleryImage" && _id == $id][0] { _id, likes }`,
        { id }
      )

      if (!doc) {
        return NextResponse.json({ likes: 0 })
      }

      const currentLikes = doc.likes || 0
      const newLikes = currentLikes + 1

      await writeClient
        .patch(id)
        .setIfMissing({ likes: 0 })
        .set({ likes: newLikes })
        .commit()

      return NextResponse.json({ likes: newLikes })
    }

    // ... other types (article, story, book, quote)
    // Use writeClient for all mutations
  } catch (error: any) {
    console.error('Like error:', error.message)
    return NextResponse.json(
      { error: 'Failed to update likes', details: error.message },
      { status: 500 }
    )
  }
}