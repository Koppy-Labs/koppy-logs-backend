import { getCategoryById, updateCategory } from '@/db/repositories/categories'
import type {
  Category,
  UpdateCategoryModel,
} from '@/domain/entities/categories'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'

export async function updateCategoryService({ id, data }: UpdateCategoryModel) {
  const cacheKey = `categories:${id}`
  const cachedCategory = await getCache<Category>(cacheKey)

  if (!cachedCategory) {
    const category = await getCategoryById({ id })

    if (!category)
      return error({
        message: 'Category not found' as const,
        code: 404,
      })
  }

  const newCategory = await updateCategory({ id, data })

  await setCache(cacheKey, JSON.stringify(newCategory), ONE_DAY_IN_SECONDS)

  return success({
    data: newCategory,
    code: 204,
  })
}
