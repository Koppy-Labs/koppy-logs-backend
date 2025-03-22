import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

import { createCategory } from '@/db/repositories/categories'
import type { InsertCategoryModel } from '@/domain/entities/categories'
import type { RemoveNull } from '@/types/remove-null'

export async function makeCategory(
  category: RemoveNull<Partial<InsertCategoryModel>> = {},
) {
  const rawCategory = makeRawCategory(category)

  return await createCategory({
    ...rawCategory,
  })
}

export function makeRawCategory(
  category: RemoveNull<Partial<InsertCategoryModel>> = {},
) {
  const rawCategory: InsertCategoryModel = {
    id: createId(),
    name: faker.person.fullName(),
    serverId: createId(),
    createdAt: new Date(),
    updatedAt: new Date(),

    ...category,
  }

  return rawCategory
}
