import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  category: text('category').notNull().default('general'),
  serverId: text('server_id').notNull(),
  message: text('message').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})

export const servers = sqliteTable('servers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id),
  imageUrl: text('image_url').notNull(),
  plan: text('plan').notNull().default('free'),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  serverId: text('server_id')
    .notNull()
    .references(() => servers.id),
  name: text('name').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(new Date()),
})
