import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { PROTO_PATHS } from "@qb1tycinema/contracts"

import { AccountController } from "./account.controller"
import { AccountClientGrpc } from "./account.grpc"

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "ACCOUNT_PACKAGE",
				useFactory: (config: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: "account.v1",
						protoPath: PROTO_PATHS.ACCOUNT,
						url: config.getOrThrow<string>("AUTH_GRPC_URL")
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	controllers: [AccountController],
	providers: [AccountClientGrpc],
	exports: [AccountClientGrpc]
})
export class AccountModule {}
