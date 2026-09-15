import { Injectable } from "@nestjs/common"
import type { ClientGrpc } from "@nestjs/microservices"
import { AbstractGrpcClient, InjectGrpcClient } from "@qb1tycinema/common"
import { UsersServiceClient } from "@qb1tycinema/contracts/gen/users"

@Injectable()
export class UsersClientGrpc extends AbstractGrpcClient<UsersServiceClient> {
	public constructor(@InjectGrpcClient("USERS_PACKAGE") client: ClientGrpc) {
		super(client, "UsersService")
	}
}
