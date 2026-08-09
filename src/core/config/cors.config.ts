import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface"
import { ConfigService } from "@nestjs/config"

export function getCorsConfig(config: ConfigService): CorsOptions {
	return {
		origin: config.getOrThrow<string>("HTTP_CORS").split(","),
		credentials: true
	}
}
