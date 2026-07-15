import { client } from '@/lib/sanity'
import MediaList from '../components/MediaList'

async function getAudio() {
  return await client.fetch(`
    *[_type == "media" && (category == "audio" || category == "song")] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      description,
      thumbnail,
      file,
      publishedAt,
      tags,
      likes,
      lyrics
    }
  `)
}

export default async function AudioPage() {
  const items = await getAudio()

  return (
    <MediaList
      items={items}
      title="Audio & Songs"
      subtitle="🎵 There's nothing like music. God heals by music. — Rev. William Marrion Branham"
      showLanguageTabs={true}
      hideCategoryLabel={true} // ← Hide the category label
      emptyMessage="No audio or songs yet. Upload your first song or audio in Sanity Studio!"
    />
  )
}
export const revalidate = 60; // Revalidate every 60 seconds as fallback