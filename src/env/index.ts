import { z } from 'zod'

export const env = {
  app: loadAppEnvs(),
  db: loadDbEnvs(),
  redis: loadRedisEnvs(),
}

function loadAppEnvs() {
  const schema = z.object({
    APP_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
    PORT: z.coerce.number().default(3000),
    BASE_URL: z.string().default('http://localhost:3000'),
    JWT_SECRET: z.string(),
    CLIENT_URL: z.string().default('http://localhost:3000'),
  })

  return schema.parse(process.env)
}

function loadDbEnvs() {
  const schema = z.object({
    DATABASE_URL: z.string(),
  })

  return schema.parse(process.env)
}

function loadRedisEnvs() {
  const schema = z.object({
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string(),
  })

  return schema.parse(process.env)
}
