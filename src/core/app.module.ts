import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@qb1tycinema/passport"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { getPassportConfig } from "./config"
import { AuthModule } from "@/modules/auth/auth.module"
import { AccountModule } from "@/modules/account/account.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		PassportModule.registerAsync({
			useFactory: getPassportConfig,
			inject: [ConfigService]
		}),
		AuthModule,
		AccountModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
