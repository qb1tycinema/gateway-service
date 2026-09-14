import { Module } from "@nestjs/common"
import { GrpcModule } from "@qb1tycinema/common"

import { AccountModule } from "../account/account.module"

import { UsersController } from "./users.controller"
import { UsersClientGrpc } from "./users.grpc"

@Module({
	imports: [AccountModule, GrpcModule.register(["USERS_PACKAGE"])],
	controllers: [UsersController],
	providers: [UsersClientGrpc],
	exports: [UsersClientGrpc]
})
export class UsersModule {}
