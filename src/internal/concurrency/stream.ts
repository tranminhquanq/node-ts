import { Transform, TransformCallback } from 'stream'

export function createByteCounterStream() {
  let bytes = 0
  const transformStream = new Transform({
    transform(chunk: Buffer, encoding: string, callback: TransformCallback) {
      bytes += chunk.length
      callback(null, chunk)
    },
  })

  return {
    transformStream,
    get bytes() {
      return bytes
    },
  }
}
