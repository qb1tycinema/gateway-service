import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
	public health() {
		return {
			status: "ok",
			timestamp: new Date().toISOString()
		}
	}
}
