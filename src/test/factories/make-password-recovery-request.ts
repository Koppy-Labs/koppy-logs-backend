import { createId } from '@paralleldrive/cuid2'

import { createRecoveryRequest } from '@/db/repositories/password-recovery-request'
import type { InsertPasswordRecoveryRequest } from '@/domain/entities/password-recovery-request'
import type { RemoveNull } from '@/types/remove-null'

export async function makePasswordRecoveryRequest(
  data: RemoveNull<Partial<InsertPasswordRecoveryRequest>>,
) {
  const rawRecoveryRequest = makeRawPasswordRecoveryRequest({
    userId: data.userId ? String(data.userId) : undefined,
    createdAt: data.createdAt,
  })

  return await createRecoveryRequest(rawRecoveryRequest)
}

export function makeRawPasswordRecoveryRequest({
  userId,
  createdAt,
}: {
  userId?: string
  createdAt?: Date
}) {
  return {
    userId: userId ?? createId(),
    createdAt,
  }
}
