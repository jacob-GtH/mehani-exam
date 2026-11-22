import { defineField, defineType } from 'sanity'

export const attemptType = defineType({
  name: 'attempt',
  title: 'Attempts',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
    }),
  ],
})