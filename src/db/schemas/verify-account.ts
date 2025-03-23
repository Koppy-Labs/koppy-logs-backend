import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const verifyAccount = pgTable('verify_account', {
  id: text('id').primaryKey().$defaultFn(createId),
  email: text('email')
    .notNull()
    .references(() => users.email),

  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const verifyAccountRelations = relations(verifyAccount, ({ one }) => ({
  user: one(users, {
    fields: [verifyAccount.email],
    references: [users.email],
  }),
}))
