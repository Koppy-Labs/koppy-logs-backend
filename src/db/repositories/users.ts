import { eq } from 'drizzle-orm'

import type { InsertUserModel, UpdateUserModel } from '@/domain/entities/user'

import { db } from '../index'
import { users } from '../schemas'

export async function insertUser(user: InsertUserModel) {
  const [newUser] = await db.insert(users).values(user).returning()

  return newUser
}

export async function findUserByEmail({ email }: { email: string }) {
  const user = await db.select().from(users).where(eq(users.email, email))

  if (!user || user.length <= 0) return null

  return user[0]
}

export async function findUserById({ id }: { id: string }) {
  const user = await db.select().from(users).where(eq(users.id, id))

  if (!user || user.length <= 0) return null

  return user[0]
}

export async function updateUser({
  id,
  data,
}: {
  id: string
  data: UpdateUserModel
}) {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()

  return updatedUser
}

export async function deleteUser({ id }: { id: string }) {
  await db.delete(users).where(eq(users.id, id))
}

export async function updatePassword({
  id,
  password,
}: {
  id: string
  password: string
}) {
  await db.update(users).set({ password }).where(eq(users.id, id))
}

export async function updateUserVerified({
  id,
  verified,
}: {
  id: string
  verified: boolean
}) {
  const [updatedUser] = await db
    .update(users)
    .set({ verified })
    .where(eq(users.id, id))
    .returning()

  return updatedUser
}
