import { defineField, defineType } from 'sanity'

export const examSessionType = defineType({
  name: 'examSession',
  title: 'Exam Sessions',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
    }),
    defineField({
      name: 'attempt',
      title: 'Attempt',
      type: 'reference',
      to: [{ type: 'attempt' }],
      weak: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'completedAt',
      title: 'Completed At',
      type: 'datetime',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
    }),
    defineField({
      name: 'ciphertext',
      title: 'Ciphertext',
      type: 'text',
    }),
    defineField({
      name: 'iv',
      title: 'IV',
      type: 'string',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
    }),
  ],
})