import { z } from 'zod'

const envSchema = z.object({
  APP_ENV: z.enum(['dev', 'prod']).default('dev'),
  PORT: z.number().default(3333),
  BASE_URL: z.string().default('http://localhost:3333'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
