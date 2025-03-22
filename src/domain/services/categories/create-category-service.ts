import { createCategory, getCategoryByName } from '@/db/repositories/categories'
import type {
  Category,
  InsertCategoryModel,
} from '@/domain/entities/categories'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'

export async function createCategoryService({
  serverId,
  name,
}: InsertCategoryModel) {
  const cacheKey = `categories:${serverId}:${name}`
  const cachedCategory = await getCache<Category>(cacheKey)

  if (cachedCategory)
    return error({
      message: 'Category already exists',
      code: 400,
    })

  const category = await getCategoryByName({ serverId, name })

  if (category) {
    await setCache(cacheKey, JSON.stringify(category), ONE_DAY_IN_SECONDS)

    return error({
      message: 'Category already exists',
      code: 400,
    })
  }

  const newCategory = await createCategory({ serverId, name })

  await setCache(cacheKey, JSON.stringify(newCategory), ONE_DAY_IN_SECONDS)

  return success({
    data: newCategory,
    code: 204,
  })
}
