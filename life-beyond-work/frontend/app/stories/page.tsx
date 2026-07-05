import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

async function getStories() {
  return await client.fetch(`
    *[_type == "story"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      coverImage,
      storyContent
    }
  `)
}

export default async function StoriesPage() {
  const stories = await getStories()

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light mb-8">Stories</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {stories.length === 0 ? (
          <p className="text-gray-500 col-span-2">No stories yet.</p>
        ) : (
          stories.map((story: any) => (
            <article key={story._id} className="group">
              <Link href={`/stories/${story.slug?.current}`}>
                {story.coverImage && (
                  <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(story.coverImage).url()}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <h2 className="text-xl font-medium group-hover:text-blue-600 transition">
                  {story.title}
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(story.publishedAt).toLocaleDateString()}
                </p>
              </Link>
            </article>
          ))
        )}
      </div>
    </main>
  )
}