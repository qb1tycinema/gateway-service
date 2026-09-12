import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger"

import { CurrentUser, Protected } from "@/shared/decorators"
import { UsersClientGrpc } from "./users.grpc"

@Controller("users")
export class UsersController {
	public constructor(
		private readonly client: UsersClientGrpc
	) {}

	@ApiOperation({
		summary: "Get current user profile",
		description: "Returns authenticated user profile data."
	})
	@ApiBearerAuth()
	@Protected()
	@Get("me")
	@HttpCode(HttpStatus.OK)
	public async getMe(@CurrentUser("id") userId: string) {
		return this.client.getMe({ id: userId })
	}
}
