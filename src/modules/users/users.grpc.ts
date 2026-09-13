import { Inject, Injectable, OnModuleInit } from "@nestjs/common"
import type { ClientGrpc } from "@nestjs/microservices"
import type {
	GetMeRequest,
	PatchUserRequest,
	UsersServiceClient
} from "@qb1tycinema/contracts/gen/users"

@Injectable()
export class UsersClientGrpc implements OnModuleInit {
	private usersService!: UsersServiceClient

	public constructor(
		@Inject("USERS_PACKAGE") private readonly client: ClientGrpc
	) {}

	public onModuleInit() {
		this.usersService =
			this.client.getService<UsersServiceClient>("UsersService")
	}

	public getMe(request: GetMeRequest) {
		return this.usersService.getMe(request)
	}

	public update(request: PatchUserRequest) {
		return this.usersService.patchUser(request)
	}
}
