import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { servers } from './servers'

export const categories = pgTable('categories', {
  id: text('id').primaryKey().$default(createId),
  serverId: text('server_id')
    .notNull()
    .references(() => servers.id),

  name: text('name').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const categoryRelations = relations(categories, ({ one }) => ({
  server: one(servers, {
    fields: [categories.serverId],
    references: [servers.id],
  }),
}))
