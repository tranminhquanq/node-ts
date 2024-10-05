import { AsyncAbortController } from '@internal/concurrency'
import { FastifyInstance } from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'node:http'
import { logger, logSchema } from '@internal/monitoring'
import { getConfig } from 'config'
import build from 'app'
import { shutdown, createServerClosedPromise, bindShutdownSignals } from './shutdown'

const shutdownSignal = new AsyncAbortController()
bindShutdownSignals(shutdownSignal)

// Start API server
main()
  .then(() => {
    logSchema.info(logger, '[Server] Started Successfully', {
      type: 'server',
    })
  })
  .catch(async (e) => {
    logSchema.error(logger, 'Server not started with error', {
      type: 'server_start_error',
      error: e,
    })

    await shutdown(shutdownSignal)
    process.exit(1)
  })
  .catch(() => {
    process.exit(1)
  })

async function main() {
  // HTTP server
  const app = await httpServer(shutdownSignal.signal)
}

async function httpServer(signal: AbortSignal) {
  const { host, port, requestTraceHeader } = getConfig()
  const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = build({
    logger: {}, // idk why i can't pass logger here
    disableRequestLogging: true,
    exposeDocs: true,
    requestIdHeader: requestTraceHeader,
  })
  const closePromise = createServerClosedPromise(app.server, () => {
    logSchema.info(logger, '[Server] Exited', {
      type: 'server',
    })
  })
  try {
    signal.addEventListener(
      'abort',
      async () => {
        logSchema.info(logger, '[Server] Stopping', {
          type: 'server',
        })

        await closePromise
      },
      { once: true }
    )
    await app.listen({ port, host, signal })

    return app
  } catch (err) {
    logSchema.error(logger, `Server failed to start`, {
      type: 'server_start_error',
      error: err,
    })
    throw err
  }
}
