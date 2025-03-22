import { getCategoryByIdAndServerId } from '@/db/repositories/categories'
import type { Category } from '@/domain/entities/categories'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'

export async function getCategoryService({
  id,
  serverId,
}: {
  id: string
  serverId: string
}) {
  const cacheKey = `categories:${id}:${serverId}`
  const cachedCategory = await getCache<Category>(cacheKey)

  if (cachedCategory)
    return success({
      data: cachedCategory,
      code: 200,
    })

  const category = await getCategoryByIdAndServerId({ id, serverId })

  if (!category)
    return error({
      message: 'Category not found' as const,
      code: 404,
    })

  await setCache(cacheKey, JSON.stringify(category), ONE_DAY_IN_SECONDS)

  return success({
    data: category,
  })
}
