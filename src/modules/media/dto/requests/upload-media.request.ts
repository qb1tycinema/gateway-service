import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UploadMediaRequest {
	@ApiProperty({
		type: "string",
		format: "binary",
		description: "Медиафайл для загрузки"
	})
	public file!: any

	@ApiPropertyOptional({
		example: "avatars",
		description: "Папка в S3 бакете (по умолчанию: general)"
	})
	@IsOptional()
	@IsString()
	public folder?: string
}
