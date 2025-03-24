import { and, eq, ne } from 'drizzle-orm'

import type { InsertSessionModel, Session } from '@/domain/entities/sessions'

import { db } from '..'
import { sessions } from '../schemas'

export async function createSession(data: InsertSessionModel) {
  const session = await db.insert(sessions).values(data).returning()

  return session[0]
}

export async function findSessionByUserIdIpAddressAndUserAgent({
  userId,
  ipAddress,
  userAgent,
}: {
  userId: string
  ipAddress: string
  userAgent: string
}) {
  const session = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        eq(sessions.ipAddress, ipAddress),
        eq(sessions.userAgent, userAgent),
      ),
    )

  if (!session || session.length <= 0) return null

  return session[0]
}

export async function findSessionById({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  const session = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))

  if (!session || session.length <= 0) return null

  return session[0]
}

export async function findSessionByToken({
  token,
  userId,
}: {
  token: string
  userId: string
}) {
  const session = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), eq(sessions.userId, userId)))

  if (!session || session.length <= 0) return null

  return session[0]
}

export async function findSessionByIdIpAndUserAgent({
  id,
  userId,
  ipAddress,
  userAgent,
}: {
  id: string
  userId: string
  ipAddress: string
  userAgent: string
}) {
  const session = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, id),
        eq(sessions.userId, userId),
        eq(sessions.ipAddress, ipAddress),
        eq(sessions.userAgent, userAgent),
      ),
    )

  if (!session || session.length <= 0) return null

  return session[0]
}
export async function findActiveSessionById({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  const session = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, id),
        eq(sessions.userId, userId),
        eq(sessions.status, 'active'),
      ),
    )

  if (!session || session.length <= 0) return null

  return session[0]
}
export async function fetchUserSessions({ userId }: { userId: string }) {
  return await db.select().from(sessions).where(eq(sessions.userId, userId))
}

export async function fetchUserActiveSessions({ userId }: { userId: string }) {
  return await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.userId, userId), eq(sessions.status, 'active')))
}

export async function updateSessionById(
  id: string,
  userId: string,
  data: Partial<Session>,
) {
  await db
    .update(sessions)
    .set(data)
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
}

export async function updateSessionByToken(
  token: string,
  userId: string,
  data: Partial<Session>,
) {
  await db
    .update(sessions)
    .set(data)
    .where(and(eq(sessions.token, token), eq(sessions.userId, userId)))
}

export async function updateSessionRefreshedAt(id: string, userId: string) {
  await db
    .update(sessions)
    .set({ refreshedAt: new Date() })
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
}

export async function deleteSessionById({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  await db
    .delete(sessions)
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
}

export async function deleteSessionByToken({
  token,
  userId,
}: {
  token: string
  userId: string
}) {
  await db
    .delete(sessions)
    .where(and(eq(sessions.token, token), eq(sessions.userId, userId)))
}

export async function deleteAllSessionsByUserId({
  userId,
}: {
  userId: string
}) {
  await db
    .delete(sessions)
    .where(and(eq(sessions.userId, userId), eq(sessions.status, 'active')))
}

export async function revokeSessionById({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  await db
    .update(sessions)
    .set({ status: 'revoked' })
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
}

export async function revokeSessionByToken({
  token,
  userId,
}: {
  token: string
  userId: string
}) {
  await db
    .update(sessions)
    .set({ status: 'revoked' })
    .where(and(eq(sessions.token, token), eq(sessions.userId, userId)))
}

export async function revokeAllSessionsByUserId({
  userId,
}: {
  userId: string
}) {
  await db
    .update(sessions)
    .set({ status: 'revoked' })
    .where(and(eq(sessions.userId, userId), ne(sessions.status, 'revoked')))
}
