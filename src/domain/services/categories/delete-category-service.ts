import { deleteCategory, getCategoryById } from '@/db/repositories/categories'
import { error, success } from '@/utils/api-response'

export async function deleteCategoryService({ id }: { id: string }) {
  const category = await getCategoryById({ id })

  if (!category)
    return error({ message: 'Category not found' as const, code: 404 })

  await deleteCategory({ id })

  return success({
    data: null,
    code: 204,
  })
}
