import { z } from 'zod'

export const logsSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get')]),
  z.literal('logs'),
])

export type LogsSubject = z.infer<typeof logsSubject>
