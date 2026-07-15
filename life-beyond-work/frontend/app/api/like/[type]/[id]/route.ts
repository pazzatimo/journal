import { createClient } from 'next-sanity'
import { NextRequest, NextResponse } from 'next/server'

// Write client (uses SANITY_API_TOKEN for updates)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Map frontend types to Sanity document types
const typeMap: Record<string, string> = {
  article: 'post',
  story: 'story',
  quote: 'quote',
  book: 'book',
  'gallery-image': 'galleryImage',
  media: 'media',
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params

    if (type === 'gallery-image') {
      // ... existing gallery logic
      const doc = await writeClient.fetch(
        `*[_type == "galleryImage" && _id == $id][0] { _id, likes }`,
        { id }
      )
      if (!doc) return NextResponse.json({ likes: 0 })
      const currentLikes = doc.likes || 0
      const newLikes = currentLikes + 1
      await writeClient.patch(id).setIfMissing({ likes: 0 }).set({ likes: newLikes }).commit()
      return NextResponse.json({ likes: newLikes })
    }

    const docType = typeMap[type] || type

    // Fetch the document
    const doc = await writeClient.fetch(
      `*[_type == $docType && _id == $id][0] { _id, likes }`,
      { docType, id }
    )

    if (!doc) {
      return NextResponse.json({ likes: 0 })
    }

    const currentLikes = doc.likes || 0
    const newLikes = currentLikes + 1

    try {
      // Attempt to update
      await writeClient
        .patch(id)
        .setIfMissing({ likes: 0 })
        .set({ likes: newLikes })
        .commit()

      return NextResponse.json({ likes: newLikes })
    } catch (updateError: any) {
      // If update fails (e.g., permission issue), log and return a fallback
      console.error('❌ Like update failed:', updateError.message)
      // Return a mock +1 like so the UI still updates
      return NextResponse.json({ likes: currentLikes + 1, fallback: true })
    }
  } catch (error: any) {
    console.error('❌ Like API error:', error.message)
    return NextResponse.json(
      { error: 'Failed to update likes', details: error.message },
      { status: 500 }
    )
  }
}