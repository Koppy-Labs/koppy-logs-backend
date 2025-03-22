import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {
    cannot(['transfer_ownership', 'update'], 'server')
    can(['transfer_ownership', 'update'], 'server', {
      ownerId: {
        $eq: user.id,
      },
    })

    can('manage', 'invite')
    can('manage', 'user')
    can('update', 'server')
  },
  MEMBER: (user, { can, cannot }) => {
    cannot(['transfer_ownership', 'update'], 'server')
    can(['transfer_ownership', 'update'], 'server', {
      ownerId: {
        $eq: user.id,
      },
    })

    can('view', 'server')
    can('manage', 'category')
    can('manage', 'logs')
  },
}
