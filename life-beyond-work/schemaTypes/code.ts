import { defineType } from 'sanity'

export const code = defineType({
  name: 'code',
  title: 'Code Block',
  type: 'object',
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'Python', value: 'python' },
          { title: 'Bash', value: 'bash' },
          { title: 'JSON', value: 'json' },
          { title: 'Markdown', value: 'markdown' },
          { title: 'Plain Text', value: 'text' },
        ],
      },
    },
    {
      name: 'code',
      title: 'Code',
      type: 'text',
    },
  ],
})