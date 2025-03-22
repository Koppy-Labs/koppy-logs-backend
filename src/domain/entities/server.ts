import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { servers } from '@/db/schemas'

export type Server = InferSelectModel<typeof servers>
export type InsertServerModel = InferInsertModel<typeof servers>
