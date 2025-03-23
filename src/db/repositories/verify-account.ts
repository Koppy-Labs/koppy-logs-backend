import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { verifyAccount } from '@/db/schemas/verify-account'

export async function generateOTPCode({ email }: { email: string }) {
  const otpCode = await db.insert(verifyAccount).values({ email }).returning()

  return otpCode[0].id
}

export async function getOTPCode({
  email,
  otpCode,
}: {
  email: string
  otpCode: string
}) {
  const queriedOtpCode = await db
    .select()
    .from(verifyAccount)
    .where(and(eq(verifyAccount.email, email), eq(verifyAccount.id, otpCode)))

  if (!queriedOtpCode || queriedOtpCode.length === 0) return null

  return queriedOtpCode[0]
}
