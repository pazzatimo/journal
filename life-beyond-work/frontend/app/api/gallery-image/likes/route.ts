import { client } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const galleryId = searchParams.get('galleryId')
    
    if (!galleryId) {
      return NextResponse.json({ error: 'galleryId required' }, { status: 400 })
    }

    const images = await client.fetch(`
      *[_type == "galleryImage" && gallery._ref == $galleryId] {
        imageIndex,
        likes
      }
    `, { galleryId })

    const likesMap: Record<string, number> = {}
    images.forEach((img: any) => {
      likesMap[img.imageIndex] = img.likes || 0
    })

    return NextResponse.json({ likes: likesMap })
  } catch (error: any) {
    console.error('❌ Gallery likes error:', error.message)
    return NextResponse.json(
      { error: 'Failed to get likes', details: error.message },
      { status: 500 }
    )
  }
}