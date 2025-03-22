import { createCategory, getCategoryByName } from '@/db/repositories/categories'
import type { InsertCategoryModel } from '@/domain/entities/categories'
import { error, success } from '@/utils/api-response'

export async function createCategoryService({
  serverId,
  name,
}: InsertCategoryModel) {
  const category = await getCategoryByName({ serverId, name })

  if (category)
    return error({
      message: 'Category already exists',
      code: 400,
    })

  const newCategory = await createCategory({ serverId, name })

  return success({
    data: newCategory,
    code: 204,
  })
}
