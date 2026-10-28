import { Injectable } from "@nestjs/common"
import type { ClientGrpc } from "@nestjs/microservices"
import { AbstractGrpcClient, InjectGrpcClient } from "@qb1tycinema/common"
import type { MovieServiceClient } from "@qb1tycinema/contracts/gen/movie"

@Injectable()
export class MovieClientGrpc extends AbstractGrpcClient<MovieServiceClient> {
	public constructor(@InjectGrpcClient("MOVIE_PACKAGE") client: ClientGrpc) {
		super(client, "MovieService")
	}
}
