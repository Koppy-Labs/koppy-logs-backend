import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const sessionStatusEnum = pgEnum('session_status', [
  'active',
  'inactive',
  'revoked',
  'expired',
])

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey().$defaultFn(createId),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    status: sessionStatusEnum('status').notNull().default('active'),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    refreshedAt: timestamp('refreshed_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (t) => {
    return {
      userIdIdx: index('sessions_user_id_idx').on(t.userId),
      statusIdx: index('sessions_status_idx').on(t.status),
      expiresAtIdx: index('sessions_expires_at_idx').on(t.expiresAt),
    }
  },
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
