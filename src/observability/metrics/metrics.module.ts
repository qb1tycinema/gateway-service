import { Global, Module } from "@nestjs/common";
import { makeHistogramProvider, PrometheusModule } from "@willsoto/nestjs-prometheus"

@Global()
@Module({
   imports: [
    PrometheusModule.register({
        path: "/metrics",
        defaultMetrics: {
            enabled: true
        }
    })
   ],
   providers: [
        makeHistogramProvider({
            name: "http_request_duration_seconds",
            help: "HTTP request latency",
            labelNames: ["service", "method", "route", "status"]
        }),
   ]
})
export class MetricsModule {}