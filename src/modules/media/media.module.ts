import { Module } from "@nestjs/common"
import { GrpcModule } from "@qb1tycinema/common"

import { AccountModule } from "../account/account.module"

import { MediaController } from "./media.controller"
import { MediaClientGrpc } from "./media.grpc"

@Module({
	imports: [AccountModule, GrpcModule.register(["MEDIA_PACKAGE"])],
	controllers: [MediaController],
	providers: [MediaClientGrpc]
})
export class MediaModule {}
