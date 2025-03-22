import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

import { insertUser } from '@/db/repositories/users'
import type { InsertUserModel } from '@/domain/entities/user'
import type { RemoveNull } from '@/types/remove-null'
import { hashPassword } from '@/utils/password'

export async function makeUser(
  user: RemoveNull<Partial<InsertUserModel>> = {},
) {
  const rawUser = makeRawUser(user)

  return await insertUser({
    ...rawUser,
    password: await hashPassword(rawUser.password),
  })
}

export function makeRawUser(user: RemoveNull<Partial<InsertUserModel>> = {}) {
  const rawUser: InsertUserModel = {
    id: createId(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    avatarUrl: faker.image.avatar(),
    createdAt: new Date(),
    updatedAt: new Date(),
    password: faker.internet.password(),

    ...user,
  }

  return rawUser
}
