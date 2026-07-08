import { client } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

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

    if (type === 'gallery-image') {
      // Find the galleryImage document
      const doc = await client.fetch(
        `*[_type == "galleryImage" && _id == $id][0] { _id, likes }`,
        { id }
      )

      if (!doc) {
        console.warn('⚠️ Gallery image not found for ID:', id)
        return NextResponse.json({ likes: 0 })
      }

      const currentLikes = doc.likes || 0
      const newLikes = currentLikes + 1

      await client
        .patch(id)
        .setIfMissing({ likes: 0 })
        .set({ likes: newLikes })
        .commit()

      console.log('✅ Gallery image likes updated to:', newLikes)
      return NextResponse.json({ likes: newLikes })
    }

    const docType = typeMap[type] || type
    const doc = await client.fetch(
      `*[_type == $docType && _id == $id][0] { _id, likes }`,
      { docType, id }
    )

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const currentLikes = doc.likes || 0
    const newLikes = currentLikes + 1

    await client
      .patch(id)
      .setIfMissing({ likes: 0 })
      .set({ likes: newLikes })
      .commit()

    return NextResponse.json({ likes: newLikes })
  } catch (error: any) {
    console.error('❌ Like API error:', error.message)
    return NextResponse.json(
      { error: 'Failed to update likes', details: error.message },
      { status: 500 }
    )
  }
}