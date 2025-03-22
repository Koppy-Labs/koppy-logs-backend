import { InsertCategoryModel } from '@/domain/entities/categories'

import { db } from '..'
import { categories } from '../schemas'

export async function createCategory({ serverId, name }: InsertCategoryModel) {
  await db.insert(categories).values({ serverId, name })
}
