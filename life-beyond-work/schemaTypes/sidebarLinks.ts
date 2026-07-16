import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sidebarLinks',
  title: 'Sidebar Links',
  type: 'document',
  icon: () => '🔗',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g., "About William Branham", "Resources", "Ministries"',
    }),
    defineField({
      name: 'sectionOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Link Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'external',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'icon',
              title: 'Icon (emoji)',
              type: 'string',
              description: 'e.g., 🔗, 📖, 🎵',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      subtitle: 'links',
    },
    prepare(selection) {
      const { title, links } = selection
      return {
        title: title || 'Untitled Section',
        subtitle: links ? `${links.length} links` : 'No links',
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'order',
      by: [{ field: 'sectionOrder', direction: 'asc' }],
    },
  ],
})