import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class DeleteMediaRequest {
	@ApiProperty({
		example: "avatars/123.jpg",
		description: "Ключ (путь) медиафайла в S3 для удаления"
	})
	@IsNotEmpty()
	@IsString()
	public key!: string
}
