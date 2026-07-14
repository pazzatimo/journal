import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

// Custom structure for Media folders
const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Articles
      S.listItem()
        .title('Articles')
        .child(S.documentTypeList('post').title('Articles')),
      
      // Stories
      S.listItem()
        .title('Stories')
        .child(S.documentTypeList('story').title('Stories')),
      
      // Quotes
      S.listItem()
        .title('Quotes')
        .child(S.documentTypeList('quote').title('Quotes')),
      
      // Books
      S.listItem()
        .title('Books')
        .child(S.documentTypeList('book').title('Books')),
      
      // Gallery
      S.listItem()
        .title('Gallery')
        .child(S.documentTypeList('gallery').title('Gallery')),
      
      // Media - with subfolders
      S.listItem()
        .title('Media')
        .child(
          S.list()
            .title('Media')
            .items([
              // All Media
              S.listItem()
                .title('📂 All Media')
                .child(S.documentTypeList('media').title('All Media')),
              
              // Audio/Song
              S.listItem()
                .title('🎵 Audio & Songs')
                .child(
                  S.documentTypeList('media')
                    .title('Audio & Songs')
                    .filter('category == "audio" || category == "song"')
                ),
              
              // Video
              S.listItem()
                .title('🎬 Video')
                .child(
                  S.documentTypeList('media')
                    .title('Video')
                    .filter('category == "video"')
                ),
              
              // Document
              S.listItem()
                .title('📄 Documents')
                .child(
                  S.documentTypeList('media')
                    .title('Documents')
                    .filter('category == "document"')
                ),
            ])
        ),
      
      // Site Settings
      S.listItem()
        .title('⚙️ Site Settings')
        .child(S.documentTypeList('siteSettings').title('Site Settings')),
      
      // Divider
      S.divider(),
      
      // Authors & Categories
      S.listItem()
        .title('Authors')
        .child(S.documentTypeList('author').title('Authors')),
      S.listItem()
        .title('Categories')
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Gallery Images (Likes)')
        .child(S.documentTypeList('galleryImage').title('Gallery Images')),
    ])

export default defineConfig({
  name: 'default',
  title: 'Life Beyond Work',
  projectId: '3ojsturu',
  dataset: 'production',
  plugins: [
    structureTool({
      structure, // Use custom structure
    }),
  ],
  schema: { types: schemaTypes },
})