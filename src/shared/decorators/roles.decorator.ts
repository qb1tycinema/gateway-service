import { SetMetadata } from "@nestjs/common"
import type { Role } from "@qb1tycinema/contracts/gen/account"

export const ROLES_KEY = "required_roles"

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
