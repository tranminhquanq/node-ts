import fastifyPlugin from 'fastify-plugin'
import { JwtPayload } from 'jsonwebtoken'

import { verifyJWT } from '@internal/auth'
// import { getJwtSecret } from '@internal/database'
import { Errors } from '@internal/errors'

declare module 'fastify' {
  interface FastifyRequest {
    isAuthenticated: boolean
    jwt: string
    jwtPayload?: JwtPayload & { role?: string }
    owner?: string
  }

  interface FastifyContextConfig {
    allowInvalidJwt?: boolean
  }
}

// const BEARER = /^Bearer\s+/i

// export const jwt = fastifyPlugin(
//   async (fastify) => {
//     fastify.decorateRequest('jwt', '')
//     fastify.decorateRequest('jwtPayload', undefined)

//     fastify.addHook('preHandler', async (request, reply) => {
//       request.jwt = (request.headers.authorization || '').replace(BEARER, '')

//       if (!request.jwt && request.routeConfig.allowInvalidJwt) {
//         request.jwtPayload = { role: 'anon' }
//         request.isAuthenticated = false
//         return
//       }

//     //   const { secret, jwks } = await getJwtSecret(request.tenantId)
//       const { secret, jwks } = await Promise.resolve({ secret: '', jwks: '' })

//       try {
//         const payload = await verifyJWT(request.jwt, secret, jwks || null)
//         request.jwtPayload = payload
//         request.owner = payload.sub
//         request.isAuthenticated = true
//       } catch (err: any) {
//         request.jwtPayload = { role: 'anon' }
//         request.isAuthenticated = false

//         if (request.routeConfig.allowInvalidJwt) {
//           return
//         }
//         throw Errors.AccessDenied(err.message, err)
//       }
//     })
//   },
//   { name: 'auth-jwt' }
// )