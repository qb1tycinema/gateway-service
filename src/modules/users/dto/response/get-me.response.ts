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
		example: "https://qb1tycinema.kz/users/e04db416fc2aab147599c750906396d3"
	})
	public avatar!: string
}
