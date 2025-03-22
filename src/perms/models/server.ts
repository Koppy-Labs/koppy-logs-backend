import { z } from 'zod'

export const serverSchema = z.object({
  __typename: z.literal('server').default('server'),
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
})

export type Server = z.infer<typeof serverSchema>
