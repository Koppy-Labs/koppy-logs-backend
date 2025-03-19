import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { logs } from '@/db/schemas'

export type Log = InferSelectModel<typeof logs>
export type InsertLogModel = InferInsertModel<typeof logs>
