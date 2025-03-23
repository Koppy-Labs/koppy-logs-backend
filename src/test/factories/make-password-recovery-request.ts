import { createId } from '@paralleldrive/cuid2'

import { createRecoveryRequest } from '@/db/repositories/password-recovery-request'

export async function makePasswordRecoveryRequest({
  userId,
}: {
  userId: string
}) {
  const rawRecoveryRequest = makeRawPasswordRecoveryRequest({ userId })

  return await createRecoveryRequest(rawRecoveryRequest)
}

export function makeRawPasswordRecoveryRequest({
  userId,
}: {
  userId?: string
}) {
  return {
    userId: userId ?? createId(),
  }
}
