import { Module } from "@nestjs/common"
import { GrpcModule } from "@qb1tycinema/common"

import { AccountModule } from "../account/account.module"

import { MovieController } from "./movie.controller"
import { MovieClientGrpc } from "./movie.grpc"

@Module({
	imports: [AccountModule, GrpcModule.register(["MOVIE_PACKAGE"])],
	controllers: [MovieController],
	providers: [MovieClientGrpc],
	exports: [MovieClientGrpc]
})
export class MovieModule {}
