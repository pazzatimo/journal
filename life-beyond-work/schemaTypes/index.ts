import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import author from './author'
import category from './category'
import story from './stories'
import quote from './quotes'
import book from './books'
import gallery from './gallery'
import { code } from './code'

export const schemaTypes: SchemaTypeDefinition[] = [post, author, category, story, quote, book, gallery, code]