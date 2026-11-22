import { type SchemaTypeDefinition } from 'sanity'
import { examSessionType } from './examSession'
import { examType } from './exam'
import { attemptType } from './attempt'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [examSessionType, examType, attemptType,]
}