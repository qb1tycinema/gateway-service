import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, Matches } from "class-validator"

export class InitPhoneChangeRequest {
	@ApiProperty({
		example: "+77712169309"
	})
	@IsNotEmpty()
	@Matches(/^\+[1-9]\d{6,14}$/)
	public phone!: string
}
