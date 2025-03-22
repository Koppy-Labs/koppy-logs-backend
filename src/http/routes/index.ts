import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'

import { env } from '@/env'

import { createCategoryRoute } from './categories/create-category-route'
import { deleteCategoryRoute } from './categories/delete-category-route'
import { updateCategoryRoute } from './categories/update-category-route'
import { createServerRoute } from './server/create-server-route'
import { authenticateUserRoute } from './users/authenticate-user-route'
import { createUserAccountRoute } from './users/create-user-account-route'
import { getUserRoute } from './users/get-user-route'
import { updateUserRoute } from './users/update-user-route'
import { createLogRoute } from './websocket/create-log-route'

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
  app.register(updateUserRoute)
  app.register(createCategoryRoute)
  app.register(createLogRoute)
  app.register(createServerRoute)
  app.register(updateCategoryRoute)
  app.register(deleteCategoryRoute)
}

function getCorsOrigin() {
  return env.APP_ENV === 'prod' ? env.CLIENT_URL : '*'
}
