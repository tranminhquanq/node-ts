import { FastifyInstance } from 'fastify'
// import { jwt } from '../../plugins'
import healthcheck from './healthcheck'

export default async function routes(fastify: FastifyInstance) {
  //   fastify.register(jwt)
  //   fastify.register(dbSuperUser)
  //   fastify.register(storage)
  fastify.register(healthcheck)
}
