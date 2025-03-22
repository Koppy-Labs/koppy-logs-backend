import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core'

import { servers } from './servers'
import { users } from './users'

export const serverMemberRoles = pgEnum('server_member_roles', [
  'admin',
  'member',
])

export const serverMembers = pgTable('server_members', {
  id: text('id').primaryKey(),
  serverId: text('server_id').references(() => servers.id),
  userId: text('user_id').references(() => users.id),

  role: serverMemberRoles('role').notNull().default('member'),
})

export const serverMembersRelations = relations(serverMembers, ({ one }) => ({
  server: one(servers, {
    fields: [serverMembers.serverId],
    references: [servers.id],
  }),
  user: one(users, {
    fields: [serverMembers.userId],
    references: [users.id],
  }),
}))
