import { Controller, Get } from "@nestjs/common"
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger"

import { AppService } from "./app.service"
import { HealthResponse } from "./dto"

@Controller()
export class AppController {
	public constructor(private readonly appService: AppService) {}

	@ApiOperation({
		summary: "Health check",
		description: "Check if the gateway is running"
	})
	@ApiOkResponse({ 
		type: HealthResponse
	})
	@Get("/health")
	public health() {
		return this.appService.health()
	}
}
