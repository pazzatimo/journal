import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Life Beyond Work',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3ojsturu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  // 🔑 This is the key: it makes the studio available at /studio
  basePath: '/studio',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})