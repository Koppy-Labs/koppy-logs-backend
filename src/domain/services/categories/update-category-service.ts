import { getCategoryById, updateCategory } from '@/db/repositories/categories'
import type { UpdateCategoryModel } from '@/domain/entities/categories'
import { error, success } from '@/utils/api-response'

export async function updateCategoryService({ id, data }: UpdateCategoryModel) {
  const category = await getCategoryById({ id })

  if (!category)
    return error({
      message: 'Category not found' as const,
      code: 404,
    })

  const newCategory = await updateCategory({ id, data })

  return success({
    data: newCategory,
    code: 204,
  })
}
