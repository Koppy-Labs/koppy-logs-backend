import { drizzle } from 'drizzle-orm/libsql/node'

import { env } from '@/env'

import * as schema from './schemas'
export const db = drizzle(env.DATABASE_URL, {
  schema,
  logger: env.APP_ENV !== 'prod',
})
