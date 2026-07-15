import { client } from '@/lib/sanity'
import MediaList from '../components/MediaList'

async function getDocuments() {
  return await client.fetch(`
    *[_type == "media" && category == "document"] | order(publishedAt desc) {
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

export default async function DocumentsPage() {
  const items = await getDocuments()

  return (
    <MediaList
      items={items}
      title="Documents"
      subtitle={null}
      showLanguageTabs={false}
      emptyMessage="No documents yet. Upload your first document in Sanity Studio!"
    />
  )
}