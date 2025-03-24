import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { passwordRecoveryRequest } from '@/db/schemas'

export type PasswordRecoveryRequest = InferSelectModel<
  typeof passwordRecoveryRequest
>
export type InsertPasswordRecoveryRequest = InferInsertModel<
  typeof passwordRecoveryRequest
>
