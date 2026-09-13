import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch
} from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger"
import { lastValueFrom } from "rxjs"

import { GetMeResponse, PatchUserRequest } from "./dto"
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
		const { user } = await lastValueFrom(this.client.getMe({ id: userId }))

		return user
	}

	@ApiOperation({
		summary: "Update current user profile",
		description:
			"Partial update of public account data. Allows targeted changes to the name (`name`)."
	})
	@ApiBearerAuth()
	@Protected()
	@Patch("")
	@HttpCode(HttpStatus.OK)
	public async update(
		@CurrentUser("id") userId: string,
		@Body() dto: PatchUserRequest
	) {
		return this.client.update({ userId, ...dto })
	}
}
