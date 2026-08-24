import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, Length, Matches } from "class-validator"

export class ConfirmPhoneChangeRequest {
	@ApiProperty({
		example: "+77712169309"
	})
	@IsNotEmpty()
	@Matches(/^\+[1-9]\d{6,14}$/)
	public phone!: string

	@ApiProperty({
		example: "123456"
	})
	@IsNotEmpty()
	@IsNumberString()
	@Length(6, 6)
	public code!: string
}
