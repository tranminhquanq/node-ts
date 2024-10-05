import { ErrorCode } from './codes'

export interface ErrorOptions {
  code: ErrorCode
  httpStatusCode: number
  message: string
  resource?: string
  originalError?: unknown
  error?: string
}

export type Error = {
  statusCode: string
  code: ErrorCode
  error: string
  message: string
  query?: string
}

export interface RenderableError {
  error?: string
  userStatusCode?: number
  render(): Error
  getOriginalError(): unknown
}
