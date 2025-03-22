import { type User } from '@/domain/entities/user'
import { defineAbilityFor } from '@/perms'
import { type Role } from '@/perms/roles'

export function getUserPermissions(user: User & { role: Role }) {
  const ability = defineAbilityFor(user)

  return ability
}
