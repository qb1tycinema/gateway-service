import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger"

import { GetMeResponse } from "./dto"
import { UsersClientGrpc } from "./users.grpc"
import { CurrentUser, Protected } from "@/shared/decorators"

@Controller("users")
export class UsersController {
	public constructor(private readonly client: UsersClientGrpc) {}

	@ApiOperation({
		summary: "Get current user profile",
		description: "Returns authenticated user profile data."
	})
	@ApiOkResponse({ type: GetMeResponse })
	@ApiBearerAuth()
	@Protected()
	@Get("me")
	@HttpCode(HttpStatus.OK)
	public async getMe(@CurrentUser("id") userId: string) {
		return this.client.getMe({ id: userId })
	}
}
