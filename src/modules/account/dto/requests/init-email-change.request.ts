import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class InitEmailChangeRequest {
	@ApiProperty({
		example: "arman205082@gmail.com"
	})
	@IsNotEmpty()
	@IsEmail()
	public email!: string
}
