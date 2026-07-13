import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'reference',
      to: [{ type: 'gallery' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageIndex',
      title: 'Image Index',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'imageIndex', subtitle: 'gallery.title' },
    prepare(selection) {
      const { title, subtitle } = selection
      return { title: `Image #${title}`, subtitle: `Gallery: ${subtitle}` }
    },
  },
})