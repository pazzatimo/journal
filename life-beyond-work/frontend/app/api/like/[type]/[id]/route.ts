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
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params
    
    console.log('📝 Like API called:', { type, id })

    // Handle gallery-image type
    if (type === 'gallery-image') {
      const doc = await writeClient.fetch(
        `*[_type == "galleryImage" && _id == $id][0] { _id, likes }`,
        { id }
      )

      if (!doc) {
        console.warn('⚠️ Gallery image not found for ID:', id)
        return NextResponse.json({ likes: 0 })
      }

      const currentLikes = doc.likes || 0
      const newLikes = currentLikes + 1

      await writeClient
        .patch(id)
        .setIfMissing({ likes: 0 })
        .set({ likes: newLikes })
        .commit()

      console.log('✅ Gallery image likes updated to:', newLikes)
      return NextResponse.json({ likes: newLikes })
    }

    // Handle all other content types
    const docType = typeMap[type] || type

    const doc = await writeClient.fetch(
      `*[_type == $docType && _id == $id][0] { _id, likes }`,
      { docType, id }
    )

    if (!doc) {
      console.warn('⚠️ Document not found for type:', type, 'id:', id)
      return NextResponse.json({ likes: 0 })
    }

    const currentLikes = doc.likes || 0
    const newLikes = currentLikes + 1

    await writeClient
      .patch(id)
      .setIfMissing({ likes: 0 })
      .set({ likes: newLikes })
      .commit()

    console.log('✅ Likes updated to:', newLikes, 'for type:', type)

    return NextResponse.json({ likes: newLikes })
  } catch (error: any) {
    console.error('❌ Like API error:', error.message)
    return NextResponse.json(
      { error: 'Failed to update likes', details: error.message },
      { status: 500 }
    )
  }
}