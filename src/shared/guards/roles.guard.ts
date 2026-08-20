import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { Role } from "@qb1tycinema/contracts/gen/account"
import type { Request } from "express"
import { lastValueFrom } from "rxjs"

import { ROLES_KEY } from "../decorators"

import { AccountClientGrpc } from "@/modules/account/account.grpc"

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(
		private readonly reflector: Reflector,
		private readonly accountClient: AccountClientGrpc
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if (!required || required.length === 0) {
			return true
		}

		const request = context.switchToHttp().getRequest<Request>()

		const user = request.user

		if (!user) {
			throw new ForbiddenException("User context missing")
		}

		const account = await lastValueFrom(
			this.accountClient.getAccount({ id: user.id })
		)

		if (!account) {
			throw new NotFoundException("Account not found")
		}

		if (!required.includes(account.role)) {
			throw new ForbiddenException(
				"You do not have permission to access this resource"
			)
		}

		return true
	}
}
