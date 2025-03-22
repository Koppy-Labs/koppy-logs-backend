import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import type { User } from '@/domain/entities/user'

import { permissions } from './perms'
import type { Role } from './roles'
import { categorySubject } from './subjects/categories'
import { inviteSubject } from './subjects/invite'
import { logsSubject } from './subjects/logs'
import { serverSubject } from './subjects/server'
import { userSubject } from './subjects/user'

const appAbilitiesSchema = z.union([
  userSubject,
  serverSubject,
  inviteSubject,
  categorySubject,
  logsSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User & { role: Role }) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function')
    throw new Error(`Permissions for role ${user.role} not found`)

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
