import { getCategoryByIdAndServerId } from '@/db/repositories/categories'
import { error, success } from '@/utils/api-response'

export async function getCategoryService({
  id,
  serverId,
}: {
  id: string
  serverId: string
}) {
  const category = await getCategoryByIdAndServerId({ id, serverId })

  if (!category)
    return error({
      message: 'Category not found' as const,
      code: 404,
    })

  return success({
    data: category,
  })
}
