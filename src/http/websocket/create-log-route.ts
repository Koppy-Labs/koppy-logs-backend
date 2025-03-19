import fastifyWebsocket from '@fastify/websocket'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { createLogService } from '@/domain/services/logs/create-log-service'

export async function createLogRoute(app: FastifyInstance) {
  app.register(fastifyWebsocket)
  app.withTypeProvider<ZodTypeProvider>().post(
    '/logs',
    {
      websocket: true,
    },
    async (socket) => {
      socket.on('message', async (message) => {
        const data = JSON.parse(message.toString())
        await createLogService(data)
      })
    },
  )
}
