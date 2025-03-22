import { getCategoryById } from '@/db/repositories/categories'
import { createLog } from '@/db/repositories/log'
import type { Category } from '@/domain/entities/categories'
import type { InsertLogModel } from '@/domain/entities/log'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_MONTH_IN_SECONDS, setCache } from '@/utils/cache'
import { logPubSub } from '@/utils/log-pub-sub'

export async function createLogService(log: InsertLogModel) {
  const categoryCacheKey = `categories:${log.serverId}`
  const cachedCategory = await getCache<Category>(categoryCacheKey)

  if (!cachedCategory) {
    const category = await getCategoryById({ id: log.categoryId })

    if (!category) return error({ message: 'Category not found', code: 404 })

    await setCache(
      categoryCacheKey,
      JSON.stringify(category),
      ONE_MONTH_IN_SECONDS,
    )
  }

  const newLog = await createLog(log)

  await setCache(
    `logs:${newLog.serverId}`,
    JSON.stringify(newLog),
    ONE_MONTH_IN_SECONDS,
  )

  logPubSub.publish({
    serverId: newLog.serverId,
    message: newLog,
  })

  return success({
    data: newLog,
    code: 201,
  })
}
