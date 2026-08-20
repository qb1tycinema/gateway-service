import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common"
import { PassportService } from "@qb1tycinema/passport"
import type { Request } from "express"

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly passportService: PassportService) {}

	public canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>()

		const token = this.extractToken(request)

		if (!token) {
			throw new UnauthorizedException("Authorization")
		}

		const { valid, reason, userId } = this.passportService.verify(token)

		if (!valid) {
			throw new UnauthorizedException(reason)
		}

		request.user = {
			id: String(userId)
		}

		return true
	}

	private extractToken(request: Request) {
		const header = request.headers.authorization

		if (!header) {
			throw new UnauthorizedException("Authorization")
		}

		if (!header.startsWith("Bearer ")) {
			throw new UnauthorizedException("Authorization")
		}

		const token = header.replace(/^Bearer\s+/i, "").trim()

		return token
	}
}
