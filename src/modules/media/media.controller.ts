import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation
} from "@nestjs/swagger"
import type { Multer } from "multer"
import { PinoLogger } from "nestjs-pino"

import { DeleteMediaRequest, UploadMediaRequest } from "./dto"
import { MediaClientGrpc } from "./media.grpc"
import { CurrentUser, Protected } from "@/shared/decorators"

@Controller()
export class MediaController {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly client: MediaClientGrpc
	) {
		this.logger.setContext(MediaController.name)
	}

	@ApiOperation({
		summary: "Upload media file",
		description: "Uploads a media file in chunks via gRPC stream to S3."
	})
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadMediaRequest })
	@ApiBearerAuth()
	@Protected()
	@Post("upload")
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor("file"))
	public async upload(
		@CurrentUser("id") userId: string,
		@UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
		file: Express.Multer.File,
		@Body() dto: UploadMediaRequest
	) {
		this.logger.info(
			{ userId, fileName: file.originalname, folder: dto.folder },
			"Gateway: Dispatching media file upload stream"
		)

		const response = await this.client.upload(file, dto.folder || "general")

		this.logger.debug(
			{ userId, key: response.key },
			"Gateway: Media file stream uploaded successfully"
		)

		return response
	}

	@ApiOperation({
		summary: "Delete media file",
		description: "Deletes a media file from S3 by its key."
	})
	@ApiBearerAuth()
	@Protected()
	@Delete()
	@HttpCode(HttpStatus.OK)
	public async deleteFile(
		@CurrentUser("id") userId: string,
		@Body() dto: DeleteMediaRequest
	) {
		this.logger.info(
			{ userId, key: dto.key },
			"Gateway: Dispatching media deletion"
		)

		const response = await this.client.call("delete", { key: dto.key })

		this.logger.debug(
			{ userId, key: dto.key },
			"Gateway: Media deleted successfully"
		)

		return response
	}
}
