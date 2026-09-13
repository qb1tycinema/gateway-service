import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString, IsUrl } from "class-validator"

export class PatchUserRequest {
	@ApiPropertyOptional({
		example: "Arsen Saparbek"
	})
	@IsOptional()
	@IsString()
	public name?: string
}
