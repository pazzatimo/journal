import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      description: 'Upload your site logo (PNG, SVG, or JPG). Recommended size: 40x40px or larger with transparent background.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Upload the image for the homepage hero section',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline for the hero',
      initialValue: 'Thoughts, Stories & Moments Beyond Work',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Short description below the title',
      initialValue: 'A personal journal by Timo Pazza — exploring life beyond the professional world.',
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
      media: 'logo',
    },
  },
})