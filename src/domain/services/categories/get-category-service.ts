import { getCategoryById } from '@/db/repositories/categories'
import { error, success } from '@/utils/api-response'

export async function getCategoryService({ id }: { id: string }) {
  const category = await getCategoryById({ id })

  if (!category)
    return error({
      message: 'Category not found' as const,
      code: 404,
    })

  return success({
    data: category,
  })
}
