import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class GetMeResponse {
	@ApiProperty({
		example: "Rm07jiAB9xfI2qeAMc"
	})
	public id!: string

	@ApiPropertyOptional({
		example: "Arsen Saparbek"
	})
	public name!: string

	@ApiProperty({
		example: "arman205082@gmail.com"
	})
	public email!: string

	@ApiProperty({
		example: "+77712169309"
	})
	public phone!: string

	@ApiPropertyOptional({
		example: "users/e04db416fc2aab147599c750906396d3.webp"
	})
	public avatar!: string
}
