import { z } from 'zod'

const envSchema = z.object({
  APP_ENV: z.enum(['dev', 'prod']).default('dev'),
  PORT: z.number().default(3333),
  BASE_URL: z.string().default('http://localhost:3333'),
})

export const env = envSchema.parse(process.env)
