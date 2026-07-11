import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk' // ← Use deskTool instead of structureTool
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Life Beyond Work',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3ojsturu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    deskTool(), // ← Use deskTool here
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})