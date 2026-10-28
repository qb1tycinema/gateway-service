import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query
} from "@nestjs/common"
import { PinoLogger } from "nestjs-pino"

import { GetMoviesRequest } from "./dto"
import { MovieClientGrpc } from "./movie.grpc"

@Controller("movies")
export class MovieController {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly client: MovieClientGrpc
	) {
		this.logger.setContext(MovieController.name)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async getAll(@Query() dto: GetMoviesRequest) {
		return this.client.call("listMovies", dto)
	}

	@Get(":slug")
	@HttpCode(HttpStatus.OK)
	public async getOne(@Param() slug: string) {
		return this.client.call("getMovie", { slug })
	}
}
