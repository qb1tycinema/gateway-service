import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor
} from "@nestjs/common"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import type { Request, Response } from "express"
import { Counter, Gauge, Histogram } from "prom-client"
import type { Observable } from "rxjs"

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
	private readonly serviceName!: string

	public constructor(
		@InjectMetric("http_requests_total")
		private readonly counter: Counter<string>,
		@InjectMetric("http_request_duration_seconds")
		private readonly historgram: Histogram<string>,
		@InjectMetric("http_requests_in_flight")
		private readonly inFlight: Gauge<string>
	) {
		this.serviceName = "gateway-service"
	}

	public intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> {
		const req = context.switchToHttp().getRequest<Request>()
		const res = context.switchToHttp().getResponse<Response>()

		const method = req.method
		const route = req.route.path || "unknown"

		return "" as any
	}
}
