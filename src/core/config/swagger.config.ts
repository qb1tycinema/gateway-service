import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export function swaggerConfig(app: INestApplication): void {
	const swaggerConfig = new DocumentBuilder()
		.setTitle("Qb1tyCinema API")
		.setDescription("API Gateway for Qb1tyCinema microservices")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build()

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)

	SwaggerModule.setup("/documentation", app, swaggerDocument, {
		yamlDocumentUrl: "/openapi.yaml"
	})
}
