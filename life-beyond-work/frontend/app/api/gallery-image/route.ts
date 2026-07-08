import { client } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { galleryId, imageIndex } = await request.json()
    
    // Check if galleryImage already exists
    const existing = await client.fetch(`
      *[_type == "galleryImage" && gallery._ref == $galleryId && imageIndex == $imageIndex][0] {
        _id,
        likes
      }
    `, { galleryId, imageIndex })

    if (existing) {
      return NextResponse.json(existing)
    }

    // Create new galleryImage document
    const result = await client.create({
      _type: 'galleryImage',
      gallery: { _type: 'reference', _ref: galleryId },
      imageIndex: imageIndex,
      likes: 0,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Gallery image error:', error.message)
    return NextResponse.json(
      { error: 'Failed to get/create gallery image', details: error.message },
      { status: 500 }
    )
  }
}