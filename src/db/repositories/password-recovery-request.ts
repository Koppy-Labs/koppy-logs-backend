import { eq } from 'drizzle-orm'

import { db } from '..'
import { passwordRecoveryRequest } from '../schemas/password-recovery-request'

export async function createRecoveryRequest({ userId }: { userId: string }) {
  const recoveryRequest = await db
    .insert(passwordRecoveryRequest)
    .values({
      userId,
    })
    .returning()

  return recoveryRequest[0]
}

export async function findRecoveryRequestById({ id }: { id: string }) {
  const recoveryRequest = await db
    .select()
    .from(passwordRecoveryRequest)
    .where(eq(passwordRecoveryRequest.id, id))

  if (!recoveryRequest || recoveryRequest.length <= 0) return null

  return recoveryRequest[0]
}

export async function deleteRecoveryRequestById({ id }: { id: string }) {
  return await db
    .delete(passwordRecoveryRequest)
    .where(eq(passwordRecoveryRequest.id, id))
}
