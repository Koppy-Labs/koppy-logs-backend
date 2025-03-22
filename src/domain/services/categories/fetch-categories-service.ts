import { fetchCategories } from '@/db/repositories/categories'
import type { Category } from '@/domain/entities/categories'
import { success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'

export async function fetchCategoriesService({
  serverId,
}: {
  serverId: string
}) {
  const cacheKey = `categories:${serverId}`
  const cachedCategories = await getCache<Category[]>(cacheKey)

  if (cachedCategories)
    return success({
      data: cachedCategories,
      code: 200,
    })

  const categories = await fetchCategories({ serverId })

  await setCache(cacheKey, JSON.stringify(categories), ONE_DAY_IN_SECONDS)

  return success({
    data: categories,
    code: 200,
  })
}
