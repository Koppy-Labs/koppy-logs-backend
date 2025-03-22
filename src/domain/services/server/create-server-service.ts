import { createServer } from '@/db/repositories/server'
import { InsertServerModel } from '@/domain/entities/server'
import { success } from '@/utils/api-response'

export async function createServerService({
  name,
  ownerId,
  imageUrl,
  plan,
}: InsertServerModel) {
  try {
    await createServer({ name, ownerId, imageUrl, plan })

    return success({
      data: null,
      code: 204,
    })
  } catch (error) {
    return error({
      message: 'Failed to create server',
      code: 500,
    })
  }
}
