import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import swagger from './swagger'
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

  if (opts.exposeDocs) swagger(app).register()

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
