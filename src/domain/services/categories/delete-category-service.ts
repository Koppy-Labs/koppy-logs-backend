import { deleteCategory, getCategoryById } from '@/db/repositories/categories'
import type { Category } from '@/domain/entities/categories'
import { error, success } from '@/utils/api-response'
import { deleteCache, getCache } from '@/utils/cache'

export async function deleteCategoryService({ id }: { id: string }) {
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

  await deleteCategory({ id })
  await deleteCache(cacheKey)

  return success({
    data: null,
    code: 204,
  })
}
