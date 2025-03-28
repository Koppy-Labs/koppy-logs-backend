import type { FastifyInstance } from 'fastify'
import type { FastifySchemaValidationError } from 'fastify/types/schema'
import { ZodError } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { ConflictError } from '@/http/errors/conflict-error'
import { NotFoundError } from '@/http/errors/not-found-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

const formatFastifyValidationError = (
  validationErrors: FastifySchemaValidationError[] | undefined,
) => {
  if (!validationErrors) {
    return []
  }

  const formattedErrors: { field?: string; message: string }[] = []

  validationErrors.forEach((error) => {
    const field = error.instancePath
      ? error.instancePath.substring(1)
      : 'global' // Remove leading dot, default to 'global'
    formattedErrors.push({ field, message: error.message ?? '' })
  })

  return formattedErrors
}

export const errorHandler: FastifyErrorHandler = (err, req, res) => {
  if (err.code === 'FST_ERR_VALIDATION') {
    const errors = formatFastifyValidationError(err.validation)
    console.error('Fastify Validation Error', errors)

    return res.status(400).send({
      message: 'Validation error',
      errors,
    })
  }

  if (err instanceof ZodError) {
    // This part is still useful for manual Zod validation
    const formattedErrors = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }))

    return res.status(400).send({
      message: 'Validation error',
      errors: formattedErrors,
    })
  }

  if (err instanceof BadRequestError)
    return res.status(400).send({ message: err.message })

  if (err instanceof NotFoundError)
    return res.status(404).send({ message: err.message })

  if (err instanceof ConflictError)
    return res.status(409).send({ message: err.message })

  console.error(err) // TODO: here we should send this error to an observability service

  return res.status(500).send({ message: 'Internal server error' })
}
