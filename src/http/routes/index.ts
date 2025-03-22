import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'

import { env } from '@/env'

import { createCategoryRoute } from './categories/create-category-route'
import { deleteCategoryRoute } from './categories/delete-category-route'
import { fetchCategoriesRoute } from './categories/fetch-categories-route'
import { getCategoryRoute } from './categories/get-category-route'
import { updateCategoryRoute } from './categories/update-category-route'
import { createServerRoute } from './server/create-server-route'
import { createUserAccountRoute } from './users/create-user-account-route'
import { getUserRoute } from './users/get-user-route'
import { updateUserRoute } from './users/update-user-route'
import { createLogRoute } from './websocket/create-log-route'

export function routes(app: FastifyInstance) {
  if (env.app.APP_ENV === 'dev')
    app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    })

  app.register(fastifyCors, {
    origin: getCorsOrigin(),
  })
  app.register(fastifyCookie)

  app.register(fastifyJwt, {
    secret: env.app.JWT_SECRET,
  })

  app.register(fastifyMultipart)

  app.register(createUserAccountRoute)
  app.register(getUserRoute)
  app.register(updateUserRoute)
  app.register(createCategoryRoute)
  app.register(createLogRoute)
  app.register(createServerRoute)
  app.register(updateCategoryRoute)
  app.register(deleteCategoryRoute)
  app.register(fetchCategoriesRoute)
  app.register(getCategoryRoute)
}

function getCorsOrigin() {
  return env.app.APP_ENV === 'prod' ? env.app.CLIENT_URL : '*'
}
