import { eq } from 'drizzle-orm'

import type { InsertUserModel, User } from '@/domain/entities/user'
import { BadRequestError } from '@/http/errors/bad-request-error'

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

export async function findUserById({ id }: { id: string }) {
  const user = await db.select().from(users).where(eq(users.id, id))

  if (!user || user.length <= 0) throw new BadRequestError('User not found')

  return user[0]
}

export async function updateUser({ id, data }: { id: string; data: User }) {
  await db.update(users).set(data).where(eq(users.id, id))
}

export async function deleteUser({ id }: { id: string }) {
  await db.delete(users).where(eq(users.id, id))
}
