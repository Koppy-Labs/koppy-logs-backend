import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { categories } from '@/db/schemas'

export type Category = InferSelectModel<typeof categories>
export type InsertCategoryModel = InferInsertModel<typeof categories>
export type UpdateCategoryModel = {
  id: string
  data: Partial<InsertCategoryModel> & Pick<Category, 'serverId'>
}
