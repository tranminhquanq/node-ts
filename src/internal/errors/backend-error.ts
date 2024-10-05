import { ErrorCode } from './codes'
import { RenderableError } from './renderable'
import { ErrorOptions } from './renderable'

export class BackendError extends Error implements RenderableError {
  httpStatusCode: number
  originalError: unknown
  userStatusCode: number
  resource?: string
  code: ErrorCode
  metadata?: Record<string, any> = {}
  error?: string // backwards compatible error

  constructor(options: ErrorOptions) {
    super(options.message)
    this.code = options.code
    this.httpStatusCode = options.httpStatusCode
    this.userStatusCode = options.httpStatusCode === 500 ? 500 : 400
    this.message = options.message
    this.originalError = options.originalError
    this.resource = options.resource
    this.error = options.error
    Object.setPrototypeOf(this, BackendError.prototype)
  }

  static withStatusCode(statusCode: number, options: ErrorOptions) {
    const error = new BackendError(options)
    error.userStatusCode = statusCode
    return error
  }

  static fromError(error?: unknown) {
    let oldErrorMessage: string
    let httpStatusCode: number
    let message: string
    let code: ErrorCode

    if (error instanceof Error) {
      code = ErrorCode.InternalError
      oldErrorMessage = error.name
      httpStatusCode = 500
      message = error.message
    } else {
      code = ErrorCode.InternalError
      oldErrorMessage = 'Internal server error'
      httpStatusCode = 500
      message = 'Internal server error'
    }

    return new BackendError({
      error: oldErrorMessage,
      code: code,
      httpStatusCode,
      message,
      originalError: error,
    })
  }

  render() {
    return {
      statusCode: this.userStatusCode.toString(),
      code: this.code,
      error: this.error || this.code,
      message: this.message,
    }
  }

  getOriginalError() {
    return this.originalError
  }

  withMetadata(metadata: Record<string, any>) {
    this.metadata = metadata
    return this
  }
}

export function isRenderableError(error: unknown): error is RenderableError {
  return !!error && typeof error === 'object' && 'render' in error
}
