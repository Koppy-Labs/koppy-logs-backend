import { createLog } from '@/db/repositories/log'
import type { InsertLogModel } from '@/domain/entities/log'
import { ONE_MONTH_IN_SECONDS, setCache } from '@/utils/cache'
import { logPubSub } from '@/utils/log-pub-sub'

export async function createLogService(log: InsertLogModel) {
  const newLog = await createLog(log)

  await setCache(
    `logs:${newLog.serverId}`,
    JSON.stringify(newLog),
    ONE_MONTH_IN_SECONDS,
  )

  return logPubSub.publish({
    serverId: newLog.serverId,
    message: newLog,
  })
}
