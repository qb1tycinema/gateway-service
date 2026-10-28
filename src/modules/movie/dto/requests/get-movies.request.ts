import { ApiPropertyOptional } from "@nestjs/swagger"
import {
	AgeFilter,
	DurationFilter,
	SortBy,
	SortOrder,
	YearFilter
} from "@qb1tycinema/contracts/gen/movie"
import { Transform } from "class-transformer"
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min
} from "class-validator"

import {
	AGE_FILTER_MAP,
	DURATION_FILTER_MAP,
	YEAR_FILTER_MAP
} from "../../constants/filter"
import { SORT_BY_MAP, SORT_ORDER_MAP } from "../../constants/sort"

export class GetMoviesRequest {
	@ApiPropertyOptional({
		example: "classic"
	})
	@IsOptional()
	@IsString()
	@Transform(({ value }) => value.toString().trim())
	public category!: string

	@ApiPropertyOptional({
		example: true
	})
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => {
		if (value === "true") return true
		if (value === "false") return false

		return value
	})
	public random!: boolean

	@ApiPropertyOptional({
		example: 20
	})
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(60)
	@Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
	public limit!: number

	@ApiPropertyOptional({
		enum: Object.keys(SORT_ORDER_MAP),
		example: "desc"
	})
	@IsOptional()
	@Transform(({ value }) => SORT_ORDER_MAP[value?.toLowerCase()] ?? value)
	@IsEnum(SortOrder)
	public sortOrder!: SortOrder

	@ApiPropertyOptional({
		enum: Object.keys(SORT_BY_MAP),
		example: "date"
	})
	@IsOptional()
	@Transform(({ value }) => SORT_BY_MAP[value?.toLowerCase()] ?? value)
	@IsEnum(SortBy)
	public sortBy!: SortBy

	@ApiPropertyOptional({
		enum: Object.keys(YEAR_FILTER_MAP),
		example: "this_year"
	})
	@IsOptional()
	@Transform(({ value }) => YEAR_FILTER_MAP[value?.toLowerCase()] ?? value)
	@IsEnum(YearFilter)
	public filterYear!: YearFilter

	@ApiPropertyOptional({
		enum: Object.keys(DURATION_FILTER_MAP),
		example: "short"
	})
	@IsOptional()
	@Transform(
		({ value }) => DURATION_FILTER_MAP[value?.toLowerCase()] ?? value
	)
	@IsEnum(DurationFilter)
	public filterDuration!: DurationFilter

	@ApiPropertyOptional({
		enum: Object.keys(AGE_FILTER_MAP),
		example: "adult"
	})
	@IsOptional()
	@Transform(({ value }) => AGE_FILTER_MAP[value?.toLowerCase()] ?? value)
	@IsEnum(AgeFilter)
	public filterAge!: AgeFilter
}
