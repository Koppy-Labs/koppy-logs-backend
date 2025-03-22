import type { Log } from '@/domain/entities/log'

type Message = Log
type Subscriber = (message: Message) => void

export class LogPubSub {
  private channels: Record<string, Subscriber[]> = {}

  subscribe({
    serverId,
    subscriber,
  }: {
    serverId: string
    subscriber: Subscriber
  }) {
    if (!this.channels[serverId]) this.channels[serverId] = []

    this.channels[serverId].push(subscriber)
  }

  publish({ serverId, message }: { serverId: string; message: Message }) {
    if (!this.channels[serverId]) return

    for (const subscriber of this.channels[serverId]) {
      subscriber(message)
    }
  }
}

export const logPubSub = new LogPubSub()
