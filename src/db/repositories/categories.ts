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

export async function getCategoryByIdAndServerId({
  id,
  serverId,
}: {
  id: string
  serverId: string
}) {
  const category = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.serverId, serverId)))

  if (!category || category.length === 0) return null

  return category[0]
}
export async function fetchCategories({
  serverId,
  limit = 50,
  offset = 0,
}: {
  serverId: string
  limit?: number
  offset?: number
}) {
  const queriedCategories = await db
    .select()
    .from(categories)
    .limit(limit)
    .offset(offset)
    .where(eq(categories.serverId, serverId))
    .orderBy(categories.name)

  return queriedCategories
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
  const result = await db.delete(categories).where(eq(categories.id, id))

  return result.rowCount > 0
}
