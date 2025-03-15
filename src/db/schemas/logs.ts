import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { categories } from './categories'
import { servers } from './servers'

export const logs = pgTable('logs', {
  id: text('id').primaryKey().$defaultFn(createId),
  serverId: text('server_id').notNull(),

  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),

  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const logRelations = relations(logs, ({ one }) => ({
  server: one(servers, {
    fields: [logs.serverId],
    references: [servers.id],
  }),
  category: one(categories, {
    fields: [logs.categoryId],
    references: [categories.id],
  }),
}))
