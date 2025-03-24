import {
  getCategoryById,
  getCategoryByName,
  updateCategory,
} from '@/db/repositories/categories'
import type {
  Category,
  UpdateCategoryModel,
} from '@/domain/entities/categories'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'

export async function updateCategoryService({ id, data }: UpdateCategoryModel) {
  const cacheKey = `categories:${id}`
  let category = await getCache<Category>(cacheKey)

  if (!category) {
    category = await getCategoryById({ id })

    if (!category) {
      return error({
        message: 'Category not found' as const,
        code: 404,
      })
    }
  }

  if (data.name) {
    const categoryWithSameName = await getCategoryByName({
      serverId: category.serverId,
      name: data.name,
    })

    if (categoryWithSameName && categoryWithSameName.id !== id) {
      return error({
        message: 'Category already exists' as const,
        code: 409,
      })
    }
  }

  const newCategory = await updateCategory({ id, data })

  await setCache(cacheKey, JSON.stringify(newCategory), ONE_DAY_IN_SECONDS)

  return success({
    data: newCategory,
    code: 204,
  })
}
