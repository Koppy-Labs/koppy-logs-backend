import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { db } from '@/db'
import { serverMembers } from '@/db/schemas'
import { validateJwtToken } from '@/utils/jwt'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req, res) => {
    req.getCurrentUserId = async () => {
      if (!req.headers.authorization)
        return res.status(401).send({ message: 'Unauthorized.' })

      try {
        const payload = await validateJwtToken(req.headers.authorization)

        if (!payload.sub)
          return res.status(401).send({ message: 'Unauthorized.' })

        return { sub: payload.sub }
      } catch (error) {
        return res.status(401).send({ message: 'Unauthorized.' })
      }
    }
    req.getMembership = async (params: {
      userId: string
      serverId: string
    }) => {
      const { userId, serverId } = params

      const membership = await db
        .select()
        .from(serverMembers)
        .where(
          and(
            eq(serverMembers.userId, userId),
            eq(serverMembers.serverId, serverId),
          ),
        )

      if (!membership || membership.length <= 0)
        return res.status(401).send({ message: 'Unauthorized.' })

      return {
        id: membership[0].id,
        serverId: membership[0].serverId,
        userId: membership[0].userId,
        role: membership[0].role.toUpperCase(),
      }
    }
  })
})
