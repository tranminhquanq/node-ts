import { FastifyInstance } from 'fastify'
import { FastifyError } from '@fastify/error'
import { isRenderableError, ErrorCode } from '@internal/errors'

export const onError = (app: FastifyInstance) => {
  app.setErrorHandler<Error>((error, request, reply) => {
    // We assign the error received. It will be logged in the request log plugin
    request.executionError = error

    if (isRenderableError(error)) {
      const renderableError = error.render()
      const statusCode = error.userStatusCode
        ? error.userStatusCode
        : renderableError.statusCode === '500'
          ? 500
          : 400

      if (renderableError.code === ErrorCode.AbortedTerminate) {
        reply.header('Connection', 'close')

        reply.raw.once('finish', () => {
          setTimeout(() => {
            if (!request.raw.closed) {
              request.raw.destroy()
            }
          }, 3000)
        })
      }

      return reply.status(statusCode).send({
        ...renderableError,
        error: error.error || renderableError.code,
      })
    }

    // Fastify errors
    if ('statusCode' in error) {
      const err = error as FastifyError
      return reply.status((error as any).statusCode || 500).send({
        statusCode: `${err.statusCode}`,
        error: err.name,
        message: err.message,
      })
    }

    return reply.status(500).send({
      statusCode: '500',
      error: 'Internal',
      message: 'Internal Server Error',
    })
  })
}
