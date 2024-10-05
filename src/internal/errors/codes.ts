import { BackendError } from './backend-error'

export enum ErrorCode {
  InternalError = 'InternalError',
  InvalidJWT = 'InvalidJWT',
  AccessDenied = 'AccessDenied',
  Aborted = 'Aborted',
  AbortedTerminate = 'AbortedTerminate',
}

export const Errors = {
  InternalError: (e?: Error, message?: string) =>
    new BackendError({
      code: ErrorCode.InternalError,
      httpStatusCode: 500,
      message: message || 'Internal server error',
      originalError: e,
    }),
  InvalidJWT: (e?: Error) =>
    new BackendError({
      code: ErrorCode.InvalidJWT,
      httpStatusCode: 400,
      message: e?.message || 'Invalid JWT',
    }),
  AccessDenied: (message: string, originalError?: unknown) =>
    new BackendError({
      code: ErrorCode.AccessDenied,
      httpStatusCode: 403,
      message: message,
      originalError,
    }),
  Aborted: (message: string, originalError?: unknown) =>
    new BackendError({
      code: ErrorCode.Aborted,
      httpStatusCode: 500,
      message: message,
      originalError,
    }),
  AbortedTerminate: (message: string, originalError?: unknown) =>
    new BackendError({
      code: ErrorCode.AbortedTerminate,
      httpStatusCode: 500,
      message: message,
      originalError,
    }),
}

export function normalizeRawError(error: any) {
  if (error instanceof Error) {
    return {
      raw: JSON.stringify(error),
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  try {
    return {
      raw: JSON.stringify(error),
    }
  } catch (e) {
    return {
      raw: 'Failed to stringify error',
    }
  }
}
