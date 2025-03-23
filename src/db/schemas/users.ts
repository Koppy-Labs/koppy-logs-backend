import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { servers } from './servers'
import { serverMembers } from './servers-members'
import { sessions } from './sessions'

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(createId),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatarUrl: text('avatar_url').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const usersRelations = relations(users, ({ many }) => ({
  servers: many(servers),
  memberAt: many(serverMembers),
  sessions: many(sessions),
}))
