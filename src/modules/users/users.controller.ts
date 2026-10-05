import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch
} from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger"
import { PinoLogger } from "nestjs-pino"

import { GetMeResponse, PatchUserRequest } from "./dto"
import { UsersClientGrpc } from "./users.grpc"
import { CurrentUser, Protected } from "@/shared/decorators"

@Controller("users")
export class UsersController {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly client: UsersClientGrpc
	) {
		this.logger.setContext(UsersController.name)
	}

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
		this.logger.info({ userId }, "Gateway: Fetching user profile")

		const { user } = await this.client.call("getMe", { id: userId })

		this.logger.debug(
			{ userId },
			"Gateway: User profile received from microservice"
		)

		return user
	}

	@ApiOperation({
		summary: "Update current user profile",
		description:
			"Partial update of public account data. Allows targeted changes to the name (`name`)."
	})
	@ApiBearerAuth()
	@Protected()
	@Patch("me")
	@HttpCode(HttpStatus.OK)
	public async update(
		@CurrentUser("id") userId: string,
		@Body() dto: PatchUserRequest
	) {
		this.logger.info(
			{ userId, updatedFields: Object.keys(dto) },
			"Gateway: Dispatching user profile update"
		)

		const response = await this.client.call("patchUser", { ...dto, userId })

		this.logger.debug(
			{ userId },
			"Gateway: User profile updated successfully"
		)

		return response
	}
}
