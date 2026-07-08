import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'quote',
  title: 'Quotes',
  type: 'document',
  icon: () => '💬',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'quoteText',
      title: 'Quote',
      type: 'text',
      group: 'content',
      validation: (rule) => rule.required(),
      rows: 3,
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Author',
      type: 'string',
      group: 'content',
      description: 'Who said this quote?',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'text',
      group: 'content',
      description: 'Optional: Book, speech, or situation where this quote appears',
      rows: 2,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'e.g., Wisdom, Leadership, Love, etc.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
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
      description: 'Overrides the quote for search engines',
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
      title: 'quoteText',
      subtitle: 'quoteAuthor',
    },
  },
})