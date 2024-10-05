import EventEmitter from 'events'
import { PubSubAdapter } from './adapter'

export class RedisPubSub extends EventEmitter implements PubSubAdapter {
  constructor(connectionString: string) {
    super()
  }

  start(): Promise<void> {
    return Promise.resolve()
  }

  publish(channel: string, message: any): Promise<void> {
    return Promise.resolve()
  }

  subscribe(channel: string, cb: (message: any) => void): Promise<void> {
    return Promise.resolve()
  }

  unsubscribe(channel: string, cb: (message: any) => void): Promise<void> {
    return Promise.resolve()
  }

  close(): Promise<void> {
    return Promise.resolve()
  }

  on<K>(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener)
  }
}
