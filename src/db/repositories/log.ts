import { InsertLogModel } from '@/domain/entities/log'

import { db } from '..'
import { logs } from '../schemas'

export async function createLog(log: InsertLogModel) {
  const [newLog] = await db.insert(logs).values(log).returning()

  return newLog
}
