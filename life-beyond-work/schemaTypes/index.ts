import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import author from './author'
import category from './category'
import story from './stories'
import quote from './quotes'
import book from './books'
import gallery from './gallery'
import galleryImage from './galleryImage'
import media from './media'
import { code } from './code'
import siteSettings from './siteSettings'
import sidebarLinks from './sidebarLinks'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  story,
  quote,
  book,
  gallery,
  galleryImage,
  media,
  code,
  siteSettings,
  sidebarLinks,
]