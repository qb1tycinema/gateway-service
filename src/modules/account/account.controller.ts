import { Controller, Get } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger"

import { AccountClientGrpc } from "./account.grpc"
import { CurrentUser, Protected } from "@/shared/decorators"

@Controller("account")
export class AccountController {
	public constructor(
		private readonly client: AccountClientGrpc,
		private readonly config: ConfigService
	) {}

	@ApiOperation({
        summary: "Get current user profile",
        description: "Retrieves the account details of the currently authenticated user."
    })
	@ApiBearerAuth()
	@Protected()
	@Get()
	public async getAccount(@CurrentUser("id") id: string) {
		return this.client.getAccount({ id })
	}
}
