import { eq } from 'drizzle-orm'

import type { InsertUserModel } from '@/domain/entities/user'

import { db } from '../index'
import { users } from '../schemas'

export async function insertUser(user: InsertUserModel) {
  await db.insert(users).values(user).returning()
}

export async function findUserByEmail({ email }: { email: string }) {
  const user = await db.select().from(users).where(eq(users.email, email))

  if (!user || user.length <= 0) return null

  return user[0]
}
