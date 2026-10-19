import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	ParseFilePipe,
	Patch,
	UploadedFile,
	UseInterceptors
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiOperation
} from "@nestjs/swagger"
import { PinoLogger } from "nestjs-pino"

import { MediaClientGrpc } from "../media/media.grpc"

import { GetMeResponse, PatchUserRequest } from "./dto"
import { UsersClientGrpc } from "./users.grpc"
import { AvatarUploadOptions } from "@/shared/config"
import { CurrentUser, Protected } from "@/shared/decorators"

@Controller("users")
export class UsersController {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly users: UsersClientGrpc,
		private readonly media: MediaClientGrpc
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

		const { user } = await this.users.call("getMe", { id: userId })

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

		const response = await this.users.call("patchUser", { ...dto, userId })

		this.logger.debug(
			{ userId },
			"Gateway: User profile updated successfully"
		)

		return response
	}

	@ApiOperation({
		summary: "Update user avatar",
		description: "Upload a new avatar for the authenticated user"
	})
	@ApiBody({
		description: "Image file to upload",
		schema: {
			type: "object",
			properties: {
				file: { type: "string", format: "binary" }
			}
		}
	})
	@ApiConsumes("multipart/form-data")
	@ApiBearerAuth()
	@Protected()
	@Patch("me/avatar")
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor("file", AvatarUploadOptions))
	public async updateAvatar(
		@CurrentUser("id") userId: string,
		@UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
		file: Express.Multer.File
	) {
		this.logger.info(
			{ userId, fileName: `User ID: ${userId}`, folder: "users" },
			"Gateway: Dispatching media file upload stream"
		)

		const response = await this.media.upload(file, "users")

		this.logger.debug(
			{ userId, key: response.key },
			"Gateway: Media file stream uploaded successfully"
		)

		return this.users.call("patchUser", { userId, avatar: response.key })
	}
}
