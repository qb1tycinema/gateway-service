import { Module, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"

@Module({})
export class TracingModule implements OnModuleInit {
	public constructor(private readonly configService: ConfigService) {}

	public async onModuleInit() {
		const traceExporter = new OTLPTraceExporter({
			url: this.configService.getOrThrow<string>("JAEGER_URL")
		})

		const sdk = new NodeSDK({
			traceExporter,
			resource: resourceFromAttributes({
				[ATTR_SERVICE_NAME]: "gateway-service"
			}),
			instrumentations: [
				getNodeAutoInstrumentations({
					"@opentelemetry/instrumentation-http": { enabled: true },
					"@opentelemetry/instrumentation-express": { enabled: true },
					"@opentelemetry/instrumentation-nestjs-core": {
						enabled: true
					},
					"@opentelemetry/instrumentation-grpc": { enabled: true }
				})
			]
		})

		await sdk.start()
	}
}
