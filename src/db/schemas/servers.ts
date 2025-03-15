import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { categories } from './categories'
import { logs } from './logs'
import { users } from './users'

export const servers = pgTable('servers', {
  id: text('id').primaryKey().default(createId()),
  name: text('name').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id),

  imageUrl: text('image_url').notNull(),
  plan: text('plan').notNull().default('free'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const serverRelations = relations(servers, ({ many, one }) => ({
  logs: many(logs),
  categories: many(categories),
  owner: one(users, {
    fields: [servers.ownerId],
    references: [users.id],
  }),
}))
