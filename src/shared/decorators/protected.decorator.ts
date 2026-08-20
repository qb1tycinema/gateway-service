import { applyDecorators, UseGuards } from "@nestjs/common"
import type { Role } from "@qb1tycinema/contracts/gen/account"

import { AuthGuard, RolesGuard } from "../guards"

import { Roles } from "./roles.decorator"

export const Protected = (...roles: Role[]) => {
	if (roles.length === 0) {
		applyDecorators(UseGuards(AuthGuard))
	}

	return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard))
}
