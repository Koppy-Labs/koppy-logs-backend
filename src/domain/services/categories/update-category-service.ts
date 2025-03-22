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
  console.log('Starting updateCategoryService with:', { id, data })

  const cacheKey = `categories:${id}`
  console.log('Checking cache for key:', cacheKey)
  const cachedCategory = await getCache<Category>(cacheKey)

  if (cachedCategory) {
    console.log('Found cached category:', cachedCategory)
  } else {
    console.log('No cached category found for id:', id)
  }

  const category = await getCategoryById({ id })
  console.log('Database category result:', category)

  if (!category) {
    console.log('No category found in database for id:', id)
    return error({
      message: 'Category not found' as const,
      code: 404,
    })
  }

  if (data.name) {
    console.log('Checking for duplicate category name:', data.name)
    const categoryWithSameName = await getCategoryByName({
      serverId: category.serverId,
      name: data.name,
    })

    if (categoryWithSameName && categoryWithSameName.id !== id) {
      console.log('Found duplicate category name:', categoryWithSameName)
      return error({
        message: 'Category already exists' as const,
        code: 409,
      })
    }
    console.log('No duplicate category name found')
  }

  console.log('Updating category with data:', data)
  const newCategory = await updateCategory({ id, data })
  console.log('Category updated successfully:', newCategory)

  console.log('Updating cache with new category data')
  await setCache(cacheKey, JSON.stringify(newCategory), ONE_DAY_IN_SECONDS)
  console.log('Cache updated successfully')

  return success({
    data: newCategory,
    code: 204,
  })
}
