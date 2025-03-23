import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const passwordRecoveryRequest = pgTable('password_recovery_request', {
  id: text('id').primaryKey().$defaultFn(createId).notNull(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const passwordRecoveryRequestRelations = relations(
  passwordRecoveryRequest,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordRecoveryRequest.userId],
      references: [users.id],
    }),
  }),
)
