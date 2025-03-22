import { fetchCategories } from '@/db/repositories/categories'
import { success } from '@/utils/api-response'

export async function fetchCategoriesService({
  serverId,
}: {
  serverId: string
}) {
  const categories = await fetchCategories({ serverId })

  return success({
    data: categories,
    code: 200,
  })
}
