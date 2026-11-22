import { defineArrayMember, defineField, defineType } from 'sanity'

export const examType = defineType({
  name: 'exam',
  title: 'Exams',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'passMark',
      title: 'Pass Mark',
      type: 'number',
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'questionItem',
          title: 'Question',
          fields: [
            defineField({
              name: 'text',
              title: 'Question Text',
              type: 'string',
            }),
            defineField({
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'correct',
              title: 'Correct Option Index',
              type: 'number',
            }),
            defineField({
              name: 'explanation',
              title: 'Explanation',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
  ],
})