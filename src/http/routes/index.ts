import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'

import { env } from '@/env'

import { authenticateUserRoute } from './users/authenticate-user-route'
import { createUserAccountRoute } from './users/create-user-account-route'
import { getUserRoute } from './users/get-user-route'

export function routes(app: FastifyInstance) {
  if (env.APP_ENV === 'dev')
    app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    })

  app.register(fastifyCors, {
    origin: getCorsOrigin(),
  })
  app.register(fastifyCookie)

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  })

  app.register(fastifyMultipart)

  app.register(createUserAccountRoute)
  app.register(authenticateUserRoute)
  app.register(getUserRoute)
}

function getCorsOrigin() {
  return env.APP_ENV === 'prod' ? env.CLIENT_URL : '*'
}
