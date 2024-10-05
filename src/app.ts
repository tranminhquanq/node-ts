import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { getConfig } from './config'
import { onError, plugins, routes } from './http'

interface buildOpts extends FastifyServerOptions {
  exposeDocs?: boolean
}

const { version, keepAliveTimeout, headersTimeout } = getConfig()

const build = (opts: buildOpts = {}): FastifyInstance => {
  const app = fastify(opts)

  app.addContentTypeParser('*', function (request, payload, done) {
    done(null)
  })

  // kong should take care of cors
  // app.register(fastifyCors)

  if (opts.exposeDocs) {
    app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Node Backend API',
          description: 'API documentation for Node Backend',
          version: version,
        },
        tags: [
          { name: 'object', description: 'Object end-points' },
          { name: 'bucket', description: 'Bucket end-points' },
          { name: 's3', description: 'S3 end-points' },
          { name: 'transformation', description: 'Image transformation' },
          { name: 'resumable', description: 'Resumable Upload end-points' },
        ],
      },
    })

    app.register(fastifySwaggerUi, {
      routePrefix: '/documentation',
    })
  }

  app.register(plugins.signals)
  // app.register(plugins.tenantId)
  // app.register(plugins.metrics({ enabledEndpoint: true }))
  // app.register(plugins.tracing)
  // app.register(plugins.logRequest({ excludeUrls: ['/status', '/metrics', '/health'] }))
  app.register(routes.healthcheck, { prefix: 'health' })

  app.server.keepAliveTimeout = keepAliveTimeout * 1000
  app.server.headersTimeout = headersTimeout * 1000

  onError(app)

  app.get('/version', (_, reply) => reply.send(version))
  app.get('/status', (_, reply) => reply.status(200).send(200))

  return app
}

export default build
