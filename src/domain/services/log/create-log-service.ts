import { createLog } from '@/db/repositories/log'
import type { InsertLogModel } from '@/domain/entities/log'
import { logPubSub } from '@/utils/log-pub-sub'

export async function createLogService(log: InsertLogModel) {
  const newLog = await createLog(log)

  return logPubSub.publish({
    serverId: newLog.serverId,
    message: newLog,
  })
}
