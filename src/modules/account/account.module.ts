import { Module } from "@nestjs/common"
import { GrpcModule } from "@qb1tycinema/common"

import { AccountController } from "./account.controller"
import { AccountClientGrpc } from "./account.grpc"

@Module({
	imports: [GrpcModule.register(["ACCOUNT_PACKAGE"])],
	controllers: [AccountController],
	providers: [AccountClientGrpc],
	exports: [AccountClientGrpc]
})
export class AccountModule {}
