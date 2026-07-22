import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'document',
  icon: () => '🎵',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'file', title: 'File & Lyrics' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: '🎵 Song', value: 'song' },
          { title: '🎧 Audio', value: 'audio' },
          { title: '🎬 Video', value: 'video' },
          { title: '📄 Document', value: 'document' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail / Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'file',
      title: 'Media File',
      type: 'file',
      group: 'file',
      options: { accept: 'audio/*,video/*,.pdf,.doc,.docx,.txt' },
    }),
    defineField({
      name: 'lyrics',
      title: 'Lyrics / Transcript',
      type: 'text',
      group: 'file',
      rows: 10,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    // ✅ NEW: Language dropdown – easier than free‑text tags
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Kiswahili', value: 'Kiswahili' },
          { title: 'English', value: 'English' },
          { title: 'Portuguese', value: 'Portuguese' },
          { title: 'Spanish', value: 'Spanish' },
          { title: 'French', value: 'French' },
          { title: 'German', value: 'German' },
          { title: 'Other', value: 'Other' },
        ],
      },
      description: 'Select the language of this song. If you leave it empty, we will fall back to the "tags" field.',
    }),
    // Keep the tags field for backward compatibility
    defineField({
      name: 'tags',
      title: 'Tags (legacy)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Only used if "Language" is not set.',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      group: 'content',
      initialValue: 0,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'thumbnail' },
  },
})