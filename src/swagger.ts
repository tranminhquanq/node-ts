import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { getConfig } from './config'

const { version } = getConfig()

export default (app: FastifyInstance) => {
  return {
    register: (routePrefix = '/documentation') => {
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
        routePrefix,
      })
    },
  }
}
