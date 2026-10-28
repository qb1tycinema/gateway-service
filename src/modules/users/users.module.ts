import { Module } from "@nestjs/common"
import { GrpcModule } from "@qb1tycinema/common"

import { AccountModule } from "../account/account.module"
import { MediaClientGrpc } from "../media/media.grpc"

import { UsersController } from "./users.controller"
import { UsersClientGrpc } from "./users.grpc"

@Module({
	imports: [
		AccountModule,
		GrpcModule.register(["USERS_PACKAGE", "MEDIA_PACKAGE"])
	],
	controllers: [UsersController],
	providers: [UsersClientGrpc, MediaClientGrpc],
	exports: [UsersClientGrpc]
})
export class UsersModule {}
