import { Injectable } from "@nestjs/common"
import type { ClientGrpc } from "@nestjs/microservices"
import { AbstractGrpcClient, InjectGrpcClient } from "@qb1tycinema/common"
import type { AccountServiceClient } from "@qb1tycinema/contracts/gen/account"

@Injectable()
export class AccountClientGrpc extends AbstractGrpcClient<AccountServiceClient> {
	public constructor(
		@InjectGrpcClient("ACCOUNT_PACKAGE") client: ClientGrpc
	) {
		super(client, "AccountService")
	}
}
