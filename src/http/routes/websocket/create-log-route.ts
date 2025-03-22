import fastifyWebsocket from '@fastify/websocket'
import { createInsertSchema } from 'drizzle-zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { logs } from '@/db/schemas'
import { createLogService } from '@/domain/services/log/create-log-service'

const logSchema = z.object({
  serverId: z.string(),
  message: z.string(),
  categoryId: z.string(),
})

export async function createLogRoute(app: FastifyInstance) {
  app.register(fastifyWebsocket)
  app.withTypeProvider<ZodTypeProvider>().post(
    '/logs',
    {
      websocket: true,
      schema: {
        tags: ['logs'],
        body: z.object({
          log: createInsertSchema(logs),
        }),
      },
    },
    async (socket) => {
      socket.on('message', async (message) => {
        const data = JSON.parse(message.toString())

        const log = logSchema.safeParse(data)

        if (!log.success) return

        await createLogService(log.data)
      })
    },
  )
}
