import { ApiProperty } from "@nestjs/swagger"

export class HealthResponse {
	@ApiProperty({
		example: "ok"
	})
	public status!: string

	@ApiProperty({
		example: "2026-08-09T20:57:30.176Z"
	})
	public timestamp!: string
}
