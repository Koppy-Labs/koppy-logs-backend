import { drizzle } from 'drizzle-orm/libsql/node'

import { env } from '@/env'

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
})
