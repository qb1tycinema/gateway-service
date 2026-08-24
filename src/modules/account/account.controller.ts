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
		private readonly client: AccountClientGrpc,
		private readonly config: ConfigService
	) {}

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
		return this.client.getAccount({ id })
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
		return this.client.initEmailChange({ ...dto, userId: id })
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
		return this.client.confirmEmailChange({ ...dto, userId: id })
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
		return this.client.initPhoneChange({ ...dto, userId: id })
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
		return this.client.confirmPhoneChange({ ...dto, userId: id })
	}
}
