import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class TelegramVerifyRequest {
	@ApiProperty({
		example: "eyJpZCI6NjA4Nzk5NTg3MywiZmlyc3RfbmFtZSI6InFiMXR5Iiw..."
	})
	@IsString()
	@IsNotEmpty()
	public tgAuthResult!: string
}
