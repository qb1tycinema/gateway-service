import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@qb1tycinema/passport"
import { LoggerModule } from "nestjs-pino"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { getPassportConfig, getPinoConfig } from "./config"
import { AccountModule } from "@/modules/account/account.module"
import { AuthModule } from "@/modules/auth/auth.module"
import { MediaModule } from "@/modules/media/media.module"
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
		LoggerModule.forRootAsync({
			useFactory: getPinoConfig,
			inject: [ConfigService]
		}),
		PassportModule.registerAsync({
			useFactory: getPassportConfig,
			inject: [ConfigService]
		}),
		ObservabilityModule,
		AuthModule,
		AccountModule,
		UsersModule,
		MediaModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
