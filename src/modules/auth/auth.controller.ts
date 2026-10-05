import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ApiOperation } from "@nestjs/swagger"
import type { Request, Response } from "express"
import { PinoLogger } from "nestjs-pino"

import { AuthClientGrpc } from "./auth.grpc"
import {
	SendOtpReguest,
	TelegramConsumeRequest,
	TelegramVerifyRequest,
	VerifyOtpRequest
} from "./dto"

@Controller("auth")
export class AuthController {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly client: AuthClientGrpc,
		private readonly config: ConfigService
	) {
		this.logger.setContext(AuthController.name)
	}

	@ApiOperation({
		summary: "Send otp code",
		description:
			"Sends a verification code to the user phone number or email."
	})
	@Post("otp/send")
	@HttpCode(HttpStatus.OK)
	public async sendOtp(@Body() dto: SendOtpReguest) {
		this.logger.info(
			{ identifier: dto.identifier, type: dto.type },
			"Gateway: Dispatching OTP send request"
		)

		const response = await this.client.call("sendOtp", dto)

		this.logger.debug(
			{ identifier: dto.identifier },
			"Gateway: OTP send request processed successfully"
		)

		return response
	}

	@ApiOperation({
		summary: "Verify otp code",
		description:
			"Verifies the code sent to the phone number or email address and returns a access token"
	})
	@Post("otp/verify")
	@HttpCode(HttpStatus.OK)
	public async verifyOtp(
		@Body() dto: VerifyOtpRequest,
		@Res({ passthrough: true }) res: Response
	) {
		this.logger.info(
			{ identifier: dto.identifier, type: dto.type },
			"Gateway: Dispatching OTP verification request"
		)

		const { accessToken, refreshToken } = await this.client.call(
			"verifyOtp",
			dto
		)

		this.logger.info(
			{ identifier: dto.identifier },
			"Gateway: OTP verified successfully, setting secure cookies"
		)

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return { accessToken }
	}

	@ApiOperation({
		summary: "Refresh access token",
		description: "Renews access token using refresh token from cookies"
	})
	@Post("refresh")
	@HttpCode(HttpStatus.OK)
	public async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		this.logger.debug("Gateway: Dispatching token refresh request")

		const refreshToken = req.cookies?.refreshToken

		if (!refreshToken) {
			this.logger.warn(
				"Gateway: Refresh attempt without refresh token in cookies"
			)
		}

		const { accessToken, refreshToken: newRefreshToken } =
			await this.client.call("refresh", { refreshToken })

		this.logger.info(
			"Gateway: Tokens refreshed successfully, updating cookies"
		)

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return { accessToken }
	}

	@ApiOperation({
		summary: "Logout",
		description: "Clears the refresh token cookie and logs the user out"
	})
	@Post("logout")
	@HttpCode(HttpStatus.OK)
	public async logout(@Res() res: Response) {
		this.logger.info("Gateway: Processing user logout, clearing cookies")

		res.cookie("refreshToken", "", {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			expires: new Date(0)
		})

		return {
			ok: true
		}
	}

	@ApiOperation({
		summary: "Init Telegram login",
		description:
			"Initiates the authentication process via Telegram and prepares the session state."
	})
	@Get("telegram")
	@HttpCode(HttpStatus.OK)
	public async telegramInit() {
		this.logger.info("Gateway: Initiating Telegram OAuth flow")

		const response = await this.client.call("telegramInit", {})

		this.logger.debug("Gateway: Telegram OAuth URL generated")

		return response
	}

	@ApiOperation({
		summary: "Verify Telegram login",
		description:
			"Verifies the Telegram authentication payload. Upon successful verification, sets an HTTP-only refresh token cookie and returns the access token."
	})
	@Post("telegram/verify")
	@HttpCode(HttpStatus.OK)
	public async telegramVerify(
		@Body() dto: TelegramVerifyRequest,
		@Res({ passthrough: true }) res: Response
	) {
		this.logger.info("Gateway: Verifying Telegram authentication payload")

		const query = JSON.parse(atob(dto.tgAuthResult))

		const telegramId = query.id

		this.logger.debug(
			{ telegramId },
			"Gateway: Dispatching Telegram verify request"
		)

		const result = await this.client.call("telegramVerify", { query })

		if ("url" in result && result.url) {
			this.logger.info(
				{ telegramId },
				"Gateway: Telegram account incomplete, returning redirect URL for bot session"
			)
			return result
		}

		if (
			"accessToken" in result &&
			"refreshToken" in result &&
			result.accessToken &&
			result.refreshToken
		) {
			this.logger.info(
				{ telegramId },
				"Gateway: Telegram login successful, setting secure cookies"
			)

			const { accessToken, refreshToken } = result

			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: this.config.get("NODE_ENV") !== "development",
				domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
				sameSite: "lax",
				maxAge: 30 * 24 * 60 * 60 * 1000
			})

			return {
				accessToken
			}
		}

		this.logger.warn(
			{ telegramId },
			"Gateway: Invalid Telegram login response from microservice"
		)
		throw new UnauthorizedException("Invalid Telegram login response")
	}

	@ApiOperation({
		summary: "Finalize Telegram authentication",
		description:
			"Accepts a session identifier (sessionId) verified by the Telegram bot and exchanges it for JWT tokens. The refresh token is automatically set in a secure httpOnly cookie, while the access token is returned in the response body."
	})
	@Post("telegram/finalize")
	@HttpCode(HttpStatus.OK)
	public async consume(
		@Body() dto: TelegramConsumeRequest,
		@Res({ passthrough: true }) res: Response
	) {
		this.logger.info(
			{ sessionId: dto.sessionId },
			"Gateway: Finalizing Telegram authentication session"
		)

		const { accessToken, refreshToken } = await this.client.call(
			"telegramConsume",
			dto
		)

		this.logger.info(
			{ sessionId: dto.sessionId },
			"Gateway: Telegram session consumed successfully, setting cookies"
		)

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return {
			accessToken
		}
	}
}
