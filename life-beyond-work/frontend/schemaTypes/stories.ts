import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'story',
  title: 'Stories',
  type: 'document',
  icon: () => '📖',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Audio & Video' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Story Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'storyContent',
      title: 'Story Content',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        { type: 'image' },
        { type: 'code' },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    // ========== AUDIO FIELD ==========
    defineField({
      name: 'audio',
      title: 'Audio Narration',
      type: 'object',
      group: 'media',
      fields: [
        defineField({
          name: 'file',
          title: 'Audio File',
          type: 'file',
          options: {
            accept: 'audio/*',
          },
          description: 'Upload MP3, WAV, or M4A file',
        }),
        defineField({
          name: 'title',
          title: 'Audio Title',
          type: 'string',
          description: 'e.g., "Full Story Narration"',
          initialValue: 'Listen to this story',
        }),
        defineField({
          name: 'transcript',
          title: 'Transcript (Optional)',
          type: 'text',
          description: 'Full transcript of the audio for accessibility',
          rows: 4,
        }),
      ],
    }),
    // ========== VIDEO FIELD ==========
    defineField({
      name: 'video',
      title: 'Video',
      type: 'object',
      group: 'media',
      fields: [
        defineField({
          name: 'url',
          title: 'Video URL',
          type: 'url',
          description: 'YouTube, Vimeo, or direct video URL',
          validation: (rule) =>
            rule.uri({
              scheme: ['http', 'https'],
              allowRelative: false,
            }),
        }),
        defineField({
          name: 'title',
          title: 'Video Title',
          type: 'string',
          description: 'e.g., "Watch the story come to life"',
          initialValue: 'Watch this story',
        }),
        defineField({
          name: 'position',
          title: 'Video Position',
          type: 'string',
          options: {
            list: [
              { title: 'Top of Story', value: 'top' },
              { title: 'Bottom of Story', value: 'bottom' },
            ],
          },
          initialValue: 'bottom',
        }),
      ],
    }),
    // ========== LIKES ==========
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
      description: 'Overrides the story title for search engines',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      description: 'Description for search engines (recommended: 150-160 characters)',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
      description: 'Image shown when shared on social media',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
    },
  },
})