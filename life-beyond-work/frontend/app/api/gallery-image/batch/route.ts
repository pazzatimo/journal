import { createClient } from 'next-sanity'
import { NextRequest, NextResponse } from 'next/server'

// Use the write token for creating documents
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // this must have "create" permission
})

export async function POST(request: NextRequest) {
  try {
    const { galleryId, imageCount } = await request.json()
    
    if (!galleryId || imageCount === undefined) {
      return NextResponse.json({ error: 'Missing galleryId or imageCount' }, { status: 400 })
    }

    console.log(`🔍 Batch request for gallery: ${galleryId}, count: ${imageCount}`)

    // Get existing galleryImage documents
    const existing = await writeClient.fetch(`
      *[_type == "galleryImage" && gallery._ref == $galleryId] {
        _id,
        imageIndex,
        likes
      }
    `, { galleryId })

    console.log(`📦 Found ${existing.length} existing galleryImage documents`)

    const existingMap: Record<string, any> = {}
    existing.forEach((img: any) => {
      existingMap[img.imageIndex] = img
    })

    const created: any[] = []
    for (let i = 0; i < imageCount; i++) {
      if (!existingMap[i]) {
        console.log(`🆕 Creating galleryImage for index ${i}`)
        const result = await writeClient.create({
          _type: 'galleryImage',
          gallery: { _type: 'reference', _ref: galleryId },
          imageIndex: i,
          likes: 0,
        })
        created.push(result)
      }
    }

    console.log(`✅ Created ${created.length} new galleryImage documents`)

    const allImages = [...existing, ...created]
    
    return NextResponse.json({ images: allImages })
  } catch (error: any) {
    console.error('❌ Batch gallery image error:', error.message)
    return NextResponse.json(
      { error: 'Failed to get/create gallery images', details: error.message },
      { status: 500 }
    )
  }
}