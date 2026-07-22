import { client } from '@/lib/sanity'
import MediaList from '../components/MediaList'

async function getVideo() {
  return await client.fetch(`
    *[_type == "media" && category == "video"] | order(publishedAt desc) {
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

export default async function VideoPage() {
  const items = await getVideo()

  return (
    <MediaList
      items={items}
      title="Videos"
      subtitle={null}
      showLanguageTabs={false}
      hideCategoryLabel={true} // ← Hide the category label
      emptyMessage="No videos yet. Upload your first video in Sanity Studio!"
    />
  )
}
export const revalidate = 60; // Revalidate every 60 seconds as fallback