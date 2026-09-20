import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@qb1tycinema/passport"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { getPassportConfig } from "./config"
import { AccountModule } from "@/modules/account/account.module"
import { AuthModule } from "@/modules/auth/auth.module"
import { UsersModule } from "@/modules/users/users.module"
import { ObservabilityModule } from "@/observability/observability.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				".env"
			]
		}),
		PassportModule.registerAsync({
			useFactory: getPassportConfig,
			inject: [ConfigService]
		}),
		ObservabilityModule,
		AuthModule,
		AccountModule,
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
