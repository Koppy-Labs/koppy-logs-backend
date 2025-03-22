import fastifyWebsocket from '@fastify/websocket'
import { createInsertSchema } from 'drizzle-zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { logs } from '@/db/schemas'
import { createLogService } from '@/domain/services/logs/create-log-service'

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
        await createLogService(data)
      })
    },
  )
}
