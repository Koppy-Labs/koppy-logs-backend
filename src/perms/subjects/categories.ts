import { z } from 'zod'

export const categorySubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('category'),
])

export type CategorySubject = z.infer<typeof categorySubject>
