import { FastifyInstance } from 'fastify'

export default async function routes(app: FastifyInstance) {
  const summary = 'healthcheck'

  app.get(
    '/',
    {
      schema: {
        summary,
      },
    },
    async (req, res) => {
      try {
        res.send({ ok: true })
      } catch (e) {
        if (e instanceof Error) {
          req.executionError = e
        }
        res.send({ ok: false })
      }
    }
  )
}
