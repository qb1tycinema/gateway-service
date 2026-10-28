import { YearFilter } from "@qb1tycinema/contracts/gen/movie"

export const YEAR_FILTER_MAP: Record<string, YearFilter> = {
	this_year: YearFilter.YEAR_FILTER_THIS_YEAR,
	last_year: YearFilter.YEAR_FILTER_LAST_YEAR,
	retro: YearFilter.YEAR_FILTER_RETRO
}
