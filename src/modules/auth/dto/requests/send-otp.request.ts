import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString, Validate } from "class-validator"

import { IdentifierValidator } from "@/shared/validators"

export class SendOtpReguest {
	@ApiProperty({ example: "+77712169309" })
	@IsString()
	@Validate(IdentifierValidator)
	public identifier!: string

	@ApiProperty({ example: "phone", enum: ["phone", "email"] })
	@IsEnum(["phone", "email"])
	public type!: "phone" | "email"
}
