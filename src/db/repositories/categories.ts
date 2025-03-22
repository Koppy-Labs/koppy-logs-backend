import { and, eq } from 'drizzle-orm'

import {
  type Category,
  InsertCategoryModel,
  type UpdateCategoryModel,
} from '@/domain/entities/categories'

import { db } from '..'
import { categories } from '../schemas'

export async function createCategory({ serverId, name }: InsertCategoryModel) {
  const [category] = await db
    .insert(categories)
    .values({ serverId, name })
    .returning()

  return category
}

export async function getCategoryByName({
  serverId,
  name,
}: {
  serverId: string
  name: string
}) {
  const category = await db
    .select()
    .from(categories)
    .where(and(eq(categories.serverId, serverId), eq(categories.name, name)))

  if (!category || category.length === 0) return null

  return category[0]
}

export async function getCategoryById({ id }: Pick<Category, 'id'>) {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))

  if (!category || category.length === 0) return null

  return category[0]
}

export async function updateCategory({ id, data }: UpdateCategoryModel) {
  const [category] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning()

  return category
}

export async function deleteCategory({ id }: Pick<Category, 'id'>) {
  await db.delete(categories).where(eq(categories.id, id))
}
