import type { ConfigService } from "@nestjs/config"
import type { PassportOptions } from "@qb1tycinema/passport"

export function getPassportConfig(config: ConfigService): PassportOptions {
	return {
		secretKey: config.getOrThrow<string>("TOKEN_SECRET_KEY")
	}
}
