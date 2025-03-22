import { createCategory } from '@/db/repositories/categories'
import { InsertCategoryModel } from '@/domain/entities/categories'
import { success } from '@/utils/api-response'

export async function createCategoryService({
  serverId,
  name,
}: InsertCategoryModel) {
  try {
    await createCategory({ serverId, name })

    return success({
      data: null,
      code: 204,
    })
  } catch (error) {
    return error({
      message: 'Failed to create category',
      code: 500,
    })
  }
}
