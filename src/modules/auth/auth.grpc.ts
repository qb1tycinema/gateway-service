import { Inject, Injectable, OnModuleInit } from "@nestjs/common"
import type { ClientGrpc } from "@nestjs/microservices"
import {
	AuthServiceClient,
	SendOtpRequest
} from "@qb1tycinema/contracts/gen/auth"

@Injectable()
export class AuthClientGrpc implements OnModuleInit {
	private authService!: AuthServiceClient

	public constructor(
		@Inject("AUTH_PACKAGE")
		private readonly client: ClientGrpc
	) {}

	public onModuleInit() {
		this.authService =
			this.client.getService<AuthServiceClient>("AuthService")
	}

	public sendOtp(request: SendOtpRequest) {
		return this.authService.sendOtp(request)
	}
}
