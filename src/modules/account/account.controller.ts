import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { PinoLogger } from "nestjs-pino"

import { AccountClientGrpc } from "./account.grpc"
import {
	ConfirmEmailChangeRequest,
	ConfirmPhoneChangeRequest,
	InitEmailChangeRequest,
	InitPhoneChangeRequest
} from "./dto"
import { CurrentUser, Protected } from "@/shared/decorators"

@Controller("account")
export class AccountController {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly client: AccountClientGrpc,
		private readonly config: ConfigService
	) {
		this.logger.setContext(AccountController.name)
	}

	@ApiOperation({
		summary: "Get current user profile",
		description:
			"Retrieves the account details of the currently authenticated user."
	})
	@ApiBearerAuth()
	@Protected()
	@Get()
	@HttpCode(HttpStatus.OK)
	public async getAccount(@CurrentUser("id") id: string) {
		this.logger.info({ userId: id }, "Gateway: Fetching account profile")

		const response = await this.client.call("getAccount", { id })

		this.logger.debug(
			{ userId: id },
			"Gateway: Account profile received from microservice"
		)

		return response
	}

	@ApiOperation({
		summary: "Init email change",
		description: "Sends confirmation code to a new email address."
	})
	@ApiBearerAuth()
	@Protected()
	@Post("email/init")
	@HttpCode(HttpStatus.OK)
	public async initEmailChange(
		@Body() dto: InitEmailChangeRequest,
		@CurrentUser("id") id: string
	) {
		this.logger.info(
			{ userId: id, email: dto.email },
			"Gateway: Dispatching email change initialization"
		)

		const response = await this.client.call("initEmailChange", {
			...dto,
			userId: id
		})

		this.logger.debug(
			{ userId: id },
			"Gateway: Email change initialized successfully"
		)

		return response
	}

	@ApiOperation({
		summary: "Confirm email change",
		description: "Verifies confirmation code and updates user email."
	})
	@ApiBearerAuth()
	@Protected()
	@Post("email/confirm")
	@HttpCode(HttpStatus.OK)
	public async confirmEmailChange(
		@Body() dto: ConfirmEmailChangeRequest,
		@CurrentUser("id") id: string
	) {
		this.logger.info(
			{ userId: id, email: dto.email },
			"Gateway: Dispatching email change confirmation"
		)

		const response = await this.client.call("confirmEmailChange", {
			...dto,
			userId: id
		})

		this.logger.debug(
			{ userId: id },
			"Gateway: Email change confirmed successfully"
		)

		return response
	}

	@ApiOperation({
		summary: "Init phone change",
		description: "Sends confirmation code to a new phone number."
	})
	@ApiBearerAuth()
	@Protected()
	@Post("phone/init")
	@HttpCode(HttpStatus.OK)
	public async initPhoneChange(
		@Body() dto: InitPhoneChangeRequest,
		@CurrentUser("id") id: string
	) {
		this.logger.info(
			{ userId: id, phone: dto.phone },
			"Gateway: Dispatching phone change initialization"
		)

		const response = await this.client.call("initPhoneChange", {
			...dto,
			userId: id
		})

		this.logger.debug(
			{ userId: id },
			"Gateway: Phone change initialized successfully"
		)

		return response
	}

	@ApiOperation({
		summary: "Confirm phone change",
		description: "Verifies confirmation code and updates user phone."
	})
	@ApiBearerAuth()
	@Protected()
	@Post("phone/confirm")
	@HttpCode(HttpStatus.OK)
	public async confirmPhoneChange(
		@Body() dto: ConfirmPhoneChangeRequest,
		@CurrentUser("id") id: string
	) {
		this.logger.info(
			{ userId: id, phone: dto.phone },
			"Gateway: Dispatching phone change confirmation"
		)

		const response = await this.client.call("confirmPhoneChange", {
			...dto,
			userId: id
		})

		this.logger.debug(
			{ userId: id },
			"Gateway: Phone change confirmed successfully"
		)

		return response
	}
}
