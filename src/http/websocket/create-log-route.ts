import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createLogRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/logs',
    {
      schema: {
        body: z.object({
          log: z.object({
            serverId: z.string(),
            categoryId: z.string(),
            message: z.string(),
          }),
        }),
      },
    },
    async () => {},
  )
}
