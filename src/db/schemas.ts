import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey().default(createId()),
  serverId: text('server_id').notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
  message: text('message').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})

export const servers = sqliteTable('servers', {
  id: text('id').primaryKey().default(createId()),
  name: text('name').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id),
  imageUrl: text('image_url').notNull(),
  plan: text('plan').notNull().default('free'),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey().default(createId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().default(createId()),
  serverId: text('server_id')
    .notNull()
    .references(() => servers.id),
  name: text('name').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})

export const serverRelations = relations(servers, ({ many, one }) => ({
  logs: many(logs),
  categories: many(categories),
  owner: one(users, {
    fields: [servers.ownerId],
    references: [users.id],
  }),
  users: many(users),
}))

export const categoryRelations = relations(categories, ({ one }) => ({
  server: one(servers, {
    fields: [categories.serverId],
    references: [servers.id],
  }),
}))

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

export const usersRelations = relations(users, ({ many }) => ({
  servers: many(servers),
}))
