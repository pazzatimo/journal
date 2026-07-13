import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Life Beyond Work',
  projectId: '3ojsturu',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})