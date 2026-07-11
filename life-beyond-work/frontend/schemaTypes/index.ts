import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import author from './author'
import category from './category'
import story from './stories'
import quote from './quotes'
import book from './books'
import gallery from './gallery'
import galleryImage from './galleryImage'
import media from './media' // ← Add this
import { code } from './code'
import siteSettings from './siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  story,
  quote,
  book,
  gallery,
  galleryImage,
  media, // ← Add here
  code,
  siteSettings,
]