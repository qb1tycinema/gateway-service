import { Injectable } from "@nestjs/common"
import type { ClientGrpc } from "@nestjs/microservices"
import { AbstractGrpcClient, InjectGrpcClient } from "@qb1tycinema/common"
import type { AuthServiceClient } from "@qb1tycinema/contracts/gen/auth"

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
	public constructor(@InjectGrpcClient("AUTH_PACKAGE") client: ClientGrpc) {
		super(client, "AuthService")
	}
}
