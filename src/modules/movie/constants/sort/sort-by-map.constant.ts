import { SortBy } from "@qb1tycinema/contracts/gen/movie"

export const SORT_BY_MAP: Record<string, SortBy> = {
	date: SortBy.SORT_BY_RELEASE_DATE,
	year: SortBy.SORT_BY_RELEASE_YEAR
}
