import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

export type ConfigType = {
  isProduction: boolean
  version: string
  keepAliveTimeout: number
  headersTimeout: number
  host: string
  port: number
  encryptionKey: string
  jwtAlgorithm: string
  region: string
  requestTraceHeader?: string
  requestEtagHeaders: string[]
  logLevel?: string
  logflareEnabled?: boolean
  logflareApiKey?: string
  logflareSourceToken?: string
  defaultMetricsEnabled: boolean
  tracingEnabled?: boolean
  tracingMode?: string
  tracingTimeMinDuration: number
  tracingReturnServerTimings: boolean
}

export function getOptionalConfigFromEnv(key: string, fallback?: string): string | undefined {
  const value = process.env[key]

  if (!value && fallback) {
    return getOptionalConfigFromEnv(fallback)
  }

  return value
}

export function getConfigFromEnv(key: string, fallbackEnv?: string): string {
  const value = getOptionalConfigFromEnv(key, fallbackEnv)

  if (!value) {
    if (fallbackEnv) {
      return getConfigFromEnv(fallbackEnv)
    }
    throw new Error(`${key} is undefined`)
  }
  return value
}

let config: ConfigType | undefined
let envPaths: string[] = ['.env']

export function setEnvPaths(paths: string[]) {
  envPaths = paths
}

export function mergeConfig(newConfig: Partial<ConfigType>) {
  config = { ...config, ...(newConfig as Required<ConfigType>) }
}

export function getConfig(options?: { reload?: boolean }): ConfigType {
  if (config && !options?.reload) {
    return config
  }

  envPaths.map((envPath) => dotenv.config({ path: envPath, override: false }))
  config = {
    isProduction: process.env.NODE_ENV === 'production',
    encryptionKey: getOptionalConfigFromEnv('AUTH_ENCRYPTION_KEY', 'ENCRYPTION_KEY') || '',
    jwtAlgorithm: getOptionalConfigFromEnv('AUTH_JWT_ALGORITHM', 'PGRST_JWT_ALGORITHM') || 'HS256',

    // Server
    region: getOptionalConfigFromEnv('SERVER_REGION', 'REGION') || 'ap-southeast-1',
    version: getOptionalConfigFromEnv('VERSION') || '0.0.0',
    keepAliveTimeout: parseInt(getOptionalConfigFromEnv('SERVER_KEEP_ALIVE_TIMEOUT') || '61', 10),
    headersTimeout: parseInt(getOptionalConfigFromEnv('SERVER_HEADERS_TIMEOUT') || '65', 10),
    host: getOptionalConfigFromEnv('SERVER_HOST', 'HOST') || '0.0.0.0',
    port: Number(getOptionalConfigFromEnv('SERVER_PORT', 'PORT')) || 8000,

    // Request
    requestTraceHeader: getOptionalConfigFromEnv('REQUEST_TRACE_HEADER', 'REQUEST_ID_HEADER'),
    requestEtagHeaders: getOptionalConfigFromEnv('REQUEST_ETAG_HEADERS')?.trim().split(',') || [
      'if-none-match',
    ],

    // Monitoring
    logLevel: getOptionalConfigFromEnv('LOG_LEVEL') || 'info',
    logflareEnabled: getOptionalConfigFromEnv('LOGFLARE_ENABLED') === 'true',
    logflareApiKey: getOptionalConfigFromEnv('LOGFLARE_API_KEY'),
    logflareSourceToken: getOptionalConfigFromEnv('LOGFLARE_SOURCE_TOKEN'),
    defaultMetricsEnabled: !(
      getOptionalConfigFromEnv('DEFAULT_METRICS_ENABLED', 'ENABLE_DEFAULT_METRICS') === 'false'
    ),
    tracingEnabled: getOptionalConfigFromEnv('TRACING_ENABLED') === 'true',
    tracingMode: getOptionalConfigFromEnv('TRACING_MODE') ?? 'basic',
    tracingTimeMinDuration: parseFloat(
      getOptionalConfigFromEnv('TRACING_SERVER_TIME_MIN_DURATION') ?? '100.0'
    ),
    tracingReturnServerTimings:
      getOptionalConfigFromEnv('TRACING_RETURN_SERVER_TIMINGS') === 'true',
  } as ConfigType

  return config
}
