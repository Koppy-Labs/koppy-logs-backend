import { z } from 'zod'

import { serverSchema } from '../models/server'

export const serverSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('view'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.union([z.literal('server'), serverSchema]),
])

export type ServerSubject = z.infer<typeof serverSubject>
