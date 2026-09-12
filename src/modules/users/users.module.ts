import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { PROTO_PATHS } from "@qb1tycinema/contracts"

import { UsersClientGrpc } from "./users.grpc"
import { UsersController } from "./users.controller"
import { AccountModule } from "../account/account.module"

@Module({
	imports: [
		AccountModule,
		ClientsModule.registerAsync([
			{
				name: "USERS_PACKAGE",
				useFactory: (config: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: "users.v1",
						protoPath: PROTO_PATHS.USERS,
						url: config.getOrThrow<string>("USERS_GRPC_URL")
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	controllers: [UsersController],
	providers: [UsersClientGrpc],
	exports: [UsersClientGrpc]
})
export class UsersModule {}
