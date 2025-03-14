import { defineConfig } from 'drizzle-kit'

import { env } from './src/env'

export default defineConfig({
  schema: 'src/db/schemas',
  out: 'priv/migrations',
  dialect: 'turso',
  dbCredentials: { url: env.DATABASE_URL },
  migrations: {
    prefix: 'timestamp',
  },
})
