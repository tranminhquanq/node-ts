import { FromSchema } from 'json-schema-to-ts'

export const healthcheckResponseSchema = {
  type: 'object',
  properties: {
    ok: {
      type: 'boolean',
    },
  },
  required: ['ok'],
} as const

export type HealthcheckResponse = FromSchema<typeof healthcheckResponseSchema>
