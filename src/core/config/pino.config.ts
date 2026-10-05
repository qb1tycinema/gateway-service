import type { ConfigService } from "@nestjs/config"
import type { Params } from "nestjs-pino"

export function getPinoConfig(config: ConfigService): Params {
	return {
		pinoHttp: {
			level: config.getOrThrow<string>("LOGGER_LEVEL"),
			transport: {
				target: "pino/file",
				options: {
					destination: "/var/log/services/gateway/gateway.log",
					mkdir: true
				}
			},
			messageKey: "msg",
			customProps: () => ({
				service: "gateway-service"
			})
		}
	}
}
