import { Module } from "@nestjs/common"
import { GrpcModule } from "@qb1tycinema/common"

import { AccountModule } from "../account/account.module"

import { MediaClientGrpc } from "./media.grpc"

@Module({
	imports: [AccountModule, GrpcModule.register(["MEDIA_PACKAGE"])],
	controllers: [MediaClientGrpc],
	providers: [MediaClientGrpc]
})
export class MediaModule {}
